import { dev } from "$app/environment"
export const title = "Firdausng"
export const description = "A software tinkerer"
export const github = "https://github.com/firdausng"
export const twitter = "https://x.com/firdausng_byte"
export const linkedin = "https://www.linkedin.com/in/firdaus-kamaruddin/"
export const email = "firdauskamaruddin@hotmail.com"
export const url = dev ? "http://localhost:5173" : "https://firdausng.com"

export const navigations = [
    {name: 'Blog', path:'/blog'},
    {name: 'About', path:'/about'}
]