"use client";
import { useEffect, useState } from 'react';
import { Button, Navbar } from '@/components';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function Home() {
    const { address } = useAccount();
    const [hasAddress, setHasAddress] = useState(false);

    useEffect(() => {
        if (address) {
            setHasAddress(true);
        } else {
            setHasAddress(false);
        }
    }, [address]);

    return (
        <>
            <Navbar />
            <main className='h-screen flex-col flex text-black text-center gap-12 relative'>
                <Image
                    src='/images/blob-3.png'
                    alt='blob'
                    height={350}
                    width={350}
                    className='absolute top-0 right-0'
                />
                {hasAddress ? (
                    <div className='flex flex-row gap-6 p-8 items-center'>
                        <div className='bg-white shadow-lg rounded-lg p-6 w-64 '>
                            <Image
                                src='/images/preview.png'
                                alt='Example'
                                height={150}
                                width={150}
                                className='mb-4'
                            />
                            <h3 className='text-xl font-bold'>Brand Name</h3>
                            <p className='text-gray-700'>This is an Brand description.</p>
                        </div>
						<div className='bg-white shadow-lg rounded-lg p-6 w-64 '>
                            <Image
                                src='/images/preview.png'
                                alt='Example'
                                height={150}
                                width={150}
                                className='mb-4'
                            />
                            <h3 className='text-xl font-bold'>Brand Name</h3>
                            <p className='text-gray-700'>This is an Brand description.</p>
                        </div>
						<div className='bg-white shadow-lg rounded-lg p-6 w-64 '>
                            <Image
                                src='/images/preview.png'
                                alt='Example'
                                height={150}
                                width={150}
                                className='mb-4'
                            />
                            <h3 className='text-xl font-bold'>Brand Name</h3>
                            <p className='text-gray-700'>This is an Brand description.</p>
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
                            <Link href='/create-brand'>
                                <Button className='bg-[#30D8FF] rounded-full text-black'>
                                    Create Brand
                                </Button>
                            </Link>
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
            </main>
        </>
    );
}
