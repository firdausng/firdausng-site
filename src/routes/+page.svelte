<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    let { data } = $props();
</script>
<div class="flex flex-col">
    <div class="flex-1 group grid px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 bg-gradient-to-r from-primary-100 border-l-4 border-l-primary-200 dark:border-l-primary-800  dark:from-primary-900 ">
        <div class="text-center mr-auto place-self-center lg:col-span-7 flex flex-col gap-2">
            <h1 class="text-6xl ">Hi, I'm <span class="transition ease-in-out underline group-hover:decoration-primary-500 duration-1000 ">Firdaus</span></h1>
            <p>I'm a software developer who writes about life, code, design, and more.</p>
            <p class="">I am mainly focused on solution/application architectures & security for web-based (API) applications</p>
            <p >I also been doing  quite  a few of project for the frontend using tech like React, Angular and Svelte</p>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex relative">
            <img class="object-cover z-10" src="/images/profile-image.jpeg" alt="firdaus-site profile" />
            <img class="object-cover absolute left-2 top-2 opacity-45 group-hover:opacity-15" src="/images/profile-image.jpeg" alt="firdaus-site profile" />
        </div>
    </div>

    <section class="mb-16 pt-4 flex flex-col container mx-auto group">
        <div class="py-4">
            <h2 class="py-2 text-4xl drop-shadow-lg transition ease-in-out delay-150 underline group-hover:decoration-primary-500 duration-1000 ">Latest</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 ">
            {#each data.first3Posts as post}
                <div class="border-s-4 shadow-sm border-l-primary-200 dark:border-l-primary-800">
                    <BlogCard {post} />
                </div>
                
            {/each}
        </div>
        <div class="py-4">
            <a href="/blog" class="text-primary-500 hover:underline text-xl italic font-semibold">View all posts...</a>
        </div>
    </section>
    
</div>