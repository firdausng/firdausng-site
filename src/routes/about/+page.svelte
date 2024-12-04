<script lang="ts">
    import {title} from "$lib/config";
</script>

<svelte:head>
    <title>{title} - About</title>
</svelte:head>

<div class="flex flex-col gap-2 items-center relative text-primary-200 p-2 container mx-auto">
    <div class="absolute top-[5%] left-[45%]">
        <img class="object-cover h-48 w-48 rounded-full border-4 border-primary-700" alt="profile" src="/images/profile-image.jpeg" />
    </div>
    <div class="bg-primary-800 w-full p-8 mt-32 rounded">
        <div class="pt-24 px-24">
            <h2 class="text-center text-3xl">About this blog</h2>
            <p class="text-center">
                Welcome to my blog, a blog created to share my experiences and learning as I journey into software development. It will cover tutorials and explanations of current developments, as well as detailing any problems encountered along the way! My goal is to share any useful information I find, in the hope that it will be helpful for someone else. I'm always learning, and there's always more to know, so if you think there's something I have missed, have got wrong, or would benefit from, please do send a comment, or drop me a message - it'll be greatly received!
            </p>
        </div>

        <div class="pt-4 px-24">
            <h2 class="text-center text-3xl">About me</h2>
            <p class="text-center">
                My name is Firdaus Kamaruddin, mostly people called me as ‘Firdaus’. I am a full-time developer, working predominantly in full stack ASP.NET development in Kuala Lumpur, Malaysia. I graduated with an degree in Electronic Engineering from Malaysia Multimedia University in 2012. I have experience primarily with C# and javascript/typescript, working mostly  in MVC.</p>
        </div>

    </div>

</div>