import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--fonnt-geist-mono', subsets: ['latin'] })
const bricolageGrotesque = Bricolage_Grotesque({ variable: '--font-bricolage-grotesque', subsets: ['latin'] })

export { geistSans, geistMono, bricolageGrotesque }
