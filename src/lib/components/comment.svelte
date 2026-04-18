<script lang="ts">
    import {darkMode} from "$lib/state/theme.svelte";
    import Giscus from "@giscus/svelte";
</script>

<Giscus
        id="comments"
        repo="firdausng/blog-comments"
        repoId="R_kgDOKBT8qg"
        category="Post Comments"
        categoryId="DIC_kwDOKBT8qs4C7Kcg"
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={darkMode.value ? "dark" : "light"}
        lang="en"
        loading="lazy"
/>