'use client'
import { Button, Input, Label, Navbar, Textarea } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar } from '@readyplayerme/visage'
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'

export default function Review() {
	const [activeButton, setActiveButton] = useState('phygital')

	const handleButtonClick = (buttonLabel: string) => {
		setActiveButton(buttonLabel)
	}


	const getData = () => {
		if (typeof window !== 'undefined' && localStorage) {
			return localStorage.getItem('phygitalData')
		}
	}

	const getDetailsData = () => {
		if (typeof window !== 'undefined' && localStorage) {
			return localStorage.getItem('phygitalDetailsData')
		}
	}

	const getWebxrData = () => {
		if (typeof window !== 'undefined' && localStorage) {
			return localStorage.getItem('webxrData')
		}
	}

	const getAvatarData = () => {
		if (typeof window !== 'undefined' && localStorage) {
			return localStorage.getItem('avatar')
		}
	}

	const storedData = getData() ?? '{}'
	const parsedData = JSON.parse(storedData)
	console.log(parsedData);


	const storedAvaterData = getAvatarData() ?? '{}'
	const parsedAvatarData = JSON.parse(storedAvaterData)
	console.log(parsedAvatarData);

	const storedDetailsData = getDetailsData() ?? '{}'
	const parsedDetailsData = JSON.parse(storedDetailsData)
	console.log(parsedDetailsData);

	const storedWebxrData = getWebxrData() ?? '{}'
	const parsedWebxrData = JSON.parse(storedWebxrData)
	console.log(parsedWebxrData);

    const apiUrl = process.env.NEXT_PUBLIC_URI;

	const getPhygital = async () => {
		const res = await fetch(`${apiUrl}/phygitals/all`)

		const result = await res.json()
		console.log(result)
	}

	useEffect(() => {
		getPhygital()
	}, [])

	return (
		<>
			<Navbar />
			<main className='min-h-screen p-20 flex flex-col gap-12 text-black'>
				<div className='flex justify-between items-center'>
					<Button
						className={`${activeButton === 'phygital'
							? 'bg-[#4187D6] text-white'
							: 'bg-transparent'
							}  border border-black text-black`}
						onClick={() => handleButtonClick('phygital')}
					>
						Phygital
					</Button>
					<Button
						className={`${activeButton === 'phygital-details'
							? 'bg-[#4187D6] text-white'
							: 'bg-transparent'
							}  border border-black text-black`}
						onClick={() => handleButtonClick('phygital-details')}
					>
						Additional Details
					</Button>
					<Button
						className={`${activeButton === 'webxr'
							? 'bg-[#4187D6] text-white'
							: 'bg-transparent'
							}  border border-black text-black`}
						onClick={() => handleButtonClick('webxr')}
					>
						WebXR Experience
					</Button>
				</div>

				{activeButton === 'phygital' && (
					<div className='border border-black bg-white p-8'>
						<div>
							<h1 className='text-2xl '>Phygital</h1>
							{/* <p className='text-xl mt-8'>Chain: Base network</p> */}
						</div>
						<div className='flex gap-8'>
							<div>
								<div>
									<Label className='text-xl mb-6'>Phygital name </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={parsedData.name}
										readOnly
									/>
								</div>
								<div>
									<Label className='text-xl mb-6'>Description</Label>
									<Textarea
										className='border-0 bg-[#0000001A] rounded'
										value={parsedData.description}
										readOnly
									/>
								</div>
							</div>
							<div className='border border-black p-8'>
								<img
									src={`https://nftstorage.link/${parsedData.image.replace('ipfs://', 'ipfs/')}`}
									alt='preview'
									height={200}
									width={200}
								/>
							</div>
						</div>
						<div>
							<h2>Category</h2>
							<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12'>
								{parsedData.category?.map((category: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
									<Button key={index} className='bg-white rounded-full text-black'>
										{category}
									</Button>
								))}
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<Label className='text-xl mb-6'>Price*</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={parsedData.price}
										readOnly
									/>
									<span>ETH</span>
								</div>
							</div>
							<div>
								<Label className='text-xl mb-6'>Quantity*</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={parsedData.quantity}
										readOnly
									/>
									<span>items</span>
								</div>
							</div>
							<div>
								<Label className='text-xl mb-6'>Royalty</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={parsedData.royality}
										readOnly
									/>
									<span>%</span>
								</div>
							</div>
						</div>
						<div>
							<h2 className='text-2xl'>Product Information for AI</h2>
							<Textarea
								className='border-0 bg-[#0000001A] rounded'
								value={parsedData.product_info}
								readOnly
							/>
						</div>
						<div className='flex justify-between'>
							<Button className='text-black bg-[#30D8FF] rounded-full ' onClick={() => handleButtonClick('phygital-details')}>
								Confirm
							</Button>
						</div>
					</div>
				)}

				{activeButton === 'phygital-details' && (
					<div className='border border-black bg-white p-8 '>
						<h1 className='text-2xl'>Additional Details</h1>
						<div className='flex flex-col gap-10 mt-8'>
							<div>
								<Label className='text-xl mb-6'>Colour(s)  </Label>
								<Input
									className='border-0 bg-[#0000001A] rounded w-full'
									value={parsedDetailsData.color}
									readOnly
								/>
							</div>
							<div className='flex gap-8'>
								<div className='basis-[70%]'>
									<Label className='text-xl mb-6'>Size* </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={parsedDetailsData.size}
										readOnly
									/>
								</div>
								<div className='basis-[30%]'>
									<Label className='text-xl mb-6'>Weight*</Label>
									<div className='flex gap-2'>
										<Input
											className='border-0 bg-[#0000001A] rounded'
											value={parsedDetailsData.weight}
											readOnly
										/>
										<span>Kg</span>
									</div>
								</div>
							</div>
							<div>
								<Label className='text-xl mb-6'>Usage</Label>
								<Input
									className='border-0 bg-[#0000001A] rounded w-2/5'
									value={parsedDetailsData.usage}
									readOnly
								/>
							</div>
							<div>
								<Label className='text-xl mb-6'>Material</Label>
								<Input
									className='border-0 bg-[#0000001A] rounded w-2/5'
									value={parsedDetailsData.material}
									readOnly
								/>
							</div>
							<div>
								<Label className='text-xl mb-6'>Unique qualities</Label>
								<Textarea
									className='border-0 bg-[#0000001A] rounded'
									value={parsedDetailsData.quality}
									readOnly
								/>
							</div>
							<div className='flex justify-between '>
								<div>
									<Label className='text-xl mb-6'>Manufacturer </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded w-full'
										value={parsedDetailsData.manufacturer}
										readOnly
									/>
								</div>
								<div>
									<Label className='text-xl mb-6'>Made in</Label>
									<Input
										className='border-0 bg-[#0000001A] rounded w-full'
										value={parsedDetailsData.origin_country}
										readOnly
									/>
								</div>
							</div>
							<div className='flex justify-between'>
								<Button className='text-black bg-[#30D8FF] rounded-full ' onClick={() => handleButtonClick('webxr')}>
									Confirm
								</Button>
							</div>
						</div>
					</div>
				)}

				{activeButton === 'webxr' && (
					<div className='border border-black bg-white p-8'>
						<h1 className='text-2xl'>WebXR experience</h1>
						<div className='flex flex-col gap-10 mt-8'>
							<div className='flex gap-8'>
								<div className='flex flex-col gap-12'>
									<h2 className='text-xl'>Your Avatar</h2>
									{parsedAvatarData.url ? (
										<Avatar
											modelSrc={parsedAvatarData.url}
											cameraInitialDistance={1.5}
										/>
									) : (
										<h2 className='text-2xl flex-col flex items-center '>
											<span>Avatar</span> <span>image</span> <span>here</span>
										</h2>
									)}
								</div>
								<div className='flex flex-col gap-12 w-full'>
									<h2 className='text-xl'>Your WebXR Background</h2>
									<div className='h-60 w-full flex flex-col items-center justify-center bg-[#D9D8D880] border border-black'>
										<img
											src={`https://nftstorage.link/${parsedWebxrData.image360.replace('ipfs://', 'ipfs/')}`}
											alt='preview'
											height={200}
											width={200}
										/>
									</div>
								</div>
							</div>
							<div>
								<h2 className='text-xl capitalize'>
									available customization options for the avatars
								</h2>
								<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12'>
									{parsedWebxrData.customizations?.map((customizations: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
										<Button key={index} className='bg-white rounded-full text-black'>
											{customizations}
										</Button>
									))}
								</div>
							</div>
							<div>
								<h2 className='text-xl'>
									Free NFTs given users who interact with your avatar
								</h2>
								<div className='flex justify-between'>
									<h2 className='text-xl'>Free NFT Image</h2>
									<div className='border border-black p-8'>
										<img
											src={`https://nftstorage.link/${parsedWebxrData.free_nft_image.replace('ipfs://', 'ipfs/')}`}
											alt='preview'
											height={200}
											width={200}
										/>
									</div>
								</div>
							</div>
							<div>
								<p>
									Weekly profit rewards given for the NFT owner and supporters
									if your avatar reaches the avatar leaderboard top 3
								</p>
								<div className='flex items-center justify-between'>
									<div>
										<Label className='text-xl mb-6'>Gold</Label>
										<div className='flex gap-2'>
											<Input className='border-0 bg-[#0000001A] rounded'
												value={parsedWebxrData.gold_reward}
												readOnly
											/>
											<span>%</span>
										</div>
									</div>
									<div>
										<Label className='text-xl mb-6'>Silver</Label>
										<div className='flex gap-2'>
											<Input className='border-0 bg-[#0000001A] rounded'
												value={parsedWebxrData.silver_reward}
												readOnly
											/>
											<span>%</span>
										</div>
									</div>
									<div>
										<Label className='text-xl mb-6'>Bronze</Label>
										<div className='flex gap-2'>
											<Input className='border-0 bg-[#0000001A] rounded'
												value={parsedWebxrData.bronze_reward}
												readOnly
											/>
											<span>%</span>
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-between'>
								<Link href='/launch-congratulation'>
									<Button className='text-black bg-[#30D8FF] rounded-full '>
										Launch
									</Button>
								</Link>

							</div>
						</div>
					</div>
				)}
			</main>
		</>
	)
}
