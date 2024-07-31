'use client'
import { Button, Input, Label, Navbar, Textarea } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar } from '@readyplayerme/visage'
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify'
import { createPublicClient, http, Hex } from 'viem'
import { baseSepolia } from 'viem/chains'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import phygital from "@/lib/phygital.json"
import { useRouter } from 'next/navigation'

export default function Review() {
	const router = useRouter()
	const [activeButton, setActiveButton] = useState('phygital')
	const [isEditing, setIsEditing] = useState(false)
	const [editableData, setEditableData] = useState({ name: '', description: '', price: '', quantity: '', royality: '', product_info: '', image: '', category: [] })
	const [editableDetailsData, setEditableDetailsData] = useState({ color: '', size: '', weight: '', usage: '', material: '', quality: '', manufacturer: '', origin_country: '' })
	const [editableWebxrData, setEditableWebxrData] = useState({ customizations: [], gold_reward: '', silver_reward: '', bronze_reward: '', image360: '', free_nft_image: '' , avatar_voice:'' })


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

	const { address: walletAddress } = useAccount()
	const [error, setError] = useState<string | null>(null)
	const [isDeployed, setIsDeployed] = useState(false)
	const chainId = useChainId()
	const { data: walletClient } = useWalletClient({ chainId })
	const publicClient = createPublicClient({
		chain: baseSepolia,
		transport: http(),
	})

	const getPhygital = async () => {
		const res = await fetch(`${apiUrl}/phygitals/all`)

		const result = await res.json()
		console.log(result)
	}

	useEffect(() => {
		getPhygital()
		setEditableData(parsedData)
		setEditableDetailsData(parsedDetailsData)
		setEditableWebxrData(parsedWebxrData)
	}, [])

	const handleEditClick = () => {
		if (isEditing) {
			localStorage.setItem('phygitalData', JSON.stringify(editableData))
			localStorage.setItem('phygitalDetailsData', JSON.stringify(editableDetailsData))
			localStorage.setItem('webxrData', JSON.stringify(editableWebxrData))
		}
		setIsEditing(!isEditing)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, field: string) => {
		const value = event.target.value
		if (section === 'phygital') {
			setEditableData({ ...editableData, [field]: value })
		} else if (section === 'details') {
			setEditableDetailsData({ ...editableDetailsData, [field]: value })
		} else if (section === 'webxr') {
			setEditableWebxrData({ ...editableWebxrData, [field]: value })
		}
	}

	const deployContract = async (
		name: string,
		symbol: string,
		contractDetails: (string | number)[],
		baseUri: string
	) => {
		if (!walletClient) {
			throw new Error('Wallet client not available')
		}
		const AccessMasterAddress = localStorage.getItem("AccessMasterAddress");
		const TradehubAddress = localStorage.getItem("TradehubAddress");
		console.log("access", AccessMasterAddress)
		console.log("trade", TradehubAddress)
		try {
			const hash = await walletClient.deployContract({
				abi: phygital.abi,
				bytecode: phygital.bytecode as Hex,
				account: walletAddress,
				args: [name, symbol, `${TradehubAddress}`, `${AccessMasterAddress}`, '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', contractDetails, baseUri]
			})

			if (!hash) {
				throw new Error('Failed to execute deploy contract transaction')
			}

			const txn = await publicClient.waitForTransactionReceipt({ hash })
			setIsDeployed(true)

			return txn.contractAddress
		} catch (error) {
			console.error('Deployment error:', error)
			setError('Error deploying contract: ' + error)
		}
	};
	const PhygitalDeploy = async (): Promise<boolean> => {
		try {
			const contractDetailsString = ["10000000000000000", 100, 300, 6];
			const contractDetails = contractDetailsString.map((item, index) => {
				if (index === 0) {
					return item; // Keep the first element as a string
				} else {
					const num = Number(item);
					return isNaN(num) ? item : num;
				}
			});

			console.log(contractDetails);

			const address = await deployContract(`${editableData.name}`, "AC", contractDetails, "www.baseuri.com");
			localStorage.setItem("PhygitalAddress", address as `0x${string}`)
			console.log('Contract deployed at:', address);
			return address !== null;
		} catch (error) {
			console.error('Error deploying contract:', error);
			setError('Error deploying contract: ' + error);
			return false;
		}
	};
	const sendPostRequests = async () => {
		try {
			// Post request for Phygital data
			const phygitalId = uuidv4()
			const CollectionId = localStorage.getItem("CollectionId")
			// const walletAddress = localStorage.getItem("walletAddress")
			const chaintype = localStorage.getItem("BaseSepoliaChain");
			const productUrl = localStorage.getItem("producturl")
			const brand_name = localStorage.getItem('brand_name')
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
					name: editableData.name,
					brand_name: brand_name,
					category: { data: editableData.category },
					description: editableData.description,
					price: parseFloat(editableData.price),
					quantity: parseInt(editableData.quantity),
					royality: parseInt(editableData.royality),
					product_info: editableData.product_info,
					image: editableData.image,
					chaintype_id: chaintype
				}),
			})
			const phygital = await response.json();
			localStorage.setItem("PhygitalId", phygital.id);


			// Post request for Phygital Details data
			toast.warning('Now we are deploying phygital to launch your nft collection', {
				position: 'top-left',
			})
			const deploySuccess = await PhygitalDeploy();
			if (deploySuccess) {
				const phygitalId = localStorage.getItem("PhygitalId");
				const CollectionId = localStorage.getItem("CollectionId")
				const PhygitalAddress = localStorage.getItem("PhygitalAddress")
				const phygitalResponse = await fetch(`${apiUrl}/phygitals/${phygitalId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						collection_id: CollectionId,
						color: editableDetailsData.color,
						size: editableDetailsData.size,
						weight: parseFloat(editableDetailsData.weight),
						material: editableDetailsData.material,
						usage: editableDetailsData.usage,
						quality: editableDetailsData.quality,
						manufacturer: editableDetailsData.manufacturer,
						origin_country: editableDetailsData.origin_country,
						name: editableData.name,
						brand_name: brand_name,
						category: { data: editableData.category },
						description: editableData.description,
						price: parseFloat(editableData.price),
						quantity: parseInt(editableData.quantity),
						royality: parseInt(editableData.royality),
						product_info: editableData.product_info,
						image: editableData.image,
						contract_address: PhygitalAddress,
					}),
				})

				toast.success('Deploy Successful', {
					position: 'top-left',
				})
			} else {
				toast.warning('Failed to create phygital data', {
					position: 'top-left',
				})
			}


			// Post request for varient data
			const phygitalid = localStorage.getItem("PhygitalId");
			const variantDataString = localStorage.getItem("variantData");
			const storedVariantData = variantDataString ? JSON.parse(variantDataString) : [];
			const description = storedVariantData.map((item: { description: string }) => item.description).join(', ');
			const variant = storedVariantData.map((item: { variant: string }) => item.variant).join(', ');
			const variantId = uuidv4()
			await fetch(`${apiUrl}/variants`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: variantId,
					phygital_id: phygitalid,
					chaintype_id: chaintype,
					variant: variant,
					description: description
				}),
			})


			// Post request for WebXR data
			const brandId = uuidv4()
			const getPhy = () => {
				if (typeof window !== 'undefined' && localStorage) {
					return localStorage.getItem('phygitalData')
				}
			}
			const getPhygitalId = () => {
				if (typeof window !== 'undefined' && localStorage) {
					return localStorage.getItem('PhygitalId')
				}
			}
			const phygitals = getPhy() ?? '{}'
			const phygitalName = JSON.parse(phygitals).phygitalName
			const PhygitalId = getPhygitalId() ?? '{}'
			const webxr = await fetch(`${apiUrl}/webxr`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: brandId,
					phygitalName,
					phygital_id: PhygitalId,
					image360: editableWebxrData.image360,
					free_nft_image: editableWebxrData.free_nft_image,
					gold_reward: editableWebxrData.gold_reward,
					silver_reward: editableWebxrData.silver_reward,
					bronze_reward: editableWebxrData.bronze_reward,
					chaintype_id: chaintype,
					customizations: { data: editableWebxrData.customizations },
					
				}),
			})

			// const walletAddress = localStorage.getItem("walletAddress");
			const getAvatar = () => {
				if (typeof window !== 'undefined' && localStorage) {
					return localStorage.getItem('avatar')
				}
			}
			const storedData = getAvatar() ?? '{}'
			const parsedData = JSON.parse(storedData)
			await fetch(`${apiUrl}/avatars`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: brandId,
					phygital_id: PhygitalId,
					user_id: walletAddress,
					chaintype_id: chaintype,
					avatar_voice : editableWebxrData.avatar_voice,
					...parsedData,
				}),
			})

			if (webxr.status === 200) {
				router.push('/launch-congratulation')
			}
		} catch (error) {
			console.error('Error sending data:', error)
			alert('Error sending data. Please try again.')
		}
	}

	return (
		<>
			<Navbar />
			<ToastContainer />
			<main className='min-h-screen p-20 flex flex-col gap-12 text-black mx-20'>
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
							<p className='text-xl mt-8'>Chain: Base network</p>
						</div>
						<div className='flex gap-8'>
							<div>
								<div className='mt-6'>
									<Label className='text-xl mb-6'>Phygital name </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded w-96'
										value={editableData.name}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'phygital', 'name')}
									/>
								</div>
								<div className='mt-6'>
									<Label className='text-xl mb-6'>Description</Label>
									<Textarea
										className='border-0 bg-[#0000001A] rounded w-96 h-56'
										value={editableData.description}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'phygital', 'description')}
									/>
								</div>
							</div>
							<div className='border border-black p-8 w-2/6 h-2/3 ml-40'>
								<img
									src={`https://nftstorage.link/${parsedData.image.replace('ipfs://', 'ipfs/')}`}
									alt='preview'
									height={400}
									width={400}
								/>
							</div>
						</div>
						<div className='mt-6'>
							<h2>Category</h2>
							<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12'>
								{editableData.category?.map((category: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
									<Button key={index} className='bg-white rounded-full text-black'>
										{category}
									</Button>
								))}
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div className='mt-6'>
								<Label className='text-xl mb-6'>Price*</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={editableData.price}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'phygital', 'price')}
									/>
									<span>ETH</span>
								</div>
							</div>
							<div className='mt-6'>
								<Label className='text-xl mb-6'>Quantity*</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={editableData.quantity}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'phygital', 'quantity')}
									/>
									<span>items</span>
								</div>
							</div>
							<div className='mt-6'>
								<Label className='text-xl mb-6'>Royalty</Label>
								<div className='flex gap-2'>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={editableData.royality}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'phygital', 'royality')}
									/>
									<span>%</span>
								</div>
							</div>
						</div>
						<div className='mt-6'>
							<h2 className='text-2xl'>Product Information for AI</h2>
							<Textarea
								className='border-0 bg-[#0000001A] rounded'
								value={editableData.product_info}
								readOnly={!isEditing}
								onChange={(e) => handleInputChange(e, 'phygital', 'product_info')}
							/>
						</div>
						<div className='flex mt-6'>
							<Button className='text-black bg-[#30D8FF] rounded-lg ' onClick={handleEditClick}>
								{isEditing ? 'Save' : 'Edit'}
							</Button>
							<Button className='text-black bg-[#30D8FF] rounded-lg ml-8' onClick={() => handleButtonClick('phygital-details')}>
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
									value={editableDetailsData.color}
									readOnly={!isEditing}
									onChange={(e) => handleInputChange(e, 'details', 'color')}
								/>
							</div>
							<div className='flex gap-8'>
								<div className='basis-[70%]'>
									<Label className='text-xl mb-6'>Size* </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded'
										value={editableDetailsData.size}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'details', 'size')}
									/>
								</div>
								<div className='basis-[30%]'>
									<Label className='text-xl mb-6'>Weight*</Label>
									<div className='flex gap-2'>
										<Input
											className='border-0 bg-[#0000001A] rounded'
											value={editableDetailsData.weight}
											readOnly={!isEditing}
											onChange={(e) => handleInputChange(e, 'details', 'weight')}
										/>
										<span>Kg</span>
									</div>
								</div>
							</div>
							<div>
								<Label className='text-xl mb-6'>Usage</Label>
								<Input
									className='border-0 bg-[#0000001A] rounded w-2/5'
									value={editableDetailsData.usage}
									readOnly={!isEditing}
									onChange={(e) => handleInputChange(e, 'details', 'usage')}
								/>
							</div>
							<div>
								<Label className='text-xl mb-6'>Material</Label>
								<Input
									className='border-0 bg-[#0000001A] rounded w-2/5'
									value={editableDetailsData.material}
									readOnly={!isEditing}
									onChange={(e) => handleInputChange(e, 'details', 'material')}
								/>
							</div>
							<div>
								<Label className='text-xl mb-6'>Unique qualities</Label>
								<Textarea
									className='border-0 bg-[#0000001A] rounded'
									value={editableDetailsData.quality}
									readOnly={!isEditing}
									onChange={(e) => handleInputChange(e, 'details', 'quality')}
								/>
							</div>
							<div className='flex justify-between '>
								<div>
									<Label className='text-xl mb-6'>Manufacturer </Label>
									<Input
										className='border-0 bg-[#0000001A] rounded w-full'
										value={editableDetailsData.manufacturer}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'details', 'manufacturer')}
									/>
								</div>
								<div>
									<Label className='text-xl mb-6'>Made in</Label>
									<Input
										className='border-0 bg-[#0000001A] rounded w-full'
										value={editableDetailsData.origin_country}
										readOnly={!isEditing}
										onChange={(e) => handleInputChange(e, 'details', 'origin_country')}
									/>
								</div>
							</div>
							<div className='flex'>
								<Button className='text-black bg-[#30D8FF] rounded-lg ' onClick={handleEditClick}>
									{isEditing ? 'Save' : 'Edit'}
								</Button>
								<Button className='text-black bg-[#30D8FF] rounded-lg ml-8' onClick={() => handleButtonClick('webxr')}>
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
									<div className='h-80 w-[50%] flex flex-col items-center justify-center bg-[#D9D8D880] border border-black'>
										<img
											src={`https://nftstorage.link/${parsedWebxrData.image360.replace('ipfs://', 'ipfs/')}`}
											alt='preview'
											height={300}
											width={300}
										/>
									</div>
								</div>
							</div>
							<div>
							<h2 className='text-xl capitalize mt-4'>
									Avatar Voice : {parsedWebxrData.avatar_voice}
								</h2>
							</div>
							<div>
								<h2 className='text-xl capitalize'>
									available customization options for the avatars
								</h2>
								<div className='bg-[#0000001A] rounded p-8 flex flex-wrap gap-12 mt-2'>
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
									<div className='mt-6'>
										<Label className='text-xl mb-6'>Gold</Label>
										<div className='flex gap-2'>
											<Input className='border-0 bg-[#0000001A] rounded'
												value={parsedWebxrData.gold_reward}
												readOnly
											/>
											<span>%</span>
										</div>
									</div>
									<div className='mt-6'>
										<Label className='text-xl mb-6'>Silver</Label>
										<div className='flex gap-2'>
											<Input className='border-0 bg-[#0000001A] rounded'
												value={parsedWebxrData.silver_reward}
												readOnly
											/>
											<span>%</span>
										</div>
									</div>
									<div className='mt-6'>
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
								<Button className='text-black bg-[#30D8FF] rounded-lg '
									onClick={sendPostRequests}>
									Launch
								</Button>
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	)
}
