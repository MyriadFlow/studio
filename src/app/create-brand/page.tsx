'use client'
import { useState, useEffect } from 'react'
import {
	Button,
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
import { getBaseUrl } from '@/utils/api'
import { useAccount } from 'wagmi'

const formSchema = z.object({
	brandName: z.string().min(2, {
		message: 'Brand name must be at least 2 characters',
	}),
	description: z
		.string()
		.min(2, { message: 'Brand description must be at least 2 characters' })
		.max(50, {
			message: 'Brand description should be less than ',
		}),
	brandRepresentative: z
		.string()
		.min(2, { message: 'Brand Representative must be at least 2 characters' }),
	contactEmail: z
		.string()
		.email()
		.min(2, { message: 'Contact email must be a valid email' }),
	contactPhone: z
		.string()
		.min(2, { message: 'Contact phone number must be a valid pnone number' }),
	shippingAddress: z
		.string()
		.min(2, { message: 'Shipping Address must be at least 2 characters' }),
	brandInfo: z
		.string()
		.min(2, { message: 'Brand Information must be at least 2 characters' }),
	logoImage: z.string(),
	walletAddress: z.string(),
})

export default function CreateBrand() {
	const isDevelopment = process.env.NODE_ENV === 'development'

	const apiUrl = isDevelopment
		? 'http://localhost:3000' // Local development URL
		: 'https://studio.myriadflow.com' // Production URL

	const account = useAccount()
	const router = useRouter()
	const [imageUrl, setImageUrl] = useState<string>('')
	const [preview, setPreview] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			brandName: '',
			description: '',
			brandRepresentative: '',
			contactEmail: '',
			contactPhone: '',
			shippingAddress: '',
			brandInfo: '',
			logoImage: '',
			walletAddress: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!account.addresses) {
			toast.warning('Connect your wallet')
		} else {
			if (!imageUrl) {
				setImageError(true)
			}

			try {
				values.logoImage = imageUrl
				values.walletAddress = account.address!
				localStorage.setItem('brandName', values.brandName)
				console.log(values)

				if (imageUrl !== '') {
					setLoading(true)
					const brand = await fetch(`${apiUrl}/api/create-brand`, {
						method: 'POST',
						body: JSON.stringify(values),
					})

					console.log(brand)
					// console.log(manager)
					if (brand.status === 201) {
						router.push(`/congratulations?name=${values.brandName}`)
					}
				} else if (!imageError && imageUrl === '') {
					toast.warning('Wait for your image to finish upload')
				}
			} catch (error) {
				console.log(error)
				toast.warning('Failed to create Brand')
				setLoading(false)
			}
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
						Create your brand
					</h1>
					<p>Fill out the details for creating your brand</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='py-4 px-32 flex flex-col gap-12'>
							<FormField
								control={form.control}
								name='brandName'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Brand Name*
										</FormLabel>
										<FormControl>
											<Input
												className='border-0 bg-[#0000001A] rounded'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='description'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Brand Description*
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

							<div className='flex gap-12'>
								<div>
									<h3 className='text-2xl'>Upload Logo*</h3>
									<div className='border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6'>
										<UploadIcon />
										<p>Drag file here to upload. Choose file </p>
										<p>Recommeded size 512 x 512 px</p>
										<UploadButton
											className='block mx-auto cursor-pointer'
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
										<p className='text-red-700'>You have to upload a logo</p>
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
								name='brandRepresentative'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Name of Brand Representative *
										</FormLabel>

										<FormControl>
											<Input
												className='border-0 bg-[#0000001A] rounded'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='contactEmail'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Contact Email*
										</FormLabel>
										<FormControl>
											<Input
												className='border-0 bg-[#0000001A] rounded'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='contactPhone'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Contact Phone*
										</FormLabel>
										<Input
											className='border-0 bg-[#0000001A] rounded'
											{...field}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='shippingAddress'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Shipping address for NFC tags*
										</FormLabel>
										<FormControl>
											<Input
												className='border-0 bg-[#0000001A] rounded'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='brandInfo'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl font-semibold mb-4'>
											Brand Information for AI *
										</FormLabel>
										<FormDescription>
											Fill this field if you want to create an AI-powered brand
											ambassador
										</FormDescription>
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

							<Button
								type='submit'
								className='w-fit bg-[#30D8FF] text-black hover:text-white rounded-full'
							>
								{loading ? 'loading...' : 'Launch brand'}
							</Button>
						</div>
					</form>
				</Form>
			</main>
		</>
	)
}
