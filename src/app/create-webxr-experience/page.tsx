'use client'
import { useState, useEffect } from 'react'
import {
	Button,
	Checkbox,
	Input,
	Label,
	Navbar,
	PreviewIcon,
	RadioGroup,
	RadioGroupItem,
	Textarea,
	UploadIcon,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import { UploadButton } from '@/utils/uploadthing'
import { Avatar } from '@readyplayerme/visage'

const formSchema = z.object({
	image360: z.string(),
	customizaton: z
		.array(z.string())
		.refine((value) => value.some((item) => item))
		.optional(),
	freeNftImage: z.string(),
	goldReward: z.string().min(1, { message: 'Gold reward must be provided' }),
	silverReward: z
		.string()
		.min(1, { message: 'Silver reward must be provided' }),
	bronzeReward: z
		.string()
		.min(1, { message: 'Bronze reward must be provided' }),
})

const items = [
	{
		id: 'gender',
		label: 'Gender',
	},
	{
		id: 'face',
		label: 'Face',
	},
	{
		id: 'skin color',
		label: 'Skin color',
	},
	{
		id: 'hair',
		label: 'Hair',
	},
	{
		id: 'clothing',
		label: 'Clothing',
	},
	{
		id: 'accessories',
		label: 'Accessories',
	},
	{
		id: 'animations',
		label: 'Animations',
	},
]

export default function CreateWebxrExperience() {
	const isDevelopment = process.env.NODE_ENV === 'development'

	const apiUrl = isDevelopment
		? 'http://localhost:3000' // Local development URL
		: 'https://studio.myriadflow.com' // Production URL

	const router = useRouter()
	const [imageUrl, setImageUrl] = useState<string>('')
	const [nftImageUrl, setNftImageUrl] = useState<string>('')
	const [preview, setPreview] = useState<boolean>(false)
	const [nftPreview, setNftPreview] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const storedData = localStorage.getItem('avatar') ?? '{}'
	const phygital = localStorage.getItem('phygitalData') ?? '{}'

	const parsedData = JSON.parse(storedData)
	const phygitalName = JSON.parse(phygital).phygitalName

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			image360: '',
			customizaton: [],
			freeNftImage: '',
			goldReward: '',
			silverReward: '',
			bronzeReward: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(parsedData)
		console.log(phygitalName)

		if (!imageUrl) {
			setImageError(true)
		}
		try {
			values.image360 = imageUrl
			values.freeNftImage = nftImageUrl ?? nftImageUrl

			console.log(values)

			if (imageUrl !== '') {
				setLoading(true)
				const webxr = await fetch(`${apiUrl}/api/create-phygital/webxr`, {
					method: 'POST',
					body: JSON.stringify({
						phygitalName,
						...values,
					}),
				})

				await fetch(`${apiUrl}/api/create-phygital/avatar`, {
					method: 'POST',
					body: JSON.stringify({
						phygitalName,
						...parsedData,
					}),
				})

				if (webxr.status === 201) {
					router.push('/review')
				}
			}
		} catch (error) {
			console.log(error)
			toast.warning('Failed to create WebXR experience')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (imageUrl) {
			setPreview(true)
		} else if (nftImageUrl) {
			setNftPreview(true)
		}

		return () => {
			setPreview(false)
			setNftPreview(false)
		}
	}, [imageUrl, nftImageUrl])

	return (
		<>
			<Navbar />
			<ToastContainer />
			<main className='min-h-screen'>
				<div className='px-16 py-8 border-b text-black border-black'>
					<h1 className='font-bold uppercase text-3xl mb-4'>
						Create WebXR experience
					</h1>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='py-4 px-32 flex flex-col gap-12'>
							<div className='flex justify-between items-center'>
								<h3 className='text-xl'>
									Congratulations on creating your avatar! You can now complete
									your WebXR experience.
								</h3>
								<div>
									<h3 className='text-xl'>Avatar preview</h3>
									{parsedData.url ? (
										<Avatar
											modelSrc={parsedData.url}
											cameraInitialDistance={1.5}
										/>
									) : (
										<h2 className='text-2xl flex-col flex items-center '>
											<span>Avatar</span> <span>image</span> <span>here</span>
										</h2>
									)}
								</div>
							</div>
							<div className='flex gap-12'>
								<div className='w-full'>
									<h3 className='text-2xl'>Upload 360 image background*</h3>
									<div className='border border-dashed border-black h-60 w-full flex flex-col items-center justify-center p-6'>
										<UploadIcon />
										<p>Drag file here to upload. Choose file </p>
										<UploadButton
											className='block mx-auto'
											endpoint='imageUploader'
											onClientUploadComplete={async (res) => {
												// Do something with the response
												const data = res[0]
												console.log('Files: ', res)
												setImageUrl(data.url)
												toast.success('Upload Completed!', {
													position: 'top-left',
												})
											}}
											onUploadError={(error: Error) => {
												// Do something with the error.
												alert(`ERROR! ${error.message}`)
											}}
										/>
									</div>
									{imageError && (
										<p className='text-red-700'>You have to upload an Image</p>
									)}
								</div>
								<div className='w-full'>
									<h3 className='text-2xl'>Preview</h3>
									{preview ? (
										<Image
											src={imageUrl}
											alt='preview image'
											height={250}
											width={350}
										/>
									) : (
										<div className='border border-[#D9D8D8] h-60 w-80 flex flex-col items-center justify-center p-6'>
											<PreviewIcon />
											<p>Preview after upload</p>
										</div>
									)}
								</div>
							</div>

							<div className='flex gap-12 flex-col p-4 border-[#30D8FF] border rounded'>
								<div className='flex gap-4'>
									<h3 className='text-xl'>
										Choose available customization options for the avatars*
									</h3>
									<span>Choose all that apply</span>
									<Checkbox />
								</div>
								<FormField
									control={form.control}
									name='customizaton'
									render={() => (
										<FormItem className='flex justify-between mt-8 flex-wrap'>
											{items.map((item) => (
												<FormField
													key={item.id}
													control={form.control}
													name='customizaton'
													render={({ field }) => {
														return (
															<FormItem
																key={item.id}
																className='flex items-baseline space-x-3 space-y-6 basis-[20%]'
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item.id)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value!,
																						item.id,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== item.id
																						)
																				  )
																		}}
																	/>
																</FormControl>
																<FormLabel className='font-normal'>
																	{item.label}
																</FormLabel>
															</FormItem>
														)
													}}
												/>
											))}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex gap-12 flex-col'>
								<h3 className='text-xl'>
									Give Free NFTs to users who interact with your avatar
								</h3>
								<p>
									Choose this option if you want your avatars to compete on the
									leaderboard for increased visibility and weekly rewards.
								</p>
							</div>
							<div className='flex gap-12 p-4 border-[#30D8FF] border rounded'>
								<div>
									<h3 className='text-2xl'>Upload free NFT image</h3>
									<p>
										You can upload anything. We recommend uploading an image of
										your avatar in your background.
									</p>
									<div className='border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6'>
										<UploadIcon />
										<p>Drag file here to upload. Choose file </p>
										<p>Recommeded size 512 x 512 px</p>
										<UploadButton
											className='block mx-auto'
											endpoint='imageUploader'
											onClientUploadComplete={async (res) => {
												// Do something with the response
												const data = res[0]
												console.log('Files: ', res)
												setNftImageUrl(data.url)
												toast.success('Nft Upload Completed!', {
													position: 'top-left',
												})
											}}
											onUploadError={(error: Error) => {
												// Do something with the error.
												alert(`ERROR! ${error.message}`)
											}}
										/>
									</div>
								</div>
								<div>
									<h3 className='text-2xl'>Preview</h3>
									{nftPreview ? (
										<Image
											src={nftImageUrl}
											alt='preview image'
											height={250}
											width={350}
										/>
									) : (
										<div className='border border-[#D9D8D8] h-60 w-80 flex flex-col items-center justify-center p-6'>
											<PreviewIcon />
											<p>Preview after upload</p>
										</div>
									)}
								</div>
							</div>
							<div>
								<h3 className='text-2xl'>
									Set weekly profit rewards given for the NFT owner and
									supporters if your avatar reaches the avatar leaderboard top
									3*.
									<span>Most users opt for 1-5%</span>
								</h3>
								<div className='flex items-center justify-between'>
									<FormField
										name='goldReward'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-xl mb-6'>Gold</FormLabel>
												<div className='flex gap-2'>
													<FormControl>
														<Input
															className='border-0 bg-[#0000001A] rounded'
															{...field}
														/>
													</FormControl>
													<span>%</span>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										name='silverReward'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-xl mb-6'>Silver</FormLabel>
												<div className='flex gap-2'>
													<FormControl>
														<Input
															className='border-0 bg-[#0000001A] rounded'
															{...field}
														/>
													</FormControl>
													<span>%</span>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										name='bronzeReward'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-xl mb-6'>Bronze</FormLabel>
												<div className='flex gap-2'>
													<FormControl>
														<Input
															className='border-0 bg-[#0000001A] rounded'
															{...field}
														/>
													</FormControl>
													<span>%</span>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<Button className='bg-[#30D8FF] rounded-full text-black'>
								{loading ? 'loading ' : 'Review phygital & WebXR'}
							</Button>
						</div>
					</form>
				</Form>
			</main>
		</>
	)
}
