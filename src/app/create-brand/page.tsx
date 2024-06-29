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
// import { UploadButton } from '@/utils/uploadthing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import { NFTStorage } from 'nft.storage'
import { Hex, createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import axios from 'axios'

import Simplestore from "@/lib/Simplestore.json"
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API!
const client = new NFTStorage({ token: API_KEY })

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Brand name must be at least 2 characters',
	}),
	description: z
		.string()
		.min(2, { message: 'Brand description must be at least 2 characters' })
		.max(1000, {
			message: 'Brand description should be less than 1000 words',
		}),
	representative: z
		.string()
		.min(2, { message: 'Brand Representative must be at least 2 characters' }),
	contact_email: z
		.string()
		.email()
		.min(2, { message: 'Contact email must be a valid email' }),
	contact_phone: z
		.string()
		.min(2, { message: 'Contact phone number must be a valid pnone number' }),
	shipping_address: z
		.string()
		.min(2, { message: 'Shipping Address must be at least 2 characters' }),
	additional_info: z
		.string()
		.min(2, { message: 'Brand Information must be at least 2 characters' }),
	logo_image: z.string(),
	cover_image: z.string(),
	manager_id: z.string(),
})

export default function CreateBrand() {
	const { address: walletAddress } = useAccount()
	const [contractAddress, setContractAddress] = useState<`0x${string}` | undefined>()


	const [error, setError] = useState<string | null>(null)
	const [isDeployed, setIsDeployed] = useState(false)
	const chainId = useChainId()
	const { data: walletClient } = useWalletClient({ chainId })
	const publicClient = createPublicClient({
		chain: baseSepolia,
		transport: http(),
	})

	async function verifyContract(
		contractAddress: string,
		contractSourceCode: string,
		contractName: string,
		compilerVersion: string,
		constructorArguments: string,
		licenseType: string
	): Promise<boolean> {
		const apiKey = '7CU2HZAY6VD1CIG7C5DD8N4TKWZ7JJ7SVT'

		const params = new URLSearchParams()
		params.append('apikey', apiKey)
		params.append('module', 'contract')
		params.append('action', 'verifysourcecode')
		params.append('contractaddress', contractAddress)
		params.append('sourceCode', contractSourceCode)
		params.append('codeformat', 'solidity-single-file')
		params.append('contractname', contractName)
		params.append('compilerversion', compilerVersion)
		params.append('optimizationUsed', '0') // Change to '1' if optimization was used
		params.append('runs', '200') // Change to the number of runs if optimization was used
		params.append('constructorArguments', constructorArguments),
		params.append('licenseType', licenseType)

		try {
			const response = await axios.post(
				'https://api-sepolia.basescan.org/api',
				params.toString()
			)
			console.log(apiKey)
			console.log(contractAddress)
			console.log(contractSourceCode)
			console.log(contractName)
			console.log(compilerVersion)
			if (response.data.status === '1') {
				console.log('Contract verified successfully')
				console.log('Verification response:', response)
				console.log('Verification Guid:', response.data.result)
				return true;
			} else {
				console.log('Failed to verify contract:', response.data.result)
				return false;
			}
		} catch (error) {
			console.error('Error verifying contract:', error)
			return false;
		}
	}

	const deployContract = async () => {
		if (!walletClient) {
			throw new Error('Wallet client not available')
		}

		try {
			const hash = await walletClient.deployContract({
				abi: Simplestore.abi,
				bytecode: Simplestore.bytecode as Hex,
				account: walletAddress,
			})

			if (!hash) {
				throw new Error('Failed to execute deploy contract transaction')
			}

			const txn = await publicClient.waitForTransactionReceipt({ hash })
			setContractAddress(txn.contractAddress as `0x${string}`)
			setIsDeployed(true)

			return txn.contractAddress
		} catch (error) {
			console.error('Deployment error:', error)
			setError('Error deploying contract: ' + error)
		}
	};

	const handleDeploy = async (): Promise<boolean> => {
		try {
			const address = await deployContract();
			console.log('Contract deployed at:', address);
			return address !== null;
		} catch (error) {
			console.error('Error deploying contract:', error);
			setError('Error deploying contract: ' + error);
			return false;
		}
	};

	const handleVerify = async (): Promise<boolean> => {
		if (!contractAddress) {
			setError('No contract address found to verify.')
			return false;
		}
		const contractSourceCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
// Private state variable to store a number
uint256 private number;

// Setter function to set the value of the number
function setNumber(uint256 _number) public {
	number = _number;
}

// Getter function to get the value of the number
function getNumber() public view returns (uint256) {
	return number;
}
}`;
		try {
			const success = verifyContract(
				contractAddress as string,
				contractSourceCode,
				'SimpleStorage', // Contract name
				'v0.8.26+commit.8a97fa7a', // Compiler version
				'',
				'MIT'
			);
			return success;
		} catch (error) {
			setError('Error verifying contract: ' + error)
			console.error('Error verifying contract:', error)
			return false;
		}
	}


	const apiUrl = process.env.NEXT_PUBLIC_URI;

	const account = useAccount()
	const router = useRouter()
	const [imageUrl, setImageUrl] = useState<string>('')
	const [coverImageUrl, setCoverImageUrl] = useState<string>('')
	const [preview, setPreview] = useState<boolean>(false)
	const [previewCover, setCoverPreview] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			representative: '',
			contact_email: '',
			contact_phone: '',
			shipping_address: '',
			additional_info: '',
			logo_image: '',
			cover_image: '',
			manager_id: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!account.addresses) {
			toast.warning('Connect your wallet', {
				position: 'top-left',
			})
		} else {
			if (!imageUrl) {
				setImageError(true)
			}

			try {
				values.logo_image = imageUrl
				values.cover_image = coverImageUrl
				values.manager_id = account.address!
				localStorage.setItem('brand_name', values.name)
				console.log(values)

				if (imageUrl !== '') {
					setLoading(true)
					// const res = await fetch(`${apiUrl}/users/all`)

					// if (!res.ok) {
					// 	throw new Error('Network response was not ok');
					// }

					// const result = await res.json();
					// console.log(result);

					// const addressExists = result.some((user: { wallet_address: string | undefined }) => user.wallet_address === account.address);

					// if (!addressExists) {
					const brandId = uuidv4()
					const response = await fetch(`${apiUrl}/brands`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: brandId,
							name: values.name,
							description: values.description,
							logo_image: values.logo_image,
							cover_image: values.cover_image,
							representative: values.representative,
							contact_email: values.contact_email,
							contact_phone: values.contact_phone,
							shipping_address: values.shipping_address,
							additional_info: values.additional_info,
							manager_id: values.manager_id,
						}),
					})
					const brand = await response.json();
					console.log(brand)
					localStorage.setItem("BrandId", brand.id);
					if (response.status === 200) {
						toast.warning('Now we are deploying AccessMaster to manage out brand', {
							position: 'top-left',
						})
						const deploySuccess = await handleDeploy();
						if (deploySuccess) {
							// const verifySuccess = await handleVerify();
							// if (verifySuccess) {
							toast.warning('Now we will deploy TradeHub ', {
								position: 'top-left',
							})
							const deployTradeHub = await handleDeploy();
							if(deployTradeHub){
							toast.success('Deploy Successful', {
								position: 'top-left',
							})
							const users = await fetch(`${apiUrl}/users`,
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									}, body: JSON.stringify({
										id: brandId,
										wallet_address: account.address,
									}),
								})
							console.log(users);
							toast.success('Your Brand has been created', {
								position: 'top-left',
							})
							router.push(`/congratulations?bramd_name=${values.name}`);
							// }
							}
						}
					}
					// }else{
					// toast.warning('With one address only one Brand can be created')
					// }

				} else if (!imageError && imageUrl === '') {
					toast.warning('Wait for your image to finish upload', {
						position: 'top-left',
					})
				}
			} catch (error) {
				console.log(error)
				toast.warning('Failed to create Brand', {
					position: 'top-left',
				})
				setLoading(false)
			}
		}
	}

	useEffect(() => {
		if (imageUrl) {
			setPreview(true)
		}

		if (coverImageUrl) {
			setCoverPreview(true)
		}


		return () => {
			setPreview(false)
		}
	}, [imageUrl, coverImageUrl])

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

	async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		try {
			setLoading(true)
			const blobDataImage = new Blob([e.target.files![0]])
			const metaHash = await client.storeBlob(blobDataImage)
			setCoverImageUrl(`ipfs://${metaHash}`)
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
						Create your brand
					</h1>
					<p>Fill out the details for creating your brand</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='py-4 px-32 flex flex-col gap-12'>
							<FormField
								control={form.control}
								name='name'
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
										<p className='text-red-700'>You have to upload a logo</p>
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
							<div className='flex gap-12'>
								<div>
									<h3 className='text-2xl'>Upload Cover Image*</h3>
									<div className='border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6'>
										<UploadIcon />
										<p>Drag file here to upload. Choose file </p>
										<p>Recommeded size 1920 x 1080 px</p>
										<div>
											<label
												htmlFor='uploadCover'
												className='flex flex-row items-center ml-12 cursor-pointer mt-4'
											>
												<input
													id='uploadCover'
													type='file'
													className='hidden'
													onChange={uploadCover}
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
										<p className='text-red-700'>You have to upload a Image</p>
									)}
								</div>
								<div>
									<h3 className='text-2xl'>Preview</h3>
									{previewCover ? (
										<img
											// src={imageUrl}
											src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
												coverImageUrl
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
								name='representative'
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
								name='contact_email'
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
								name='contact_phone'
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
								name='shipping_address'
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
								name='additional_info'
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
