import { Button, Input, Label, Navbar, Textarea } from '@/components'
import Image from 'next/image'

export default function Review() {
	return (
		<>
			<Navbar />
			<main className='min-h-screen p-20 flex flex-col gap-12 text-black'>
				<div className='flex justify-between items-center'>
					<Button className='bg-[#4187D6] border border-black text-white'>
						Phygital
					</Button>
					<Button className='bg-transparent border border-black text-black'>
						Additional Details
					</Button>
					<Button className='bg-transparent border border-black text-black'>
						WebXR Experience
					</Button>
				</div>
				<div className='border border-black bg-white p-8'>
					<div>
						<h1 className='text-2xl '>Phygital</h1>
						<p className='text-xl mt-8'>Chain: Base network</p>
					</div>
					<div className='flex gap-8'>
						<div>
							<div>
								<Label className='text-xl mb-6'>Phygital name </Label>
								<Input className='border-0 bg-[#0000001A] rounded' />
							</div>
							<div>
								<Label className='text-xl mb-6'>Description</Label>
								<Textarea className='border-0 bg-[#0000001A] rounded' />
							</div>
						</div>
						<div className='border border-black p-8'>
							<Image
								src='/images/preview.png'
								alt='preview'
								height={200}
								width={200}
							/>
						</div>
					</div>
					<div>
						<h2>Category</h2>
						<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12'>
							<Button className='bg-white rounded-full text-black'>
								Fashion
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Collectibles
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Art & Photography
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Functional items
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Luxury goods
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Sustainable materials
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Tech enabled
							</Button>
							<Button className='bg-white rounded-full text-black'>
								Music lovers
							</Button>
						</div>
					</div>
					<div className='flex items-center justify-between'>
						<div>
							<Label className='text-xl mb-6'>Price*</Label>
							<div className='flex gap-2'>
								<Input className='border-0 bg-[#0000001A] rounded' />
								<span>ETH</span>
							</div>
						</div>
						<div>
							<Label className='text-xl mb-6'>Quantity*</Label>
							<div className='flex gap-2'>
								<Input className='border-0 bg-[#0000001A] rounded' />
								<span>items</span>
							</div>
						</div>
						<div>
							<Label className='text-xl mb-6'>Royalty</Label>
							<div className='flex gap-2'>
								<Input className='border-0 bg-[#0000001A] rounded' />
								<span>%</span>
							</div>
						</div>
					</div>
					<div>
						<h2 className='text-2xl'>Product Information for AI</h2>
						<Textarea className='border-0 bg-[#0000001A] rounded' />
					</div>
					<div className='flex justify-between'>
						<Button className='text-black bg-transparent rounded-full border border-black'>
							Edit
						</Button>
						<Button className='text-black bg-[#30D8FF] rounded-full '>
							Confirm
						</Button>
					</div>
				</div>

				<div className='border border-black bg-white p-8 '>
					<h1 className='text-2xl'>Additional Details</h1>
					<div className='flex flex-col gap-10 mt-8'>
						<div>
							<Label className='text-xl mb-6'>Colour(s)  </Label>
							<Input className='border-0 bg-[#0000001A] rounded w-full' />
						</div>
						<div className='flex gap-8'>
							<div className='basis-[70%]'>
								<Label className='text-xl mb-6'>Size* </Label>
								<Input className='border-0 bg-[#0000001A] rounded' />
							</div>
							<div className='basis-[30%]'>
								<Label className='text-xl mb-6'>Weight*</Label>
								<div className='flex gap-2'>
									<Input className='border-0 bg-[#0000001A] rounded' />
									<span>Kg</span>
								</div>
							</div>
						</div>
						<div>
							<Label className='text-xl mb-6'>Usage</Label>
							<Input className='border-0 bg-[#0000001A] rounded w-2/5' />
						</div>
						<div>
							<Label className='text-xl mb-6'>Material</Label>
							<Input className='border-0 bg-[#0000001A] rounded w-2/5' />
						</div>
						<div>
							<Label className='text-xl mb-6'>Unique qualities</Label>
							<Textarea className='border-0 bg-[#0000001A] rounded' />
						</div>
						<div className='flex justify-between '>
							<div>
								<Label className='text-xl mb-6'>Manufacturer </Label>
								<Input className='border-0 bg-[#0000001A] rounded w-full' />
							</div>
							<div>
								<Label className='text-xl mb-6'>Made  in</Label>
								<Input className='border-0 bg-[#0000001A] rounded w-full' />
							</div>
						</div>
						<div className='flex justify-between'>
							<Button className='text-black bg-transparent rounded-full border border-black'>
								Edit
							</Button>
							<Button className='text-black bg-[#30D8FF] rounded-full '>
								Confirm
							</Button>
						</div>
					</div>
				</div>
				<div className='border border-black bg-white p-8'>
					<h1 className='text-2xl'>WebXR experience</h1>
					<div className='flex flex-col gap-10 mt-8'>
						<div className='flex gap-8'>
							<div className='flex flex-col gap-12'>
								<h2 className='text-xl'>Your Avatar</h2>
								<Image
									src='/images/preview.png'
									alt='preview'
									height={200}
									width={200}
								/>
							</div>
							<div className='flex flex-col gap-12 w-full'>
								<h2 className='text-xl'>Your WebXR Background</h2>
								<div className='h-60 w-full flex flex-col items-center justify-center bg-[#D9D8D880] border border-black'>
									<p>360 Image</p>
								</div>
							</div>
						</div>
						<div>
							<h2 className='text-xl capitalize'>
								available customization options for the avatars
							</h2>
							<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12'>
								<Button className='bg-white rounded-full text-black'>
									Gender
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Face
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Skin Color
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Hair
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Clothing
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Accessories
								</Button>
								<Button className='bg-white rounded-full text-black'>
									Animations
								</Button>
							</div>
						</div>
						<div>
							<h2 className='text-xl'>
								Free NFTs given users who interact with your avatar
							</h2>
							<div className='flex justify-between'>
								<h2 className='text-xl'>Free NFT Image</h2>
								<div className='border border-black p-8'>
									<Image
										src='/images/preview.png'
										alt='preview'
										height={200}
										width={200}
									/>
								</div>
							</div>
						</div>
						<div>
							<p>
								Weekly profit rewards given for the NFT owner and supporters if
								your avatar reaches the avatar leaderboard top 3
							</p>
							<div className='flex items-center justify-between'>
								<div>
									<Label className='text-xl mb-6'>Gold</Label>
									<div className='flex gap-2'>
										<Input className='border-0 bg-[#0000001A] rounded' />
										<span>%</span>
									</div>
								</div>
								<div>
									<Label className='text-xl mb-6'>Silver</Label>
									<div className='flex gap-2'>
										<Input className='border-0 bg-[#0000001A] rounded' />
										<span>%</span>
									</div>
								</div>
								<div>
									<Label className='text-xl mb-6'>Bronze</Label>
									<div className='flex gap-2'>
										<Input className='border-0 bg-[#0000001A] rounded' />
										<span>%</span>
									</div>
								</div>
							</div>
						</div>
						<div className='flex justify-between'>
							<Button className='text-black bg-transparent rounded-full border border-black'>
								Edit
							</Button>
							<Button className='text-black bg-[#30D8FF] rounded-full '>
								Confirm
							</Button>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
