'use client'
import { Button, Navbar } from '@/components'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export default function Congratulations() {
	const [showForm, setShowForm] = useState(false)
	const [productURL, setProductURL] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async () => {
		if (!productURL) {
			setError('Product URL is required.')
			toast.warning('Product URL is required.')
			return
		}


		// try {
		// 	const response = await fetch(url, {
		// 		method: 'POST',
		// 		headers: headers,
		// 		body: JSON.stringify(),
		// 	})

		// 	if (!response.ok) {
		// 		throw new Error('Network response was not ok')
		// 	}

		// 	const data = await response.json()


		// } catch (error) {
		// 	console.error('Error:', error)
		// }
	}

	return (
		<Suspense>
			<Navbar />
			<ToastContainer />
			<main className='h-screen py-12 px-16 flex flex-col gap-8 text-black'>
				<h1 className='text-3xl font-bold'>Congratulations</h1>
				<p>Your Collection has been launched successfully.</p>
				<div className='py-6 '>
					<p className='text-2xl'>Your brand doesn’t have any phygitals. </p>
				</div>
				<Link href='/create-phygital'>
					<Button className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl'>
						Create phygital
					</Button>
				</Link>
				<Button
					className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl'
					onClick={() => setShowForm(true)}
				>
					I’m already selling the product on Shopify
				</Button>
				{showForm && (
					<div className='mt-6'>
						<div className='flex flex-col gap-4'>
							<label>
								Product URL*
								<input
									type='text'
									className='border rounded px-2 py-1'
									value={productURL}
									onChange={(e) => setProductURL(e.target.value)}
									required
								/>
							</label>
							<Button
								className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl mt-4'
								onClick={handleSubmit}
							>
								Save
							</Button>
						</div>
					</div>
				)}
			</main>
		</Suspense>
	)
}
