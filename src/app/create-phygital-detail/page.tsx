'use client'
import { useState, useEffect } from 'react'
import {
	Button,
	Input,
	Label,
	Navbar,
	Textarea,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	PlusIcon,
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormRepeater from 'react-form-repeater'
import { v4 as uuidv4 } from 'uuid'

const formSchema = z.object({
	color: z.string().min(2, {
		message: 'Color must be at least 2 characters',
	}),
	size: z
		.string()
		.min(1, { message: 'Size must be at least 1 character' }),
	weight: z.string().min(1, { message: 'Weight must be provided' }),
	material: z.string().min(1, { message: 'Material must be provided' }),
	usage: z.string(),
	quality: z.string(),
	manufacturer: z
		.string()
		.min(2, { message: 'Manufacturer must be at least 2 characters' }),
	origin_country: z
		.string()
		.min(2, { message: 'Country of origin must be at least 2 characters' }),
})

interface FormDataEntry {
	title: string
	description: string
}

export default function CreatePhygitalDetail() {

	const apiUrl = process.env.NEXT_PUBLIC_URI;


	const router = useRouter()
	const [formData, setFormData] = useState<FormDataEntry[]>([])
	const [loading, setLoading] = useState(false)

	const getData = () => {
		if (typeof window !== 'undefined' && localStorage) {
			return localStorage.getItem('phygitalData')
		}
		return null
	}

	const storedData = getData()
	const parsedData = storedData ? JSON.parse(storedData) : {}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			color: '',
			size: '',
			weight: '',
			material: '',
			usage: '',
			quality: '',
			manufacturer: '',
			origin_country: '',
		},
	})

	const handleFormChange = (newFormData: FormDataEntry[]) => {
		setFormData(newFormData)
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			localStorage.setItem('phygitalDetailsData', JSON.stringify(values))
			setLoading(true)
			
			const phygitalId = localStorage.getItem("PhygitalId");
			const CollectionId = localStorage.getItem("CollectionId")
			const phygitalResponse = await fetch(`${apiUrl}/phygitals/${phygitalId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: phygitalId,
					collection_id:CollectionId,
					color: values.color,
					size: values.size,
					weight: parseInt(values.weight),
					material: values.material,
					usage: values.usage,
					quality: values.quality,
					manufacturer: values.manufacturer,
					origin_country: values.origin_country,
					name: parsedData.name,
					brand_name: parsedData.brand_name,
					category: { data: parsedData.category },
					description: parsedData.description,
					price: parseInt(parsedData.price),
					quantity: parseInt(parsedData.quantity),
					royality: parseInt(parsedData.royality),
					product_info: parsedData.product_info,
					image: parsedData.image,
				}),
			})

			if (formData.length > 0) {
				const variantData = formData.map((item: FormDataEntry) => ({
					variant: item.title.toUpperCase() || '',
					description: item.description || '',
				}))
				const variantId = uuidv4()
				await fetch(`${apiUrl}/variants`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: variantId,
						phygital_id:phygitalId,
						variantData,
					}),
				})
			}

			if (phygitalResponse.status === 200) {
				router.push('/create-avatar')
			} else {
				toast.warning('Failed to create phygital data')
			}
		} catch (error) {
			console.error(error)
			toast.error('An error occurred while creating phygital data')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Navbar />
			<ToastContainer />
			<main className='min-h-screen'>
				<div className='px-16 py-8 border-b text-black border-black'>
					<h1 className='font-bold uppercase text-3xl mb-4'>
						Additional details
					</h1>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='py-4 px-32 flex flex-col gap-12'>
							<FormField
								name='color'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl mb-6'>Colours*</FormLabel>
										<FormDescription>
											Ensure to use a comma after each colour
										</FormDescription>
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

							<div className='flex gap-8'>
								<FormField
									name='size'
									control={form.control}
									render={({ field }) => (
										<FormItem className='basis-[70%]'>
											<FormLabel className='text-xl mb-6'>Size* </FormLabel>
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
									name='weight'
									control={form.control}
									render={({ field }) => (
										<FormItem className='basis-[30%]'>
											<FormLabel className='text-xl mb-6'>Weight*</FormLabel>
											<div className='flex gap-2'>
												<FormControl>
													<Input
														className='border-0 bg-[#0000001A] rounded'
														{...field}
													/>
												</FormControl>

												<span>Kg</span>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								name='usage'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl mb-6'>Usage</FormLabel>
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
								<Label className='text-xl mb-6 flex items-center'>
									Variants <PlusIcon />
								</Label>
								<FormRepeater
									initialValues={[{ title: '', description: '' }]}
									onChange={handleFormChange}
								>
									<Input type='text' name='title' placeholder='title' />
									<Input
										type='text'
										name='description'
										placeholder='description'
									/>
								</FormRepeater>
							</div>
							<FormField
								name='material'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xl mb-6'>Material</FormLabel>
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

							<FormField
								name='quality'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<Label className='text-xl font-semibold mb-4'>
											Unique Qualities
										</Label>
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

							<div className='flex gap-4'>
								<FormField
									name='manufacturer'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>
												Manufacturer *
											</FormLabel>
											<FormControl>
												<Input
													className='border-0 bg-[#0000001A] rounded'
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									name='origin_country'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-xl mb-6'>Made In *</FormLabel>
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
							</div>
							<div>
								<h3 className='text-2xl'>
									Create WebXR experience with unique AI avatars*
								</h3>
								<p className='mt-4'>
									Choose yes if you want to create AI-powered brand ambassadors
									that interact with your customers.
								</p>
							</div>

							<div>
								<Button
									type='submit'
									className='bg-[#30D8FF] rounded-full text-black'
								>
									{loading ? 'loading' : 'Next'}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</main>
		</>
	)
}
