'use client'
import { useSearchParams } from 'next/navigation'
import { Button, Navbar } from '@/components'
import Link from 'next/link'
import { Suspense } from 'react'
import React, { useEffect, useState } from 'react';

export default function Congratulations() {
	const searchParams = useSearchParams()
	const [phygitalName, setPhygitalName] = useState('');

	const brand_name = searchParams.get('brand_name')
	const PhygitalId = localStorage.getItem('PhygitalId');
	const WebxrId = localStorage.getItem('WebxrId');

	useEffect(() => {
		const phygitalmatch = async () => {
			const baseUri = process.env.NEXT_PUBLIC_URI || 'https://app.myriadflow.com';
			try {
				const phyres = await fetch(`${baseUri}/phygitals/all/554b4903-9a06-4031-98f4-48276c427f78`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (!phyres.ok) {
					throw new Error('Failed to fetch data');
				}

				const phyresult = await phyres.json();

				const matchingPhy = phyresult.find((phy: { id: any }) => phy.id === PhygitalId);

				if (matchingPhy) {
					const phygitalName = matchingPhy.name;
					setPhygitalName(phygitalName);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		phygitalmatch();
	}, [])

	return (
		<Suspense>
			<Navbar />
			<main className='h-screen py-12 px-16 flex flex-col gap-8 text-black'>
				<h1 className='text-3xl font-bold'>Congratulations</h1>
				<p>You have successfully launched your phygital
					and WebXR experience! </p>
				<Link href='/create-phygital'>
					<Button className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl'>
						Launch Another Phygital
					</Button>
				</Link>
				<Link href='/create-collection'>
					<Button className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl'>
						Launch Another Collection
					</Button>
				</Link>
				<a href={`https://discover.myriadflow.com/nfts/${phygitalName.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" rel="noopener noreferrer">
					<Button className="w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl">
						View the Phygital
					</Button>
				</a>

				<Link href={`https://webxr.myriadflow.com/${phygitalName.toLowerCase().replace(/\s+/g, '-')}`} target="_blank">
					<Button className='w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl'>
						View On WebXR
					</Button>
				</Link>
			</main>
		</Suspense>
	)
}
