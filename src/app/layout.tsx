import type { Metadata } from 'next'
import { Bai_Jamjuree as FontSans } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { cn } from '@/lib/utils'
import { Providers } from '@/lib/providers'

const fontSans = FontSans({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-sans',
})
export const metadata: Metadata = {
	title: 'Myriadflow Studio',
	description: 'Create your brand phygital and NFTs',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<Providers>
				<body
					className={cn(
						'min-h-screen bg-[#FAF9F6] font-sans antialiased',
						fontSans.variable
					)}
				>
					{children}
				</body>
			</Providers>
		</html>
	)
}
