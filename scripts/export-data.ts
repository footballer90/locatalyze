import { CITIES, BUSINESS_TYPES, CITY_SLUGS, TYPE_SLUGS } from '../lib/location-data'
import { SUBURBS, SUBURB_SLUGS } from '../lib/suburb-data'
import { POSTS, POST_LIST } from '../lib/blog-posts'
import fs from 'fs'

fs.mkdirSync('public/data', { recursive: true })
fs.writeFileSync('public/data/location.json', JSON.stringify({ CITIES, BUSINESS_TYPES, CITY_SLUGS, TYPE_SLUGS }))
fs.writeFileSync('public/data/suburbs.json', JSON.stringify({ SUBURBS, SUBURB_SLUGS }))
fs.writeFileSync('public/data/blog.json', JSON.stringify({ POSTS, POST_LIST }))
console.log('✅ JSON files written to public/data/')
