'use client'
import { useState, useEffect, cache } from 'react'
import { Button, Navbar } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { useWriteContract, useWalletClient, useChainId } from 'wagmi'
import { abi } from '../lib/abi' // Adjust the path to your ABI file
import { bytecode } from '../lib/bytecode'
import { createPublicClient, http, Hex } from 'viem'
import { baseSepolia } from 'viem/chains'
import { useAccount } from 'wagmi'
import Phygital from '../lib/phygital.json'
import SimpleStorage from '../lib/SimpleStorage.json'
import Simplestore from '../lib/Simplestore.json'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Footer from '../components/footer'
// const contractAddress = '0xcA1DE631D9Cb2e64C863BF50b83D18249dFb7054'
// const { address } = useAccount();

export default function Home() {
	const { address: walletAddress } = useAccount()
	const [hasAddress, setHasAddress] = useState(false);
	const [contractAddress, setContractAddress] = useState<
		`0x${string}` | undefined
	>()

	const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

	const apiUrl = isDevelopment
		? 'http://localhost:3000' // Local development URL
		: 'https://discover-two.vercel.app' // Production URL

	const [brands, setBrands] = useState([]);
	// const [phygitals, setPhygitals] = useState<any>([]);

	const getBrands = async () => {
		try {
			// const res = await fetch(`${apiUrl}/api/brands`);
			const res = await fetch('http://localhost:3000/brands')
			// const phyres = await fetch(`${apiUrl}/api/phygitals`);
	
			if (!res.ok) {
				throw new Error('Network response was not ok');
			}
			const result = await res.json();
			// const phyresult = await phyres.json();
	
			console.log(result);
			setBrands(result);
			// setPhygitals(phyresult);
		} catch (error) {
			console.error('Failed to fetch brands:', error);
		} finally {
			// Perform any cleanup or closing operations if needed
			console.log('Fetch operation completed');
		}
	}
	useEffect(() => {
		if (walletAddress) {
			localStorage.setItem("walletAddress" , walletAddress);
			setHasAddress(true);
			getBrands()
		} else {
			setHasAddress(false);
		}
	}, [walletAddress]);

	const ifconnected = async () => {
		if (!walletAddress) {
			toast.warning('Connect your wallet')
		}
	}


	return (
		<>
			<main className='flex-col flex text-black text-center gap-12 justify-center relative'>
				<Navbar />
				<ToastContainer />
				<Image
					src='/images/blob-3.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute top-0 right-0'
				/>
				{hasAddress ? (
					<div className='p-8'>
						<div className=''>
							<Link href='/create-brand'>
								<Button className='bg-[#30D8FF] rounded-full text-black'>
									Create Brand
								</Button>
							</Link>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
							{brands.map((brand, index) => (
								<Link href={`/nfts/${brand.id}`}>
								<div key={index} className=' shadow-lg rounded-lg p-6'>
									<img
										src={`https://nftstorage.link/${brand.logo_image.replace('ipfs://', 'ipfs/')}`}
										alt={brand.brand_name}
										className='mb-4'
									/>
									<h3 className='text-xl font-bold'>{brand.brand_name}</h3>
									<p className='text-gray-700'>{brand.description}</p>
								</div>
								</Link>
							))}
						</div>
					</div>
				) : (
					<div className='h-screen flex-col flex text-black text-center gap-12 justify-center relative'>
						<h1 className='text-6xl font-bold mb-6 uppercase'>
							Myriadflow studio
						</h1>
						<h2 className='text-2xl '>
							<span className='inline-block'>
								Welcome to MyriadFlow Studio, your one-stop shop
							</span>
							<span>for creating groundbreaking phygital NFTs!</span>
						</h2>
						<div className=' flex flex-col gap-14 justify-center items-center'>
							<p>
								You have not created any brands yet. Ready to start your journey?
							</p>
							<button className='bg-[#30D8FF] rounded-full text-black p-4' onClick={ifconnected}>
								Start Your Journey
							</button>
						</div>
					</div>
				)}
				<Image
					src='/images/blob-2.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute bottom-18 left-0'
				/>
				<Image
					src='/images/blob-1.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute bottom-0 left-0'
				/>
				<Footer />
			</main>
			
		</>
	)



	
	// <Button onClick={handleDeploy}>Deploy Contract</Button>
	// {
	// 	isDeployed && (
	// 		<button
	// 			className='p-2 px-6 bg-white text-black rounded-full mt-10 text-2xl'
	// 			onClick={handleVerify}
	// 		>
	// 			Verify
	// 		</button>
	// 	)
	// }
	// {
	// 	contractAddress && (
	// 		<p className='text-white mt-4'>Contract Address: {contractAddress}</p>
	// 	)
	// }
	// { error && <p className='text-red-500 mt-4'>{error}</p> }
}
