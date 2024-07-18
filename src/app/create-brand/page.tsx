'use client'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
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
import tradehub from "@/lib/tradehub.json"
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
    access_master: z.string(),
    trade_hub: z.string(),
    payout_address: z.string(),
    chain_id: z.string(),
    chaintype_id:z.string(),
})

export default function CreateBrand() {
    const { address: walletAddress } = useAccount()


    const [error, setError] = useState<string | null>(null)
    const [isDeployed, setIsDeployed] = useState(false)
    const chainId = useChainId()
    const { data: walletClient } = useWalletClient({ chainId })
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
    })

    const [file, setFile] = useState<File | null>(null);
    const [cid, setCid] = useState("");
    const [cidCover, setCidCover] = useState("");
    const [uploading, setUploading] = useState(false);

    const inputFile = useRef(null);
    const uploadFile = async (fileToUpload: string | Blob) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.set("file", fileToUpload);
            const res = await fetch("/api/files", {
                method: "POST",
                body: data,
            });
            const resData = await res.json();
            setCid(resData.IpfsHash);
            toast.success('Upload Completed!', {
				position: 'top-left',
			})
            console.log(resData.IpfsHash);
            setUploading(false);
        } catch (e) {
            console.log(e);
            setUploading(false);
            alert("Trouble uploading file");
        }
    };
    const uploadCoverFile = async (fileToUpload: string | Blob) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.set("file", fileToUpload);
            const res = await fetch("/api/files", {
                method: "POST",
                body: data,
            });
            const resData = await res.json();
            setCidCover(resData.IpfsHash);
            toast.success('Upload Completed!', {
				position: 'top-left',
			})
            console.log(resData.IpfsHash);
            setUploading(false);
        } catch (e) {
            console.log(e);
            setUploading(false);
            alert("Trouble uploading file");
        }
    };

    const deployContract = async () => {
        if (!walletClient) {
            throw new Error('Wallet client not available')
        }

        try {
            const hash = await walletClient.deployContract({
                abi: Simplestore.abi,
                bytecode: Simplestore.bytecode as Hex,
                account: walletAddress,
                args: ['0xf5d0A178a61A2543c98FC4a73E3e78a097DBD9EE']
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


    const deployTradehubContract = async (
        platformFee: number,
        memory_name: string,
    ) => {
        if (!walletClient) {
            throw new Error('Wallet client not available')
        }
        const AccessMasterAddress = localStorage.getItem("AccessMasterAddress");
        try {
            const hash = await walletClient.deployContract({
                abi: tradehub.abi,
                bytecode: tradehub.bytecode as Hex,
                account: walletAddress,
                args: [platformFee, memory_name, `${AccessMasterAddress}`]
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
    const handleDeploy = async (): Promise<boolean> => {
        try {
            const address = await deployContract();
            localStorage.setItem("AccessMasterAddress", address as `0x${string}`)
            console.log('Contract deployed at:', address);
            return address !== null;
        } catch (error) {
            console.error('Error deploying contract:', error);
            setError('Error deploying contract: ' + error);
            return false;
        }
    };

    const TradehubDeploy = async (): Promise<boolean> => {
        try {
            const address = await deployTradehubContract(30, 'NFT BAZAAR');
            localStorage.setItem("TradehubAddress", address as `0x${string}`)
            console.log('Contract deployed at:', address);
            return address !== null;
        } catch (error) {
            console.error('Error deploying contract:', error);
            setError('Error deploying contract: ' + error);
            return false;
        }
    };

    const apiUrl = process.env.NEXT_PUBLIC_URI;

    const account = useAccount()
    const router = useRouter()
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
            access_master: '',
            trade_hub: '',
            payout_address: '',
            chain_id: '',
            chaintype_id: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!account.addresses) {
            toast.warning('Connect your wallet', {
                position: 'top-left',
            })
        } else {
            if (!cid) {
                setImageError(true)
            }

            try {
                values.logo_image = "ipfs://" + cid
                values.cover_image = "ipfs://" + cidCover                             
                values.manager_id = account.address!
                localStorage.setItem('brand_name', values.name)
                console.log(values)

                if (cid !== '') {
                    setLoading(true)
                    // const res = await fetch(`${apiUrl}/users/all`)

                    // if (!res.ok) {
                    // 	throw new Error('Network response was not ok');
                    // }

                    // const result = await res.json();
                    // console.log(result);

                    // const addressExists = result.some((user: { wallet_address: string | undefined }) => user.wallet_address === account.address);

                    // if (!addressExists) {
                    toast.warning('Now we are deploying AccessMaster to manage out brand', {
                        position: 'top-left',
                    })
                    const deploySuccess = await handleDeploy();
                    if (deploySuccess) {
                        const AccessMasterAddress = localStorage.getItem("AccessMasterAddress");
                        console.log('Contract deployed at:', AccessMasterAddress);
                        toast.warning('Now we will deploy TradeHub ', {
                            position: 'top-left',
                        })
                        const deployTradeHub = await TradehubDeploy();
                        if (deployTradeHub) {
                            const TradehubAddress = localStorage.getItem("TradehubAddress");
                            console.log('Contract deployed at:', TradehubAddress)
                            toast.success('Deploy Successful', {
                                position: 'top-left',
                            })
                            const brandId = uuidv4()
                            const chaintype = localStorage.getItem("BaseSepoliaChain");
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
                                    access_master: AccessMasterAddress,
                                    trade_hub: TradehubAddress,
                                    payout_address: account.address,
                                    chain_id: "84532",
                                    chaintype_id: chaintype
                                }),
                            })
                            const brand = await response.json();
                            console.log(brand)
                            localStorage.setItem("BrandId", brand.id);
                            if (response.status === 200) {
                                const users = await fetch(`${apiUrl}/users`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }, body: JSON.stringify({
                                            id: brandId,
                                            wallet_address: account.address,
						                    chaintype_id: chaintype,
                                        }),
                                    })
                                console.log(users);
                                toast.success('Your Brand has been created', {
                                    position: 'top-left',
                                })
                                router.push(`/congratulations?bramd_name=${values.name}`);
                            }
                        }
                    }
                    // }else{
                    // toast.warning('With one address only one Brand can be created')
                    // }

                } else if (!imageError && cid === '') {
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

    const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            uploadFile(files[0]);
        }
    };

    const uploadCover = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            uploadCoverFile(files[0]);
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
                                                    ref={inputFile}
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
                                    {cid ? (
                                        <img
                                            // src={cid}
                                            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
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
                                                    ref={inputFile}
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
                                    {cidCover ? (
                                        <img
                                            // src={cid}
                                            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cidCover}`}
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
