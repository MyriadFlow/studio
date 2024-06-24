'use client'
import { useState, useEffect } from 'react'
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

// const contractAddress = '0xcA1DE631D9Cb2e64C863BF50b83D18249dFb7054'

export default function Home() {
	const { address: walletAddress } = useAccount()

	const [contractAddress, setContractAddress] = useState<
		`0x${string}` | undefined
	>()
	const [error, setError] = useState<string | null>(null)
	const [isDeployed, setIsDeployed] = useState(false)

	const publicClient = createPublicClient({
		chain: baseSepolia,
		transport: http(),
	})

	const chainId = useChainId()
	const { data: walletClient } = useWalletClient({ chainId })

	async function verifyContract(
		contractAddress: string,
		contractSourceCode: string,
		contractName: string,
		compilerVersion: string,
		constructorArguments: string
	) {
		const apiKey = 'RBNWT988E1EQS41KEP1P4GIHP279Y1TU7I'

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
		params.append('constructorArguments', constructorArguments)

		try {
			const response = await axios.post(
				'https://api-sepolia.etherscan.io/api',
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
			} else {
				console.log('Failed to verify contract:', response.data.result)
			}
		} catch (error) {
			console.error('Error verifying contract:', error)
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
				throw new Error('failed to execeute deploy contract transactiopn')
			}

			const txn = await publicClient.waitForTransactionReceipt({ hash })
			setContractAddress(txn.contractAddress as `0x${string}`)
			setIsDeployed(true)

			return txn.contractAddress
		} catch (error) {
			console.error('Deployment error:', error)
			setError('Error deploying contract: ' + error)
		}
	}

	const handleDeploy = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault()
		try {
			const address = await deployContract()
			console.log('Contract deployed at:', address)
		} catch (error) {
			console.error('Error deploying contract:', error)
			setError('Error deploying contract: ' + error)
		}
	}

	const handleVerify = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault()
		if (!contractAddress) {
			setError('No contract address found to verify.')
			return
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
}`
		try {
			await verifyContract(
				contractAddress as string,
				contractSourceCode,
				'SimpleStorage', // Contract name
				'v0.8.0+commit.c7dfd78e', // Compiler version
				''
			)
		} catch (error) {
			setError('Error verifying contract: ' + error)
			console.error('Error verifying contract:', error)
		}
	}

	return (
		<>
			<Navbar />
			<main className='h-screen flex-col flex text-black text-center gap-12 justify-center relative'>
				<Image
					src='/images/blob-3.png'
					alt='blob'
					height={350}
					width={350}
					className='absolute top-0 right-0'
				/>
				<div>
					<h1 className='text-6xl font-bold mb-6 uppercase'>
						Myriadflow studio
					</h1>
					<h2 className='text-2xl '>
						<span className='inline-block'>
							Welcome to MyriadFlow Studio, your one-stop shop
						</span>
						<span>for creating groundbreaking phygital NFTs!</span>
					</h2>
				</div>
				<div className=' flex flex-col gap-14 justify-center items-center'>
					<p>
						You have not created any brands yet. Ready to start your journey?
					</p>
					<Link href='/create-brand'>
						<Button className='bg-[#30D8FF] rounded-full text-black'>
							Create Brand
						</Button>
					</Link>
				</div>
				<Button onClick={handleDeploy}>deploy Contract</Button>
				{isDeployed && (
					<button
						className='p-2 px-6 bg-white text-black rounded-full mt-10 text-2xl'
						onClick={handleVerify}
					>
						Verify
					</button>
				)}
				{contractAddress && (
					<p className='text-white mt-4'>Contract Address: {contractAddress}</p>
				)}
				{error && <p className='text-red-500 mt-4'>{error}</p>}
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
			</main>
		</>
	)
}
