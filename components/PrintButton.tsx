'use client'

export default function PrintButton({ reportTitle }: { reportTitle?: string }) {
  const handlePrint = () => {
    document.title = reportTitle || 'Locatalyze Report'
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all"
    >
      📄 Save PDF
    </button>
  )
}