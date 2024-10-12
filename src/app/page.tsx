'use client'
import { useState, useEffect } from 'react'
import { Button, Navbar } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import { toast, ToastContainer } from 'react-toastify'
import Footer from '@/components/footer'
import { v4 as uuidv4 } from 'uuid'

interface Brand {
	id: string // UUID type
	logo_image: string
	name: string
	description: string
}

export default function Home() {
	const { address: walletAddress } = useAccount()
	const [hasAddress, setHasAddress] = useState(false)
	const [brands, setBrands] = useState<Brand[]>([])
	const [showForm, setShowForm] = useState(false)
	const account = useAccount()
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [tosChecked, setTosChecked] = useState(false)
	const [newsletterChecked, setNewsletterChecked] = useState(false)

	const apiUrl = process.env.NEXT_PUBLIC_URI
	const baseUri = process.env.NEXT_PUBLIC_URI || 'https://app.myriadflow.com'

	useEffect(() => {
		const checkEmailExists = async () => {
			if (account?.address) {
				try {
					const response = await fetch(
						`${baseUri}/profiles/email/${account.address}`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
						}
					)

					if (response.ok) {
						const data = await response.json()
						console.log(data.email)

						// If the email exists, set showForm to false
						if (data.email) {
							setShowForm(false)
						} else {
							setShowForm(true)
						}
					} else {
						// Handle errors or cases where no data is returned
						setShowForm(true)
					}
				} catch (error) {
					console.error('Error fetching profile data:', error)
					setShowForm(true)
				}
			}
		}

		checkEmailExists()
	}, [account.address])

	const handleSubmit = async () => {
		if (displayName && email && tosChecked) {
			try {
				const profileId = uuidv4()
				const response = await fetch(`${baseUri}/profiles`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: profileId,
						name: displayName,
						email: email,
						wallet_address: account.address,
						chaintype_id: '554b4903-9a06-4031-98f4-48276c427f78',
					}),
				})

				if (response.ok) {
					setShowForm(false)
				} else {
					console.error('Failed to submit profile data')
				}
			} catch (error) {
				console.error('Error submitting profile data:', error)
			}
		}
	}
	const getBrands = async () => {
		try {
			const res = await fetch(`${apiUrl}/brands/manager/${walletAddress}`)
			if (!res.ok) {
				throw new Error('Network response was not ok')
			}
			const result: Brand[] = await res.json()
			setBrands(result)
		} catch (error) {
			console.error('Failed to fetch brands:', error)
		}
	}

	useEffect(() => {
		if (walletAddress) {
			localStorage.setItem('walletAddress', walletAddress)
			localStorage.setItem(
				'BaseSepoliaChain',
				'554b4903-9a06-4031-98f4-48276c427f78'
			)
			setHasAddress(true)
			getBrands()
		} else {
			setHasAddress(false)
		}
	}, [walletAddress])

	const ifConnected = async () => {
		if (!walletAddress) {
			toast.warning('Connect your wallet')
		}
	}

	return (
		<>
			<Navbar />
			<div>
				<div className='flex flex-col md:flex-row h-screen bg-white relative'>
					<div className='w-full md:w-1/2 h-full px-8 md:px-16 flex flex-col justify-center items-center'>
						<div className='max-w-md'>
							<h1 className='text-4xl md:text-7xl font-bold mb-4'>
								<span className="bg-gradient-to-l from-[#50B7F9] to-[#D32CE0] text-transparent bg-clip-text">
									MyriadFlow
								</span>
								<br />
								<span className="bg-gradient-to-l from-[#50B7F9] to-[#D32CE0] text-transparent bg-clip-text">
									Studio
								</span>
							</h1>
							<div className='text-3xl md:text-5xl font-thin mt-4 md:mt-10 text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
								Launch phygitals &<br />virtual experiences
							</div>
							<p className="text-xl text-black mt-4 mb-8">
								No coding knowledge needed.
							</p>
							<div className='flex flex-col md:flex-row gap-6 mt-6 md:mt-28'>
								<div className="relative inline-block">
									<w3m-button />
								</div>
								<Link
									href='/create-brand'
									target='_blank'
									className="px-10 py-2 rounded-[30px] font-bold text-black bg-[#30D8FF]"
								>
									Create Brand
								</Link>
							</div>
						</div>
					</div>

					<div className='w-full md:w-1/2 h-full relative flex items-center justify-center'>
						<Image
							src='/images/hero_background.png'
							alt='Hero Background'
							layout='fill'
							objectFit='cover'
						/>
						<div className='absolute bottom-4 text-2xl p-12 left-8 right-8 text-black md:mb-10 text-left'
							style={{
								fontFamily: 'Bai Jamjuree, sans-serif',
							}}>
							Welcome to MyriadFlow Studio, your one-stop shop for creating groundbreaking phygital NFTs. Ready to take off to the next level?
						</div>
					</div>
				</div>
				<div
					className='bg-black py-4 md:py-6 text-center'
				>
					<h2 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#F45EC1] to-[#4EB9F3] text-transparent bg-clip-text'>
						Launch Your NFT Experiences.
					</h2>
				</div>


				<div className='bg-white py-16 px-8 md:px-16'>
					<div className='max-w-7xl mx-auto'>
						<div className='flex flex-col md:flex-row items-center justify-between mb-16'>
							<div className='md:w-1/2 mb-8 md:mb-0 flex items-center'>
								<h2 className='text-2xl md:text-3xl font-medium text-black mr-8' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
									Sell & showcase<br />your products as<br />phygital NFTs
								</h2>
								<div className='relative' style={{ width: '300px', height: '300px' }}>
									<img
										src='/images/discover_cover.png'
										alt='Discover Cover'
										className='absolute w-full h-full object-cover'
										style={{
											borderRadius: '20px 0 0 0',
										}}
									/>
								</div>
							</div>
							<div className='text-4xl font-bold text-black pr-10'>+</div>
							<div className='md:w-1/2 flex items-center'>
								<h2 className='text-2xl md:text-3xl font-medium text-black mr-8' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
									Captivate your<br />customers with<br />virtual experiences
								</h2>
								<div className='relative' style={{ width: '276px', height: '300px' }}>
									<img
										src='/images/webxr_cover.png'
										alt='WebXR Cover'
										className='absolute w-full h-full object-cover'
										style={{
											borderRadius: '20px 0 0 0',
										}}
									/>
								</div>
							</div>
						</div>

						<div className='text-center'>
							<p className='text-3xl mb-2 text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
								<span className='font-bold'>Already launched your brand?</span> Go to <a href="#" className='underline'>my Brand</a> page.
							</p>
							<br></br>
							<p className='text-4xl font-bold mb-2 text-black'>OR</p>
							<br></br>
							<p className='text-3xl text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
								<span className='font-bold'>Just getting started?</span> Choose the correct alternative.
							</p>
						</div>
					</div>
				</div>

				<div className='bg-white py-16 px-8 md:px-16'>
					<div className='max-w-6xl mx-auto'>
						<div className='flex flex-col md:flex-row justify-between'>
							{/* Left side - Premium Brand */}
							<div className='md:w-[48%] relative mb-8 md:mb-0'>
								<div className='flex justify-center items-center'>
									<div className='bg-[#30D8FF] text-black text-2xl border border-black  px-4 py-2 rounded-full inline-block mb-4'>
										Premium Brand
									</div>
								</div>
								<br></br>
								<ul className='list-disc list-inside mb-4 text-black'>
									<li>99 USD / month</li>
									<li>Access to all our premium features</li>
									<li>AR and 3D models</li>
									<li>Verified NFT Brand communities</li>
									<li>Showcase on Discover page</li>
								</ul>
								<br></br>
								<div className='bg-[#30D8FF] text-black text-xl  rounded-xl border border-black p-8 pt-12 relative'>
									<h3 className='text-2xl font-bold mb-4'>Premium Brand</h3>
									<p className='mb-4 italic'>For established brands looking for the best tools and experience.</p>

									<p className='mb-4'>Select this option if you meet the criteria to be featured as a premium brand or creator on MyriadFlow&apos;s main Discover marketplace.</p>
									<p className='mb-4'>Premium brands are established brands with a significant following and client base, using certified factories and quality standards.</p>
									<p className='mb-4'>Premium brands enjoy enhanced visibility and access to exclusive tools designed for established creators and brands.</p>
									<div className="flex justify-center items-center">
										<button className='bg-white text-black text-2xl  border border-black px-6 py-2 rounded-full'>Join Now</button>
									</div>
									<img
										src='/images/collection.png'
										alt='Collection'
										className='absolute -top-20 -right-12 w-40 h-40 object-cover rounded-[50px]'
									/>
									<img
										src='/images/golden_tablet.png'
										alt='Golden Tablet'
										className='absolute -bottom-20 -left-10 w-40 h-40 object-cover rounded-[20px]' />
								</div>
							</div>


							<div className='md:w-[48%] relative'>
								<div className='flex justify-center items-center'>
									<div className='bg-[#30D8FF4D] text-black text-2xl border border-black  px-4 py-2 rounded-full inline-block mb-4'>
										Elevate Program
									</div>
								</div>
								<br></br>
								<ul className='list-disc list-inside mb-4 text-black '>
									<li>No upfront costs</li>
									<li>Sponsored base themes</li>
									<li>Sponsored transactions for launching collections</li>
									<li>Showcase on Elevate page</li>
								</ul>
								<br></br>
								<br></br>

								<div className='bg-[#E0F7FA] text-black rounded-xl text-xl border border-black p-8 pt-12 relative'>
									<h3 className='text-2xl font-bold mb-4'>Elevate Program</h3>
									<p className='mb-4 italic'>For emerging brands & creators Starting in Africa.</p>

									<p className='mb-4'>Choose this option if you are an emerging creator or grassroots brand seeking to leverage our platform&apos;s unique features.</p>
									<p className='mb-4'>You will benefit from sponsored Basenames and incur no upfront costs to launch your phygital NFTs and virtual brand ambassadors.</p>
									<p className='mb-4'>As your brand develops and gains traction, you&apos;ll have the opportunity to transition into the premium category and be showcased on our main page.</p>
									<div className="flex justify-center items-center">
										<button className='bg-white  text-black text-2xl border border-black px-6 py-2 rounded-full mt-8'>Join Now</button>
									</div>
									<img
										src='/images/dress_web.png'
										alt='Dress Web'
										className='absolute -top-20 -right-10 w-40 h-40 object-cover rounded-[50px]'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='bg-white py-16 px-8 md:px-16 text-black text-left pt-24'>
					<div className='max-w-6xl mx-auto'>
						<h2 className='text-5xl font-bold mb-8 text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
							Want to find out more?
						</h2>
						<p className='text-xl mb-4 text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
							<a href="#" className='underline'>Click here</a> for more details about the requirements.
						</p>
						<p className='text-xl text-black' style={{ fontFamily: 'Bai Jamjuree, sans-serif' }}>
							Or <a href="#" className='underline'>contact us</a>. We would love to hear from you!
						</p>
					</div>
				</div>

			</div >
			<Footer />
		</>
	)
}
