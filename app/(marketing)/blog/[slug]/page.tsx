'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { POSTS, POST_LIST, type Section } from '@/lib/blog-posts'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [post, setPost] = useState<typeof POSTS[string] | null>(null)

  useEffect(() => {
    // Load post client-side to avoid static generation OOM
    setPost(POSTS[slug] ?? null)
  }, [slug])

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: S.font }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Article not found</h1>
        <Link href="/blog" style={{ marginTop: 20, color: S.brand, fontWeight: 700 }}>← Back to blog</Link>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: S.font, minHeight: '100vh', background: S.n50 }}>
      {/* Nav */}
      <div style={{ background: S.headerBg, padding: '12px 24px', display: 'flex', gap: 8 }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 800 }}>Locatalyze</Link>
        <span style={{ color: '#888' }}>/</span>
        <Link href="/blog" style={{ color: '#ccc' }}>Blog</Link>
        <span style={{ color: '#888' }}>/</span>
        <span style={{ color: '#bbb' }}>{post.category}</span>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img src={post.heroImg} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 24, color: '#fff', fontWeight: 700, fontSize: 22 }}>{post.title}</div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        <p style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 12 }}>{post.intro}</p>
        {post.sections.map((section: Section, idx: number) => {
          switch (section.type) {
            case 'h2': return <h2 key={idx}>{section.text}</h2>
            case 'h3': return <h3 key={idx}>{section.text}</h3>
            case 'p': return <p key={idx}>{section.text}</p>
            case 'img': return <img key={idx} src={section.src} alt={section.caption} style={{ width: '100%', margin: '24px 0' }} />
            default: return null
          }
        })}
        <div style={{ marginTop: 40 }}>
          <Link href="/blog" style={{ color: S.brand, fontWeight: 700 }}>← Back to all articles</Link>
        </div>
      </div>
    </div>
  )
}