<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import SocialLink from "$lib/components/social-link.svelte";
    import {github, email} from "$lib/config";
    let { data } = $props();

    const projects = [
        {
            name: 'DuitGee',
            description: 'A group expense-tracking platform enabling shared cost management among roommates, travelers, and families. Establish shared accounts and reconcile debts seamlessly.',
            tags: ['cloudflare', 'svelte', 'hono', 'drizzle'],
            url: 'https://duitgee.com',
            logo: 'https://duitgee.com/favicon.svg',
            status: 'Live',
        },
        {
            name: 'Gee Ledger',
            description: 'An accounting platform for freelancers and entrepreneurs managing multiple ventures. Handle invoicing, income tracking, and team administration across different businesses.',
            tags: ['cloudflare', 'svelte', 'hono', 'drizzle'],
            url: 'https://geeledger.com',
            logo: 'https://geeledger.com/favicon.svg',
            status: 'Live',
        },
        {
            name: 'BikeSynergy',
            description: 'A specialized mountain bike retailer offering equipment sales, on-campus maintenance services, and professional coaching with over two decades of industry experience.',
            tags: ['cloudflare', 'svelte', 'hono'],
            url: 'https://bikesynergy.com',
            logo: 'https://bikesynergy.com/favicon.ico?v=2',
            status: 'Live',
        },
    ];

    const skills = [
        { repo: 'TypeScript', tag: 'latest', size: 'expert' },
        { repo: 'C#', tag: 'latest', size: 'expert' },
        { repo: 'Svelte', tag: '5.x', size: 'advanced' },
        { repo: 'React', tag: '18.x', size: 'advanced' },
        { repo: 'Angular', tag: '17.x', size: 'advanced' },
        { repo: 'Hono', tag: 'latest', size: 'advanced' },
        { repo: 'ASP.NET', tag: 'core', size: 'expert' },
        { repo: 'Cloudflare Workers', tag: 'v2', size: 'advanced' },
        { repo: 'Drizzle ORM', tag: 'latest', size: 'intermediate' },
        { repo: 'PostgreSQL', tag: '16', size: 'intermediate' },
        { repo: 'D1', tag: 'latest', size: 'intermediate' },
        { repo: 'Docker', tag: 'latest', size: 'intermediate' },
    ];
</script>

<div class="flex flex-col gap-16 pb-16">

    <!-- Hero Section — docker inspect -->
    <section class="container mx-auto px-4 pt-12 lg:pt-20">
        <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden shadow-lg shadow-primary-500/5">

            <!-- Terminal title bar -->
            <div class="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
                <span class="font-mono text-sm text-primary-600 dark:text-primary-300">cat ~/profile.json</span>
                <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                    <span class="text-xs">&#x2500;</span>
                    <span class="text-xs">&#x25A1;</span>
                    <span class="text-sm">&times;</span>
                </span>
            </div>

            <!-- Container inspect body -->
            <div class="relative p-6 md:p-10 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
                <!-- Mobile watermark background -->
                <div class="absolute inset-0 lg:hidden pointer-events-none">
                    <img class="object-cover w-full h-full opacity-10 dark:opacity-[0.07]" src="/images/profile-image.jpeg" alt="" />
                </div>

                <div class="relative lg:col-span-7 space-y-5">
                    <div class="font-mono text-sm text-gray-400 dark:text-gray-500">&#47;&#47; metadata</div>
                    <div class="font-mono space-y-1.5 text-sm">
                        <div><span class="text-primary-500">"Name"</span>:        <span class="text-green-600 dark:text-green-400">"Firdaus"</span>,</div>
                        <div><span class="text-primary-500">"Status"</span>:      <span class="flex items-center gap-1.5 inline-flex"><span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span><span class="text-green-600 dark:text-green-400">"Online"</span></span>,</div>
                        <div><span class="text-primary-500">"Role"</span>:        <span class="text-green-600 dark:text-green-400">"Software Developer"</span>,</div>
                    </div>

                    <div class="font-mono text-sm text-gray-400 dark:text-gray-500 pt-2">&#47;&#47; skills</div>
                    <div class="font-mono space-y-1.5 text-sm">
                        <div><span class="text-primary-500">"Focus"</span>: [<span class="text-green-600 dark:text-green-400">"architectures"</span>, <span class="text-green-600 dark:text-green-400">"security"</span>, <span class="text-green-600 dark:text-green-400">"web APIs"</span>],</div>
                        <div><span class="text-primary-500">"Frontend"</span>: [<span class="text-green-600 dark:text-green-400">"React"</span>, <span class="text-green-600 dark:text-green-400">"Angular"</span>, <span class="text-green-600 dark:text-green-400">"Svelte"</span>],</div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 pt-4">
                        <a href={github} target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-2 font-mono text-sm px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>
                            github
                        </a>
                        <a href="mailto:{email}"
                           class="inline-flex items-center gap-2 font-mono text-sm px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            contact
                        </a>
                    </div>
                </div>

                <div class="hidden lg:flex lg:col-span-5 justify-center">
                    <div class="relative">
                        <div class="rounded-lg overflow-hidden border-2 border-primary-200 dark:border-primary-700 shadow-xl shadow-primary-500/10">
                            <img class="object-cover w-80 h-80" src="/images/profile-image.jpeg" alt="Firdaus" />
                        </div>
                        <div class="absolute -bottom-3 -right-3 rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950 px-3 py-1.5 font-mono text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> online
                        </div>
                    </div>
                </div>
            </div>

            <!-- docker images table -->
            <div class="border-t border-primary-200 dark:border-primary-700">
                <div class="px-6 md:px-10 py-3 font-mono text-xs text-primary-500 dark:text-primary-400">$ ls tools/</div>
                <div class="overflow-x-auto">
                    <div class="font-mono text-xs px-6 md:px-10 pb-2 text-gray-400 dark:text-gray-500 flex gap-4">
                        <span class="w-32 sm:w-44">NAME</span>
                        <span class="w-16 sm:w-20">VERSION</span>
                        <span class="flex-1">LEVEL</span>
                    </div>
                    <div class="px-6 md:px-10 pb-4 space-y-0.5">
                        {#each skills as skill}
                            <div class="font-mono text-xs flex gap-4 py-0.5 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-1 rounded">
                                <span class="w-32 sm:w-44 text-primary-700 dark:text-primary-300 truncate">{skill.repo}</span>
                                <span class="w-16 sm:w-20 text-green-600 dark:text-green-400">{skill.tag}</span>
                                <span class="flex-1 text-gray-400 dark:text-gray-500">{skill.size}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FiveBitRate — K8s Deployment -->
    <section class="container mx-auto px-4">
        <a href="https://fivebitrate.com" target="_blank" rel="noopener noreferrer"
           class="block group rounded-lg border-2 border-primary-400 dark:border-primary-600 bg-gradient-to-r from-primary-50 via-white to-primary-50 dark:from-primary-950 dark:via-primary-900/80 dark:to-primary-950 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20">
            <div class="flex items-center gap-2 px-4 py-2 bg-primary-100/80 dark:bg-primary-900/80 border-b border-primary-300 dark:border-primary-700">
                <span class="font-mono text-sm text-primary-600 dark:text-primary-300">~/workspace/fivebitrate</span>
                <span class="font-mono text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">3 projects</span>
                <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                    <span class="text-xs">&#x2500;</span>
                    <span class="text-xs">&#x25A1;</span>
                    <span class="text-sm">&times;</span>
                </span>
            </div>
            <div class="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div class="flex-1 space-y-3">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h2 class="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800 dark:text-primary-100">FiveBitRate</h2>
                        <span class="font-mono text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">production</span>
                    </div>
                    <p class="text-lg text-gray-600 dark:text-gray-300">Building software that simplifies your businesses.</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Finance tools, expense tracking & accounting platforms for individuals and small businesses.</p>
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 pt-2">
                        {#each projects as project}
                            <div class="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-900/40">
                                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                                <img src={project.logo} alt={project.name} class="w-5 h-5 object-contain" />
                                <span class="font-mono text-xs text-primary-700 dark:text-primary-300">{project.name}</span>
                                <span class="font-mono text-[10px] text-gray-400 hidden sm:inline">1/1</span>
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="shrink-0 font-mono text-primary-500 group-hover:text-primary-400 transition-colors text-lg">
                    fivebitrate.com &rarr;
                </div>
            </div>
        </a>
    </section>

    <!-- Posts + Projects side by side on desktop -->
    <section class="container mx-auto px-4">
        <div class="grid lg:grid-cols-12 gap-8">
            <!-- Latest Posts — main content -->
            <div class="lg:col-span-8 order-2 lg:order-1">
                <div class="flex items-center gap-3 mb-2">
                    <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
                    <h2 class="font-mono text-lg md:text-3xl font-bold text-primary-800 dark:text-primary-200 truncate">ls posts/ --latest</h2>
                    <div class="hidden sm:block flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
                    <a href="/posts" class="font-mono text-sm text-primary-500 hover:text-primary-400 transition-colors shrink-0">
                        view all &rarr;
                    </a>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    {#each data.first3Posts as post}
                        <BlogCard {post} />
                    {/each}
                </div>
            </div>

            <!-- Projects — sidebar as single terminal -->
            <div id="projects" class="lg:col-span-4 order-1 lg:order-2">
                <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden shadow-lg shadow-primary-500/5 lg:sticky lg:top-8">
                    <!-- Terminal title bar -->
                    <div class="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
                        <span class="font-mono text-sm text-primary-600 dark:text-primary-300">ls projects/</span>
                        <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                            <span class="text-xs">&#x2500;</span>
                            <span class="text-xs">&#x25A1;</span>
                            <span class="text-sm">&times;</span>
                        </span>
                    </div>

                    <!-- Project list -->
                    <div class="divide-y divide-primary-100 dark:divide-primary-800">
                        {#each projects as project}
                            <a href={project.url} target="_blank" rel="noopener noreferrer"
                               class="block px-4 py-4 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors group/item">
                                <div class="flex items-center gap-3 mb-2">
                                    <img src={project.logo} alt="{project.name} logo" class="w-6 h-6 object-contain rounded" />
                                    <span class="font-mono text-sm font-bold text-primary-800 dark:text-primary-200">{project.name}</span>
                                    <span class="ml-auto flex items-center gap-1.5 font-mono text-[10px]">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        <span class="text-green-600 dark:text-green-400">{project.status}</span>
                                    </span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-2">{project.description}</p>
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-wrap gap-1">
                                        {#each project.tags as tag}
                                            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{tag}</span>
                                        {/each}
                                    </div>
                                    <span class="font-mono text-xs text-primary-500 group-hover/item:text-primary-400 transition-colors">&rarr;</span>
                                </div>
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>
