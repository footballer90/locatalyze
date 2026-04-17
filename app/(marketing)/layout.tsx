import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    // Override the dark-theme body color (#e8e8f0) set by globals.css.
    // All marketing pages use light backgrounds with dark text by default.
    // Individual sections that need white text (hero gradients etc.) set it explicitly via inline styles.
    <div style={{ color: '#1C1917' }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
