﻿import { dev } from "$app/environment"
export const title = "Firdausng"
export const description = "A software tinkerer"
export const github = "https://github.com/firdausng"
export const twitter = "https://x.com/firdausng_byte"
export const linkedin = "https://www.linkedin.com/in/firdaus-kamaruddin/"
export const email = "firdauskamaruddin@hotmail.com"
export const url = dev ? "http://localhost:5173" : "https://firdausng.com"

export const navigations = [
    {name: 'Posts', path:'/posts', featured: true},
    {name: 'Series', path:'/series', featured: true},
    {name: 'About', path:'/about', featured: true},
    {name: 'Tags', path:'/tags', featured: false},
]