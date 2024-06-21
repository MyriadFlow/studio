'use client'
import { useState, useEffect } from 'react'
import {
	Button,
	Checkbox,
	Input,
	Label,
	Navbar,
	PreviewIcon,
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
import { UploadButton } from '@/utils/uploadthing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
	phygitalName: z.string().min(2, {
		message: 'Phygital name must be at least 2 characters',
	}),
	categories: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: 'You have to select at least one category.',
		}),

	description: z
		.string()
		.min(2, { message: 'Description must be at least 2 characters' })
		.max(50, {
			message: 'Brand description should be less than ',
		}),
	price: z.string().min(1, { message: 'Price must be provided' }),
	quantity: z.string().min(1, { message: 'Quantity must be provided' }),
	royalty: z.string(),
	productInfo: z
		.string()
		.min(2, { message: 'Product Information must be at least 2 characters' }),
	image: z.string(),
	brandName: z.string(),
})

const items = [
	{
		id: 'fashion',
		label: 'Fashion',
	},
	{
		id: 'home & decor',
		label: 'Home & Decor',
	},
	{
		id: 'sustainable goods',
		label: 'Sustainable goods',
	},
	{
		id: 'collectibles',
		label: 'Collectibles',
	},
	{
		id: 'functional items',
		label: 'Functional items',
	},
	{
		id: 'tech enabled',
		label: 'Tech enabled',
	},
	{
		id: 'art & photography',
		label: 'Art & Photography',
	},
	{
		id: 'luxury goods',
		label: 'Luxury goods',
	},
	{
		id: 'music lovers',
		label: 'Music lovers',
	},
]

export default function CreatePhygital() {
	const isDevelopment = process.env.NODE_ENV === 'development'

	const apiUrl = isDevelopment
		? 'http://localhost:3000' // Local development URL
		: 'https://studio.myriadflow.com' // Production URL

	const router = useRouter()
	const [imageUrl, setImageUrl] = useState<string>('')
	const [preview, setPreview] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phygitalName: '',
			categories: [],
			description: '',
			price: '',
			quantity: '',
			royalty: '',
			productInfo: '',
			image: '',
			brandName: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!imageUrl) {
			setImageError(true)
		}

		try {
			const brandName = localStorage.getItem('brandName')
			values.image = imageUrl
			values.brandName = brandName!
			localStorage.setItem('phygitalData', JSON.stringify(values))

			if (imageUrl !== '') {
				setLoading(true)
				const collection = await fetch(`${apiUrl}/api/create-collection`, {
					method: 'POST',
					body: JSON.stringify([values.phygitalName, values.brandName]),
				})

				if (collection.status === 201) {
					router.push(
						`/create-phygital-detail
			`
					)
				}
			} else if (!imageError && imageUrl === '') {
				toast.warning('Wait for your image to finish upload')
			}
		} catch (error) {
			console.log('Errors' + error)
			toast.warning('Failed to create Collection')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (imageUrl) {
			setPreview(true)
		}

		return () => {
			setPreview(false)
		}
	}, [imageUrl])

	return (
		<>
			<Navbar />
			<ToastContainer />
			<main className='min-h-screen'>
				<div className='px-16 py-8 border-b text-black border-black'>
					<h1 className='font-bold uppercase text-3xl mb-4'>
						Create your Phygital
					</h1>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='py-4 px-32 flex flex-col gap-12'>
							<h2 className='text-xl font-bold'>Chain: Base Network</h2>
							<FormField
								name='phygitalName'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl mb-6'>
											Phygital Name*
										</FormLabel>
										<FormControl>
											<Input
												className='border-0 bg-[#0000001A] rounded w-2/5'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div>
								<Label className='text-xl mb-6'>
									categories*
									<span className='text-[#757575] text-base'>
										Choose all that apply <Checkbox checked={true} />
									</span>
								</Label>
								<FormField
									control={form.control}
									name='categories'
									render={() => (
										<FormItem className='flex justify-between mt-8 flex-wrap'>
											{items.map((item) => (
												<FormField
													key={item.id}
													control={form.control}
													name='categories'
													render={({ field }) => {
														return (
															<FormItem
																key={item.id}
																className='flex items-baseline space-x-3 space-y-6 basis-[30%]'
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item.id)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						item.id,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value: any) => value !== item.id
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
							<FormField
								name='description'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Description*
										</FormLabel>
										<FormControl>
											<Textarea
												className='border-0 bg-[#0000001A]'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex items-center justify-between'>
								<FormField
									name='price'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>Price*</FormLabel>
											<div className='flex gap-2'>
												<FormControl>
													<Input
														className='border-0 bg-[#0000001A] rounded'
														{...field}
													/>
												</FormControl>
												<span>ETH</span>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									name='quantity'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>Quantity*</FormLabel>
											<div className='flex gap-2'>
												<FormControl>
													<Input
														className='border-0 bg-[#0000001A] rounded'
														{...field}
													/>
												</FormControl>
												<span>items</span>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									name='royalty'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>Royalty</FormLabel>
											<div className='flex gap-2'>
												<FormControl>
													<Input
														className='border-0 bg-[#0000001A] rounded'
														{...field}
													/>
												</FormControl>
												<span>%</span>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex gap-12'>
								<div>
									<h3 className='text-2xl'>Upload Image*</h3>
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
								<div>
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
							<FormField
								name='productInfo'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Product Information for AI
										</FormLabel>
										<FormDescription>
											Fill this field if you want to create an AI-powered brand
											ambassador
										</FormDescription>
										<Textarea className='border-0 bg-[#0000001A]' {...field} />
									</FormItem>
								)}
							/>

							<Button
								type='submit'
								className='w-fit bg-[#30D8FF] rounded-full text-black'
							>
								{loading ? 'loading' : 'Next'}
							</Button>
						</div>
					</form>
				</Form>
			</main>
		</>
	)
}
