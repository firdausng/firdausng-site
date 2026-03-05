<script lang="ts">
    import {title} from "$lib/config";
</script>

<svelte:head>
    <title>{title} - About</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden shadow-lg shadow-primary-500/5 max-w-4xl mx-auto">

        <!-- Terminal title bar -->
        <div class="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
            <span class="font-mono text-xs sm:text-sm text-primary-600 dark:text-primary-300 truncate">cat ~/about.json</span>
            <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                <span class="text-xs">&#x2500;</span>
                <span class="text-xs">&#x25A1;</span>
                <span class="text-sm">&times;</span>
            </span>
        </div>

        <div class="p-6 md:p-10 space-y-8">

            <!-- Profile as JSON -->
            <div class="flex flex-col md:flex-row items-start gap-6">
                <div class="shrink-0">
                    <div class="rounded-lg overflow-hidden border-2 border-primary-200 dark:border-primary-700 shadow-xl shadow-primary-500/10">
                        <img class="object-cover w-40 h-40" src="/images/profile-image.jpeg" alt="Firdaus" />
                    </div>
                </div>
                <div class="font-mono text-xs sm:text-sm space-y-1 break-words">
                    <div class="text-gray-400 dark:text-gray-500">&#123;</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Name"</span>: <span class="text-green-600 dark:text-green-400">"Firdaus Kamaruddin"</span>,</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Location"</span>: <span class="text-green-600 dark:text-green-400">"Kuala Lumpur, Malaysia"</span>,</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Role"</span>: <span class="text-green-600 dark:text-green-400">"Full-stack Developer"</span>,</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Education"</span>: <span class="text-green-600 dark:text-green-400">"Electronic Engineering, MMU 2012"</span>,</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Stack"</span>: [<span class="text-green-600 dark:text-green-400">"C#"</span>, <span class="text-green-600 dark:text-green-400">"TypeScript"</span>, <span class="text-green-600 dark:text-green-400">"ASP.NET MVC"</span>],</div>
                    <div class="pl-2 sm:pl-4"><span class="text-primary-500">"Status"</span>: <span class="text-green-600 dark:text-green-400">"Online"</span></div>
                    <div class="text-gray-400 dark:text-gray-500">&#125;</div>
                </div>
            </div>

            <!-- docker logs — about blog -->
            <div class="space-y-3">
                <div class="font-mono text-sm text-primary-500 dark:text-primary-400">$ cat blog.md</div>
                <div class="rounded-lg bg-gray-50 dark:bg-primary-900/30 p-4 border border-primary-100 dark:border-primary-800">
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        Welcome to my blog, a blog created to share my experiences and learning as I journey into software development. It will cover tutorials and explanations of current developments, as well as detailing any problems encountered along the way! My goal is to share any useful information I find, in the hope that it will be helpful for someone else. I'm always learning, and there's always more to know, so if you think there's something I have missed, have got wrong, or would benefit from, please do send a comment, or drop me a message - it'll be greatly received!
                    </p>
                </div>
            </div>

            <!-- docker logs — about me -->
            <div class="space-y-3">
                <div class="font-mono text-sm text-primary-500 dark:text-primary-400">$ cat about.md</div>
                <div class="rounded-lg bg-gray-50 dark:bg-primary-900/30 p-4 border border-primary-100 dark:border-primary-800">
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        My name is Firdaus Kamaruddin, mostly people called me as 'Firdaus'. I am a full-time developer, working predominantly in full stack ASP.NET development in Kuala Lumpur, Malaysia. I graduated with a degree in Electronic Engineering from Malaysia Multimedia University in 2012. I have experience primarily with C# and JavaScript/TypeScript, working mostly in MVC.
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>
