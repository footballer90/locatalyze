'use client'
import { useState } from 'react'

const S = {
 brand: '#0F766E', white: '#FFFFFF',
 n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
}

interface ShareButtonProps {
 reportId: string
  initialIsPublic: boolean
  initialToken: string | null
}

export default function ShareButton({ reportId, initialIsPublic, initialToken }: ShareButtonProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [token, setToken] = useState(initialToken)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rotating, setRotating] = useState(false)
  const [expiresInDays, setExpiresInDays] = useState<number>(0)

  const shareUrl = token
    ? `${window.location.origin}/r/${token}`
    : null

  async function toggleShare() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isPublic ? 'disable' : 'enable', expiresInDays }),
   })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update sharing')
   setIsPublic(data.is_public)
      if (data.public_token) setToken(data.public_token)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function rotateLink() {
    if (!window.confirm('This will invalidate the current share link immediately. Anyone with the old link will lose access. Generate a new link?')) return
    setRotating(true)
    setError(null)
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rotate', expiresInDays }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to rotate link')
      setToken(data.public_token)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRotating(false)
    }
  }

  async function copyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
   el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
   document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
   {/* Share button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
     padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
     background: isPublic ? S.emeraldBg : S.white,
          color: isPublic ? S.emerald : S.n700,
          border: `1.5px solid ${isPublic ? S.emeraldBorder : S.n200}`,
          transition: 'all 0.15s',
     fontFamily: 'inherit',
    }}
      >
        <span style={{ display: 'inline-flex' }}>{isPublic ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}</span>
    {isPublic ? 'Shared' : 'Share'}
   </button>

      {/* Panel */}
      {showPanel && (
        <>
          {/* Backdrop */}
          <div onClick={() => setShowPanel(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />

     <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 50,
      background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '20px', width: 300,
      fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
     }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1C1917', marginBottom: 6, letterSpacing: '-0.01em' }}>
       Share this report
            </h3>
            <p style={{ fontSize: 12, color: S.n500, marginBottom: 16, lineHeight: 1.5 }}>
              {isPublic
                ? 'Anyone with this link can view the report — no login required.'
        : 'Enable sharing to generate a public link for this report.'}
      </p>

            {error && (
              <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>{error}</p>
      )}

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPublic ? 14 : 0 }}>
       <span style={{ fontSize: 13, fontWeight: 600, color: '#44403C' }}>
        {isPublic ? 'Public link active' : 'Private'}
       </span>
              <button
                onClick={toggleShare}
                disabled={loading}
                style={{
                  width: 44, height: 24, borderRadius: 100, border: 'none', cursor: loading ? 'wait' : 'pointer',
         background: isPublic ? S.emerald : S.n200,
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
              >
                <span style={{
                  position: 'absolute', top: 2, left: isPublic ? 22 : 2,
         width: 20, height: 20, borderRadius: '50%', background: S.white,
         transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
              </button>
            </div>

            <div style={{ marginBottom: isPublic ? 14 : 12 }}>
              <label htmlFor={`expiry-${reportId}`} style={{ display: 'block', fontSize: 11, color: S.n500, marginBottom: 6 }}>
                Link expiry
              </label>
              <select
                id={`expiry-${reportId}`}
                value={String(expiresInDays)}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: `1px solid ${S.n200}`,
                  background: S.white,
                  color: S.n700,
                  fontSize: 12,
                  padding: '8px 10px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="0">Never expires</option>
                <option value="1">24 hours</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            {/* Link field */}
            {isPublic && shareUrl && (
              <div>
                <div style={{ display: 'flex', gap: 6 }}>
         <input
                    readOnly
                    value={shareUrl}
                    style={{
                      flex: 1, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 8,
                      padding: '8px 10px', fontSize: 11, color: S.n700, outline: 'none', fontFamily: 'monospace',
          }}
                  />
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
           background: copied ? S.emerald : S.brand,
                      color: S.white, fontSize: 12, fontWeight: 700, flexShrink: 0,
                      fontFamily: 'inherit', transition: 'background 0.2s',
          }}
                  >
                    {copied ? 'Copied' : 'Copy'}
         </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: S.n400 }}>
                    Disable sharing to revoke all access.
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={rotateLink}
                      disabled={rotating}
                      title="Generate a new link — invalidates the current URL immediately"
                      style={{
                        fontSize: 11, color: S.n500, background: 'none', border: `1px solid ${S.n200}`,
                        borderRadius: 6, padding: '3px 8px', cursor: rotating ? 'wait' : 'pointer',
                        fontFamily: 'inherit', flexShrink: 0,
                      }}
                    >
                      {rotating ? 'Rotating…' : 'Rotate link'}
                    </button>
                    <button
                      onClick={toggleShare}
                      disabled={loading}
                      title="Revoke this link immediately"
                      style={{
                        fontSize: 11, color: '#b91c1c', background: '#fff', border: '1px solid #fecaca',
                        borderRadius: 6, padding: '3px 8px', cursor: loading ? 'wait' : 'pointer',
                        fontFamily: 'inherit', flexShrink: 0,
                      }}
                    >
                      Revoke now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}