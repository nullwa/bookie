import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bookie',
  description: 'Bookie is a simple and intuitive book tracking app built with Next.js, Tailwind CSS, and TypeScript. It allows users to easily manage their reading list, track their progress, and discover new books to read.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${geistSans.className} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}
