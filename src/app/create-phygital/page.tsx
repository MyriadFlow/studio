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
// import { UploadButton } from '@/utils/uploadthing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { NFTStorage } from 'nft.storage'
import { v4 as uuidv4 } from 'uuid';
const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API!
const client = new NFTStorage({ token: API_KEY })

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Phygital name must be at least 2 characters',
	}),
	category: z
		.array(z.string()),
	// .refine((value) => value.some((item) => item), {
	// 	message: 'You have to select at least one category.',
	// }),

	description: z
		.string()
		.min(2, { message: 'Description must be at least 2 characters' })
		.max(1000, {
			message: 'Brand description should be less than 1000 words',
		}),
	price: z.string().min(1, { message: 'Price must be provided' }),
	quantity: z.string().min(1, { message: 'Quantity must be provided' }),
	royality: z.string(),
	product_info: z
		.string()
		.min(2, { message: 'Product Information must be at least 2 characters' }),
	image: z.string(),
	brand_name: z.string(),
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

	const apiUrl = process.env.NEXT_PUBLIC_URI;

	const [showForm, setShowForm] = useState(false)
	const [productURL, setProductURL] = useState('')

	const handleSubmit =  () => {
		if (!productURL) {
			toast.warning('Product URL is required.')
			return
		} else {
			localStorage.setItem("producturl", productURL)
		}
	}


	const handleCheckboxChange = () => {
		setShowForm(!showForm);
	};


	const router = useRouter()
	const [imageUrl, setImageUrl] = useState<string>('')
	const [preview, setPreview] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			category: [],
			description: '',
			price: '',
			quantity: '',
			royality: '',
			product_info: '',
			image: '',
			brand_name: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!imageUrl) {
			setImageError(true)
		}

		try {
			if (typeof window !== 'undefined' && localStorage) {
				const brand_name = localStorage.getItem('brand_name')
				values.image = imageUrl
				values.brand_name = brand_name!
				localStorage.setItem('phygitalData', JSON.stringify(values))

				if (imageUrl !== '') {
					setLoading(true)
					const phygitalId = uuidv4()
					const CollectionId = localStorage.getItem("CollectionId")
					const walletAddress = localStorage.getItem("walletAddress")
					const productUrl = localStorage.getItem("producturl")
					const response = await fetch(`${apiUrl}/phygitals`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: phygitalId,
							collection_id: CollectionId,
							deployer_address: walletAddress,
							product_url: productUrl,
							name: values.name,
							brand_name: values.brand_name,
							category: { data: values.category },
							description: values.description,
							price: parseFloat(values.price),
							quantity: parseInt(values.quantity),
							royality: parseInt(values.royality),
							product_info: values.product_info,
							image: values.image,
						}),
					})
					const phygital = await response.json();
					localStorage.setItem("PhygitalId", phygital.id);
					if (response.status === 200) {
						router.push(
							`/create-phygital-detail
			`
						)
					}
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

	async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		try {
			setLoading(true)
			const blobDataImage = new Blob([e.target.files![0]])
			const metaHash = await client.storeBlob(blobDataImage)
			setImageUrl(`ipfs://${metaHash}`)
			toast.success('Upload Completed!', {
				position: 'top-left',
			})
			console.log('profilePictureUrl', metaHash)
		} catch (error) {
			console.log('Error uploading file: ', error)
		} finally {
			setLoading(false)
		}
	}

	const removePrefix = (uri: any) => {
		return uri.substring(7, uri.length)
	}

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

							<div>
								<label className='flex items-center text-xl'>
									<input
										type='checkbox'
										checked={showForm}
										onChange={handleCheckboxChange}
										className='mr-2 '
									/>
									I’m already selling the product on Shopify
								</label>
								{showForm && (
									<div className='mt-6'>
										<div className='flex flex-col gap-4'>
											<label>
												Product URL*
												<input
													type='text'
													className='border rounded px-2 py-1 border border-black ml-2 w-96'
													value={productURL}
													onChange={(e) => setProductURL(e.target.value)}
													required
												/>
											</label>
											<button
												className='w-fit border border-black bg-[#0000001A] rounded-lg text-black text-2xl mt-4 px-6'
												onClick={handleSubmit}
											>
												Save
											</button>
										</div>
									</div>)}
							</div>
							<FormField
								name='name'
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
									Categories
									<span className='text-[#757575] text-base'>
										Choose all that apply <Checkbox checked={true} />
									</span>
								</Label>
								<FormField
									control={form.control}
									name='category'
									render={() => (
										<FormItem className='flex justify-between mt-8 flex-wrap'>
											{items.map((item) => (
												<FormField
													key={item.id}
													control={form.control}
													name='category'
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
									name='royality'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>royality</FormLabel>
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
										<div>
											<label
												htmlFor='upload'
												className='flex flex-row items-center ml-12 cursor-pointer mt-4'
											>
												<input
													id='upload'
													type='file'
													className='hidden'
													onChange={uploadImage}
													accept='image/*'
												/>
												<img
													src='https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg'
													alt=''
													className='w-10 h-10'
												/>
												<div className='text-white ml-1'>Replace</div>
											</label>
										</div>
									</div>
									{imageError && (
										<p className='text-red-700'>You have to upload an Image</p>
									)}
								</div>
								<div>
									<h3 className='text-2xl'>Preview</h3>
									{preview ? (
										<img
											// src={imageUrl}
											src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
												imageUrl
											)}`}
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
								name='product_info'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Product Information for AI*
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
