<script lang="ts">
    import {darkMode} from "$lib/state/theme.svelte";
    import Giscus from "@giscus/svelte";
    //ref = https://github.com/firdausng/firdausng-blog-nextjs/blob/master/src/components/comment.tsx
    
    let {term}: {term:string} = $props()

</script>

<Giscus
        id="comments"
        repo="firdausng/blog-comments"
        repoId="R_kgDOKBT8qg="
        category="Announcements"
        categoryId="DIC_kwDOF1L2fM4B-hVS"
        mapping="specific"
        term={term}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={darkMode.value ? "dark" : "light"}
        lang="en"
        loading="lazy"
/>