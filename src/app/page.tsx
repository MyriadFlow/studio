import { Button, Navbar } from '@/components'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<>
			<Navbar />
			<main className='h-screen flex-col flex text-black text-center gap-12 justify-center relative'>
				<Image
					src='/images/blob-3.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute top-0 right-0'
				/>
				<div>
					<h1 className='text-6xl font-bold mb-6 uppercase'>
						Myriadflow studio
					</h1>
					<h2 className='text-2xl '>
						<span className='inline-block'>
							Welcome to MyriadFlow Studio, your one-stop shop
						</span>
						<span>for creating groundbreaking phygital NFTs!</span>
					</h2>
				</div>
				<div className=' flex flex-col gap-14 justify-center items-center'>
					<p>
						You have not created any brands yet. Ready to start your journey?
					</p>
					<Link href='/create-brand'>
						<Button className='bg-[#30D8FF] rounded-full text-black'>
							Create Brand
						</Button>
					</Link>
				</div>
				<Image
					src='/images/blob-2.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute bottom-18 left-0'
				/>
				<Image
					src='/images/blob-1.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute bottom-0 left-0'
				/>
			</main>
		</>
	)
}
