// lib/blog-posts.ts — thin wrapper, data served from public/data/blog.json
import _data from '../public/data/blog.json'

const d = _data as any
export type Section = any
export const POSTS: any[] = d.POSTS
export const POST_LIST: any[] = d.POST_LIST
