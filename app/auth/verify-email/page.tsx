import Link from 'next/link'

export default function VerifyEmailPage() {
 return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
   <div style={{ maxWidth: 420, width: '100%', margin: '0 20px', background: '#fff', borderRadius: 20, border: '1px solid #E7E5E4', padding: 40, textAlign: 'center' }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ECFDF5', border: '2px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>
     
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', marginBottom: 10 }}>
     Check your email
        </h1>
        <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.7, marginBottom: 24 }}>
     We sent a confirmation link to your email address. Click it to activate your account and access your reports.
        </p>
        <p style={{ fontSize: 12, color: '#A8A29E', marginBottom: 28 }}>
     Didn't get it? Check your spam folder, or wait a minute and try signing in again.
    </p>
        <Link href="/auth/login" style={{ display: 'block', padding: '12px', background: '#0F766E', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
     Back to sign in
        </Link>
      </div>
    </div>
  )
}
