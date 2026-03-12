// lib/blog-posts.ts
import path from 'path'
import { readFileSync } from 'fs'

const d = JSON.parse(readFileSync(path.join(process.cwd(), 'public/data/blog.json'), 'utf8'))

export type Section = any
export const POSTS: any[] = d.POSTS
export const POST_LIST: any[] = d.POST_LIST
