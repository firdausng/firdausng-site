---
title: 'Sending transactional email from Cloudflare Workers with raw fetch (not the Resend SDK)'
date: "2026-05-12"
description: The Resend SDK works on Workers, but raw fetch is smaller, has nothing to shim, and gives you full control of failure handling. Worked example from Gee Ledger's invitation, invoice, and support email handlers — plus the one place the SDK still earns its keep.
categories:
  - cloudflare worker
  - resend
  - email
  - sveltekit
  - geeledger
author: Me
published: true
featured: true
appCta: geeledger
---

Email on Cloudflare Workers has a default everyone reaches for: `import { Resend } from 'resend'`. I did too, at first. Then I ripped it out of every place I controlled in [Gee Ledger](https://geeledger.com) — invitations, invoices, receipts, support tickets — and replaced it with seven lines of `fetch`. The SDK still lives in the codebase for exactly one path. This post is about which one, and why.

## Background

Gee Ledger sends three kinds of transactional email from Workers: **member invitations** when an owner adds a teammate to a business, **invoice or receipt sharing** when a transaction gets emailed to a customer, and **support contact** when someone hits the in-app help form. All three go through Resend, all three are now raw `fetch`.

The boring setup is the same as any Resend project — verify a sending domain in the Resend dashboard, drop the API key into `wrangler secret put RESEND_API_KEY`, and reference `RESEND_FROM_DOMAIN` from `wrangler.jsonc` `vars`. The interesting part is what the *handler code* looks like once the keys exist, and that's where the SDK stops earning its place.

## The shape of a raw-fetch email sender

Here's the entire invitation email function, top to bottom.

```ts file=src/lib/server/email/sendInvitationEmail.ts
export async function sendInvitationEmail(opts: {
    to: string;
    businessName: string;
    inviterName: string;
    roleName: string;
    signInUrl: string;
    resendApiKey: string;
    fromDomain: string;
    appDomain: string;
    type: 'invited' | 'added';
}): Promise<void> {
    const { to, businessName, resendApiKey, fromDomain, type } = opts;

    const subject = type === 'added'
        ? `You've been added to ${businessName}`
        : `You've been invited to join ${businessName}`;

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type':  'application/json',
        },
        body: JSON.stringify({
            from:    `Gee Ledger <noreply@${fromDomain}>`,
            to:      [to],
            subject,
            html:    buildHtml(opts),
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        console.error(`Failed to send invitation email: ${res.status} ${body}`);
    }
}
```

Five things here aren't incidental:

- **No module-level env access.** The function takes `resendApiKey` and `fromDomain` as parameters. That makes it usable from any handler context — Hono, SvelteKit `+server.ts`, Cloudflare Queues — and trivial to test with a stubbed key. The "config" is whatever the caller hands it.
- **The endpoint is boring.** `POST https://api.resend.com/emails`, `Authorization: Bearer ...`, `Content-Type: application/json`. That's the entire API surface this code uses.
- **The body is plain JSON.** `from`, `to`, `subject`, `html`. Want plain text? Add `text`. Want a reply-to address? Add `reply_to`. Attachments? `attachments: [{ filename, content }]`. The keys are exactly what the SDK's typed method would forward — minus the abstraction layer.
- **HTML is composed inline** by a `buildHtml(opts)` helper that returns a template string. Templating is its own conversation — drop in MJML, React Email, or something else and only the helper changes. The transport doesn't care.
- **It does not throw on non-OK.** This particular sender is fire-and-forget — the caller (invitation creation) needs to succeed even if email delivery doesn't, and the error gets logged for later inspection. That's a *handler* decision, not a library decision. The next sender does the opposite.

## Failure handling is the handler's call, not the library's

The transaction-sharing path looks structurally identical until the very end:

```ts file=src/lib/server/email/sendTransactionEmail.ts
const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type':  'application/json',
    },
    body: JSON.stringify({
        from:    `${business.name} <receipts@${fromDomain}>`,
        to:      [to],
        subject: `${title} from ${business.name}`,
        html:    buildHtml(opts),
    }),
});

if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send email: ${res.status} ${body}`);
}
```

Same call shape. Different failure mode — this one *throws*. The caller is `shareTransactionHandler`, which a user hits by clicking "Send via email" on an invoice:

```ts file=src/lib/server/api/transactions/shareTransactionHandler.ts
if (!env.RESEND_API_KEY) {
    throw new HTTPException(503, { message: 'Email service not configured.' });
}
// ...
await sendTransactionEmail({
    to:           recipient.email,
    business,
    transaction,
    resendApiKey: env.RESEND_API_KEY,
    fromDomain:   env.RESEND_FROM_DOMAIN,
    appDomain:    env.APP_DOMAIN,
});
```

The contrast is the whole point:

- **Sharing an invoice is user-initiated.** If the email doesn't go out, the user needs to know — they clicked "Send" and expected an email out. So this sender throws, the handler propagates a 5xx, and the UI shows an error. Fire-and-forget would silently lie to the user.
- **Sending an invitation is part of a multi-step write.** The invitation row in the database is the source of truth; the email is the notification. If the email fails, the invitee can still accept via their in-app pending-invitations list, so logging and continuing is the correct behaviour.

When the email-sending code is a thin function you call directly, you wire success and failure into your own control flow. An SDK with `try/catch` hidden inside its method does the same thing under the covers — but you've added a dependency to get behaviour you wrote in three lines.

## Why this beats `import { Resend } from 'resend'` on Workers

Not religious, just practical:

- **Smaller bundle.** The Resend SDK and its dependencies add measurable weight to the worker bundle that gets uploaded on every deploy. Raw `fetch` is a few hundred bytes of code you wrote yourself. On Workers — where the bundle is the deploy unit and cold-start cost is real — that's not nothing, especially if you also bundle Drizzle, Hono, an auth library, and an analytics SDK.
- **No compatibility surface to worry about.** Workers is not Node. Most current SDK versions work, but you're still relying on the SDK author's testing against the Workers runtime and the `compatibility_date` you're on. Raw `fetch` uses the runtime's own [`fetch`](https://developers.cloudflare.com/workers/runtime-apis/fetch/) — there's nothing to shim and nothing to break on a compat-date bump.
- **No SDK churn to chase.** Resend's HTTP API is stable; their SDK ships minor versions frequently. With raw `fetch` you aren't pinned to a particular SDK release just to keep dependency audits clean.
- **Easier to test.** A function that takes `resendApiKey: string` and calls `fetch` is trivial to test — replace `globalThis.fetch` for the test, assert on the request body, done. With the SDK, you're either mocking the SDK's classes (brittle) or running against the real Resend API (slow and pollutes the dashboard).

## When the SDK still earns its place

The same codebase still uses the Resend SDK in exactly one file — `src/lib/server/email/mailService.ts` — and it's wired into [better-auth](https://better-auth.com)'s `sendVerificationEmail` callback:

```ts file=src/lib/server/better-auth/index.ts
sendVerificationEmail: async ({ user, url }) => {
    const emailService = new MailService(env);
    await emailService.sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
    });
}
```

Why keep the SDK here?

- **The callback is already a thin pass-through.** better-auth hands you `{ user, url, token }` and asks you to send a plain-text email. There's no rich HTML template, no nuanced failure handling — `sendEmail({ to, subject, text })` is the whole job. Wrapping the SDK's `Resend.emails.send(...)` to match that signature is shorter than reimplementing it.
- **The integration boundary is one file.** This is the only place the SDK is imported. If Resend ever changes shape, there's exactly one consumer to update.
- **The cost is paid once.** The SDK is loaded as part of auth wiring, not re-imported per email.

The rule of thumb I've landed on: **own the email-sending path where the failure-handling and templating decisions are yours; reach for an SDK only at boundaries that are already thin wrappers around someone else's contract.**

## Gotchas worth writing down

Short list of things that surface only after running this in production for a while:

- **API key into `wrangler secret put`, not `wrangler.jsonc` vars.** It's the obvious mistake, and it stays a leak forever once it's in your git history. Plain config like `RESEND_FROM_DOMAIN` lives in `vars`; the secret does not.
- **`from` must be on a verified domain.** Resend returns 403 if it isn't. The error body is clear, but if your handler swallows it (fire-and-forget) you'll see "no email arrived" with no obvious cause. Always log the response body on non-OK, like the examples above do.
- **Local dev: use the test API key, or send to `delivered@resend.dev`.** Resend's test key accepts but doesn't deliver — you see the send in the dashboard, no actual mail goes out. Don't email yourself from `localhost` in a tight retry loop; you'll trip rate limits or get filtered as spam.
- **Rate limits exist.** Resend's free tier is 100 emails per day, 3,000 per month. Past that you're on a paid plan. If you're cron-emailing thousands of users, plan for it.
- **Attachments are just a JSON field.** No magic. `attachments: [{ filename: 'invoice-INV-001.pdf', content: base64String }]` is the entire shape. The support-email handler in Gee Ledger uses this directly — no SDK helper needed.

## Closing

Workers is a runtime that's good at one HTTPS call. Resend's "send email" API is one HTTPS call. The SDK is an extra layer between those two facts, and for the email paths where the decisions about templating, failure handling, and config are yours, most of the time you don't need it. Keep it for the callbacks you don't own; rip it out everywhere else.
