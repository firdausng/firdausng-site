---
title: 'Managing multiple Git SSH keys for GitHub on Windows'
date: '2023-07-24'
updated: '2026-04-22'
categories:
  - git
  - github
  - windows
published: true
image: /images/Managing-Multiple-Git-SSH-Keys-for-Git-on-Windows.jpg
author: Me
description: "Working with multiple GitHub accounts on one Windows machine means one SSH key per account, plus an SSH config alias so git knows which key to use per host. Five steps — generate the keys, add them to the agent, write the config file, rewrite the remote URL, and upload the public keys."
---

Working with multiple GitHub accounts on one Windows machine means one SSH key per account, plus an SSH config alias so git knows which key to use per host. The whole setup is five steps once, then you never think about it again.
## Step 1: Generate the SSH keys
First, let's create two separate SSH keys for each of your GitHub accounts. Open a Command Prompt or PowerShell window, and use the ssh-keygen command to generate the keys:

```shell
# Generate first SSH key
ssh-keygen -t rsa -C "your_email@example.com" -f C:\Users\your_user\.ssh\github_key1

# Generate second SSH key
ssh-keygen -t rsa -C "your_email@example.com" -f C:\Users\your_user\.ssh\github_key2
```

Replace `your_user` with your actual username and `your_email@example.com` with the email associated with the first GitHub account. For the second GitHub account, you can use the same email or a different one.

## Step 2: Add the SSH keys to the SSH agent

Next, we'll add both generated SSH keys to the SSH agent to manage them conveniently:

```shell
# Start the SSH agent (if not running already)
eval $(ssh-agent)

# Add first SSH key
ssh-add C:\Users\your_user\.ssh\github_key1

# Add second SSH key
ssh-add C:\Users\your_user\.ssh\github_key2
```

If you set a passphrase for the SSH keys, you'll be prompted to enter it during this step.


## Step 3: Configure the SSH config file

Now, let's use the SSH config file to associate each key with the respective GitHub account. Open a text editor and create a new file named `config` inside your `.ssh` directory (usually located at `C:\Users\your_user\.ssh\config`). If the file already exists, you can edit it.

Add the following configuration for the first GitHub account:

```shell
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/github_key1
```

Replace `github_key1` with the appropriate filename of the SSH private key for your first GitHub account. Then, configure the second GitHub account just below the first one:

```shell
Host github.com-seconduser
HostName github.com
User git
IdentityFile ~/.ssh/github_key2
```

Replace `github_key2` with the appropriate filename of the SSH private key for your second GitHub account.

## Step 4: Update Git remote URLs

With the SSH config file set up, you need to update your Git remote URLs to use the custom host defined in the SSH config. For existing repositories, use the following command:

```shell
git remote set-url origin git@github.com-seconduser:user2/repo2.git
```

For new repositories, clone them using the custom host:

```shell
git clone git@github.com-seconduser:user2/repo2.git
```

## Step 5: Add public keys to your GitHub accounts

Finally, go to GitHub and add the respective public keys (`github_key1.pub` and `github_key2.pub`) to the corresponding GitHub accounts, just as mentioned in the previous steps.

From here on, git uses the SSH key that matches the host alias in the remote URL — `github.com` picks up `github_key1`, `github.com-seconduser` picks up `github_key2`. The only time you touch any of this again is when you add a third account, at which point you repeat the same five steps with a new alias.

> Remember to replace `your_user` and `your_email@example.com` with your actual username and email, and update the repository URLs in Step 4 to match your specific repository locations.