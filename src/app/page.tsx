'use client'
import { useState, useEffect } from 'react'
import { Button, Navbar } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { toast, ToastContainer } from 'react-toastify'
import Footer from '@/components/footer'

interface Brand {
  id: string; // UUID type
  logo_image: string;
  name: string;
  description: string;
}

export default function Home() {
  const { address: walletAddress } = useAccount()
  const [hasAddress, setHasAddress] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const apiUrl = process.env.NEXT_PUBLIC_URI;

  const getBrands = async () => {
    try {
      const res = await fetch(`${apiUrl}/brands/all`)
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result: Brand[] = await res.json();
      setBrands(result);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
      setHasAddress(true);
      getBrands();
    } else {
      setHasAddress(false);
    }
  }, [walletAddress]);

  const ifConnected = async () => {
    if (!walletAddress) {
      toast.warning('Connect your wallet');
    }
  }

  return (
    <>
      <main className='flex-col flex text-black text-center gap-12 justify-center relative'>
        <Navbar />
        <ToastContainer />
        {/* <Image
          src='/images/blob-3.png'
          alt='blob'
          height={350}
          width={350}
          className='absolute top-0 right-0'
        /> */}
        {hasAddress ? (
          <div className='p-8'>
            <div className='absolute top-0 right-0 mt-32 mr-8'>
              <Link href='/create-brand'>
                <Button className='bg-[#30D8FF] rounded-full text-black'>
                  Create Brand
                </Button>
              </Link>
            </div>
            {brands.length == 0 && (
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
              <div className='flex flex-col gap-14 justify-center items-center'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
              {brands.map((brand) => (
                // <a key={brand.id} href={`/nfts/${brand.id}`}>
                  <div className='shadow-lg rounded-lg p-6' key={brand.id}>
                    <img
                      src={`https://nftstorage.link/${brand.logo_image.replace('ipfs://', 'ipfs/')}`}
                      alt={brand.name}
                      className='mb-4'
                    />
                    <h3 className='text-xl font-bold'>{brand.name}</h3>
                    <p className='text-gray-700'>{brand.description}</p>
                  </div>
                // </a>
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
            <div className='flex flex-col gap-14 justify-center items-center'>
              <p>
                You have not created any brands yet. Ready to start your journey?
              </p>
              <button className='bg-[#30D8FF] rounded-full text-black p-4' onClick={ifConnected}>
                Start Your Journey
              </button>
            </div>
          </div>
        )}
        {/* <Image
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
        /> */}
        <Footer />
      </main>
    </>
  )
}
