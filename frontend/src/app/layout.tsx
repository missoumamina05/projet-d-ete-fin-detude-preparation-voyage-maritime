import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cap Marine — Portail de navigation du Saint-Laurent',
  description: 'Portail maritime pour les marins du fleuve.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}