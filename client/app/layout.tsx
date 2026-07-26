import '@/styles/globals.css'

import type { Metadata } from 'next'

import { geistSans } from '@/common/utils/fonts'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_APPNAME : `${process.env.NEXT_PUBLIC_APPNAME} - (${process.env.NEXT_PUBLIC_ENVIRONMENT})`,
  description: 'The intuitive book tracking app.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${geistSans.className} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}
