"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
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
} from "@/components";
// import { UploadButton } from '@/utils/uploadthing'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { NFTStorage } from "nft.storage";
import { Hex, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import axios from "axios";

import Simplestore from "@/lib/Simplestore.json";
import tradehub from "@/lib/tradehub.json";
import { v4 as uuidv4 } from "uuid";
import Loader from "@/components/ui/Loader";
import { compressImage } from "@/lib/utils";

interface BrandFormProps {
  mode: "create" | "edit";
  initialData?: BrandData | null;
}

export interface BrandData {
  id: string;
  name: string;
  slogan: string;
  description: string;
  representative: string;
  contact_email: string;
  contact_phone: string;
  shipping_address: string;
  additional_info: string;
  website: string;
  twitter: string;
  instagram: string;
  facebook: string;
  additional_link: string;
  link: string;
  discord: string;
  logo_image: string;
  cover_image: string;
  manager_id: string;
  access_master: string;
  trade_hub: string;
  payout_address: string;
  chain_id: string;
  chaintype_id: string;
  elevate_region?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API!;
const client = new NFTStorage({ token: API_KEY });

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Brand name must be at least 2 characters",
    })
    .regex(/^[a-zA-Z0-9\s]*$/, {
      message: "Brand name must only contain letters and numbers",
    }),
  slogan: z.string().min(2, {
    message: "Slogan name must be at least 2 characters",
  }),
  website: z.string(),
  twitter: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  additional_link: z.string(),
  link: z.string(),
  discord: z.string(),
  description: z
    .string()
    .min(2, { message: "Brand description must be at least 2 characters" })
    .max(1000, {
      message: "Brand description should be less than 1000 words",
    }),
  representative: z
    .string()
    .min(2, { message: "Brand Representative must be at least 2 characters" }),
  contact_email: z.string().email().min(2, { message: "Contact email must be a valid email" }),
  contact_phone: z
    .string()
    .min(2, { message: "Contact phone number must be a valid pnone number" }),
  shipping_address: z
    .string()
    .min(2, { message: "Shipping Address must be at least 2 characters" }),
  additional_info: z
    .string()
    .min(2, { message: "Brand Information must be at least 2 characters" }),
  logo_image: z.string(),
  cover_image: z.string(),
  manager_id: z.string(),
  access_master: z.string(),
  trade_hub: z.string(),
  payout_address: z.string(),
  chain_id: z.string(),
  chaintype_id: z.string(),
});

export default function CreateBrand({ mode = "create", initialData = null }: BrandFormProps) {
  const { address: walletAddress } = useAccount();
  const isEdit = mode === "edit";
  console.log(initialData);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem(
        "BaseSepoliaChain",
        "554b4903-9a06-4031-98f4-48276c427f78"
        // '6c736e9b-37e6-43f5-9841-c0ac740282df'
      );
    }
  }, [walletAddress]);

  const [showForm, setShowForm] = useState(false);
  const handleCheckboxChange = () => {
    setShowForm(!showForm);
  };
  const [elevateRegion, setElevateRegion] = useState("");
  const handleSubmit = () => {
    if (!elevateRegion) {
      toast.warning("Product URL is required.");
      return;
    } else {
      localStorage.setItem("elevateRegion", elevateRegion);
      if (elevateRegion === "Africa") {
        localStorage.setItem(
          "BaseSepoliaChain",
          // '554b4903-9a06-4031-98f4-48276c427f78'
          "6c736e9b-37e6-43f5-9841-c0ac740282df"
        );
      } else
        localStorage.setItem(
          "BaseSepoliaChain",
          "554b4903-9a06-4031-98f4-48276c427f78"
          // '6c736e9b-37e6-43f5-9841-c0ac740282df'
        );
    }
  };

  const [error, setError] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [cidCover, setCidCover] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

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
      toast.success("Upload Completed!", {
        position: "top-left",
      });
      // console.log(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };
  const uploadCoverFile = async (fileToUpload: string | Blob) => {
    try {
      setUploadingCover(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCidCover(resData.IpfsHash);
      toast.success("Upload Completed!", {
        position: "top-left",
      });
      console.log(resData.IpfsHash);
      setUploadingCover(false);
    } catch (e) {
      console.log(e);
      setUploadingCover(false);
      alert("Trouble uploading file");
    }
  };

  const deployContract = async () => {
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }

    try {
      const hash = await walletClient.deployContract({
        abi: Simplestore.abi,
        bytecode: Simplestore.bytecode as Hex,
        account: walletAddress,
        args: ["0xf5d0A178a61A2543c98FC4a73E3e78a097DBD9EE"],
      });

      if (!hash) {
        throw new Error("Failed to execute deploy contract transaction");
      }

      const txn = await publicClient.waitForTransactionReceipt({ hash });

      setIsDeployed(true);

      return txn.contractAddress;
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Error deploying AccessMaster contract: " + error, {
        position: "top-left",
      });
      throw error;
    }
  };

  const deployTradehubContract = async (platformFee: number, memory_name: string) => {
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    const AccessMasterAddress = localStorage.getItem("AccessMasterAddress");
    try {
      const hash = await walletClient.deployContract({
        abi: tradehub.abi,
        bytecode: tradehub.bytecode as Hex,
        account: walletAddress,
        args: [platformFee, memory_name, `${AccessMasterAddress}`],
      });

      if (!hash) {
        throw new Error("Failed to execute deploy contract transaction");
      }

      const txn = await publicClient.waitForTransactionReceipt({ hash });

      setIsDeployed(true);

      return txn.contractAddress;
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Error deploying TradeHub contract: " + error, {
        position: "top-left",
      });
      throw error;
    }
  };
  const handleDeploy = async (): Promise<boolean> => {
    try {
      const address = await deployContract();
      localStorage.setItem("AccessMasterAddress", address as `0x${string}`);
      console.log("Contract deployed at:", address);
      return address !== null;
    } catch (error) {
      console.error("Error deploying AccessMaster contract:", error);
      toast.error("Failed to deploy AccessMaster contract", {
        position: "top-left",
      });
      return false;
    }
  };

  const TradehubDeploy = async (): Promise<boolean> => {
    try {
      const address = await deployTradehubContract(30, "NFT BAZAAR");
      localStorage.setItem("TradehubAddress", address as `0x${string}`);
      console.log("TradeHub Contract deployed at:", address);
      return address !== null;
    } catch (error) {
      console.error("Error deploying TradeHub contract:", error);
      toast.error("Failed to deploy TradeHub contract", {
        position: "top-left",
      });
      return false;
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_URI;

  const account = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slogan: "",
      description: "",
      representative: "",
      contact_email: "",
      contact_phone: "",
      shipping_address: "",
      additional_info: "",
      website: "",
      twitter: "",
      instagram: "",
      facebook: "",
      additional_link: "",
      link: "",
      discord: "",
      logo_image: "",
      cover_image: "",
      manager_id: "",
      access_master: "",
      trade_hub: "",
      payout_address: "",
      chain_id: "",
      chaintype_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!account.addresses) {
      toast.warning("Connect your wallet", {
        position: "top-left",
      });
      return;
    }

    if (!isEdit && !cid) {
      setImageError(true);
      return;
    }

    try {
      if (cid) {
        values.logo_image = "ipfs://" + cid;
      } else if (isEdit && initialData?.logo_image) {
        // Convert back from https://nftstorage.link/ipfs/... to ipfs://...
        values.logo_image = "ipfs://" + initialData.logo_image.split("/ipfs/")[1];
      }

      if (cidCover) {
        values.cover_image = "ipfs://" + cidCover;
      } else if (isEdit && initialData?.cover_image) {
        // Convert back from https://nftstorage.link/ipfs/... to ipfs://...
        values.cover_image = "ipfs://" + initialData.cover_image.split("/ipfs/")[1];
      }

      values.manager_id = account.address!;
      localStorage.setItem("brand_name", values.name);

      if (isEdit && initialData) {
        // Handle edit mode
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/brands/${initialData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              elevate_region: elevateRegion,
            }),
          });

          if (!response.ok) throw new Error("Failed to update brand");

          toast.success("Your Brand has been updated", {
            position: "top-left",
          });
          router.push(
            `https://discover.myriadflow.com/brand/${initialData.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          );
        } catch (error) {
          console.error(error);
          toast.error("Failed to create Brand: " + error, {
            position: "top-left",
          });
        } finally {
          setLoading(false);
        }
      }

      if (cid !== "") {
        setLoading(true);

        toast.warning("Deploying AccessMaster to manage your brand", {
          position: "top-left",
        });

        const deploySuccess = await handleDeploy();
        if (!deploySuccess) throw new Error("AccessMaster deployment failed");

        const AccessMasterAddress = localStorage.getItem("AccessMasterAddress");
        console.log("Contract deployed at:", AccessMasterAddress);

        toast.warning("Deploying TradeHub", {
          position: "top-left",
        });

        const deployTradeHub = await TradehubDeploy();
        if (!deployTradeHub) throw new Error("TradeHub deployment failed");

        const TradehubAddress = localStorage.getItem("TradehubAddress");
        console.log("Contract deployed at:", TradehubAddress);

        toast.success("Deployment Successful", {
          position: "top-left",
        });

        const brandId = uuidv4();
        const chaintype = localStorage.getItem("BaseSepoliaChain");
        const elevateRegion = localStorage.getItem("elevateRegion");

        const response = await fetch(`${apiUrl}/brands`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: brandId,
            name: values.name,
            slogan: values.slogan,
            description: values.description,
            logo_image: values.logo_image,
            cover_image: values.cover_image,
            representative: values.representative,
            contact_email: values.contact_email,
            contact_phone: values.contact_phone,
            shipping_address: values.shipping_address,
            additional_info: values.additional_info,
            website: values.website,
            twitter: values.twitter,
            instagram: values.instagram,
            facebook: values.facebook,
            additional_link: values.additional_link,
            link: values.link,
            discord: values.discord,
            manager_id: values.manager_id,
            access_master: AccessMasterAddress,
            trade_hub: TradehubAddress,
            payout_address: account.address,
            chain_id: "84532",
            chaintype_id: chaintype,
            elevate_region: elevateRegion,
          }),
        });

        if (!response.ok) throw new Error("Failed to create brand");

        const brand = await response.json();
        localStorage.setItem("BrandId", brand.id);
        console.log(brand);

        const users = await fetch(`${apiUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: brandId,
            wallet_address: account.address,
            chaintype_id: chaintype,
          }),
        });

        if (!users.ok) throw new Error("Failed to add user");

        console.log(users);
        toast.success("Your Brand has been created", {
          position: "top-left",
        });
        router.push(`/congratulations?brand_name=${values.name}`);
      } else if (!imageError && cid === "") {
        toast.warning("Wait for your image to finish upload", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Brand: " + error, {
        position: "top-left",
      });
      setLoading(false);
    }
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // setFile(files[0]);
      // uploadFile(files[0]);
      try {
        const targetWidth = 512;
        const targetHeight = 512;
        const quality = 0.7;

        const compressedFile = await compressImage(files[0], targetWidth, targetHeight, quality);

        setFile(compressedFile);
        await uploadFile(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    }
  };

  const uploadCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // setFile(files[0]);
      // uploadCoverFile(files[0]);

      try {
        const targetWidth = 1920;
        const targetHeight = 972;
        const quality = 0.7;

        const compressedFile = await compressImage(files[0], targetWidth, targetHeight, quality);

        setFile(compressedFile);
        await uploadCoverFile(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    }
  };

  const removePrefix = (uri: any) => {
    return uri.substring(7, uri.length);
  };

  useEffect(() => {
    if (isEdit && initialData) {
      // Set form values
      form.reset({
        name: initialData.name,
        slogan: initialData.slogan,
        description: initialData.description,
        representative: initialData.representative,
        contact_email: initialData.contact_email,
        contact_phone: initialData.contact_phone,
        shipping_address: initialData.shipping_address,
        additional_info: initialData.additional_info,
        website: initialData.website,
        twitter: initialData.twitter,
        instagram: initialData.instagram,
        facebook: initialData.facebook,
        additional_link: initialData.additional_link,
        link: initialData.link,
        discord: initialData.discord,
        logo_image: initialData.logo_image,
        cover_image: initialData.cover_image,
        manager_id: initialData.manager_id,
        access_master: initialData.access_master,
        trade_hub: initialData.trade_hub,
        payout_address: initialData.payout_address,
        chain_id: initialData.chain_id,
        chaintype_id: initialData.chaintype_id,
      });

      // Set image CIDs
      // if (initialData.logo_image) {
      //   setCid(initialData.logo_image.slice(7));
      // }
      // if (initialData.cover_image) {
      //   setCidCover(initialData.cover_image.slice(7));
      // }

      // Set elevate region
      setElevateRegion(initialData.elevate_region || "");
      setShowForm(!!initialData.elevate_region);
    }
  }, [isEdit, initialData, form]);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="min-h-screen">
        <div className="px-16 py-8 border-b text-black border-black">
          <h1 className="font-bold uppercase text-3xl mb-4">Create your brand</h1>
          <p>Fill out the details for creating your brand</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-4 px-32 flex flex-col gap-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Brand Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                    </FormControl>
                    <FormDescription className="text-lg font-semibold">
                      Your brand page will be available at
                      https://myriadflow.com/brand/brandnameabove
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Brand Slogan<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Brand Description<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="border-0 bg-[#0000001A]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-12">
                <div>
                  <h3 className="text-2xl">
                    Upload Image<span className="text-red-500">*</span>
                  </h3>
                  <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6">
                    <UploadIcon />
                    <p>Drag file here to upload. Choose file</p>
                    <p>Recommended size 512 x 512 px</p>
                    <div>
                      <label
                        htmlFor="upload"
                        className="flex flex-row items-center ml-12 cursor-pointer mt-4"
                      >
                        <input
                          id="upload"
                          type="file"
                          className="hidden"
                          ref={inputFile}
                          onChange={uploadImage}
                          accept="image/*"
                        />
                        {uploading ? (
                          <Loader />
                        ) : (
                          <img
                            src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                            alt=""
                            className="w-10 h-10"
                          />
                        )}

                        <div className="text-white ml-1">Replace</div>
                      </label>
                    </div>
                  </div>
                  {imageError && <p className="text-red-700">You have to upload a logo</p>}
                </div>
                <div>
                  <h3 className="text-2xl">Preview</h3>
                  {isEdit && !cid ? (
                    <img
                      // src={cid}
                      src={`${initialData?.logo_image}`}
                      alt="preview image"
                      height={250}
                      width={350}
                    />
                  ) : cid ? (
                    <img
                      // src={cid}
                      src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}ipfs/${cid}`}
                      alt="preview image"
                      height={250}
                      width={350}
                    />
                  ) : (
                    <div className="border border-[#D9D8D8] h-60 w-80 flex flex-col items-center justify-center p-6">
                      <PreviewIcon />
                      <p>Preview after upload</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  <h3 className="text-2xl">
                    Upload Cover Image<span className="text-red-500">*</span>
                  </h3>
                  <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6">
                    <UploadIcon />
                    <p>Drag file here to upload. Choose file</p>
                    <p>Recommended size 1920 x 972 px</p>
                    <div>
                      <label
                        htmlFor="uploadCover"
                        className="flex flex-row items-center ml-12 cursor-pointer mt-4"
                      >
                        <input
                          id="uploadCover"
                          type="file"
                          className="hidden"
                          ref={inputFile}
                          onChange={uploadCover}
                          accept="image/*"
                        />
                        {uploadingCover ? (
                          <Loader />
                        ) : (
                          <img
                            src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                            alt=""
                            className="w-10 h-10"
                          />
                        )}
                        <div className="text-white ml-1">Replace</div>
                      </label>
                    </div>
                  </div>
                  {imageError && <p className="text-red-700">You have to upload a Image</p>}
                </div>
                <div>
                  <h3 className="text-2xl">Preview</h3>
                  {isEdit && !cidCover ? (
                    <img
                      // src={cid}
                      src={`${initialData?.cover_image}`}
                      alt="preview image"
                      height={250}
                      width={350}
                    />
                  ) : cidCover ? (
                    <img
                      // src={cid}
                      src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}ipfs/${cidCover}`}
                      alt="preview image"
                      height={250}
                      width={350}
                    />
                  ) : (
                    <div className="border border-[#D9D8D8] h-60 w-80 flex flex-col items-center justify-center p-6">
                      <PreviewIcon />
                      <p>Preview after upload</p>
                    </div>
                  )}
                </div>
              </div>
              <FormField
                name="representative"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Name of Brand Representative<span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="contact_email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Contact Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="contact_phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Contact Phone<span className="text-red-500">*</span>
                    </FormLabel>
                    <Input
                      className="border-0 bg-[#0000001A] rounded"
                      placeholder="Include country code"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="shipping_address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Shipping address for NFC tags<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 bg-[#0000001A] rounded"
                        placeholder="Include name, street address, city, postal code, and country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormLabel className="text-xl font-semibold">Social Links</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="website"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg ">Website</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="twitter"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg ">X (Twitter)</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="instagram"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg ">Instagram</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="facebook"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg ">Facebook</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="additional_link"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <select
                          style={{
                            backgroundImage: "url('/choose-down-arrow.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "16px 16px",
                            appearance: "none",
                            paddingRight: "2rem",
                          }}
                          className="bg-white rounded w-full h-10 mt-8 border border-black px-4 font-semibold"
                          {...field}
                        >
                          <option value="">+ Choose</option>
                          <option value="telegram">Telegram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="google">Google</option>
                          <option value="tiktok">TikTok</option>
                          <option value="snapchat">Snapchat</option>
                          <option value="pinterest">Pinterest</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="link"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg ">Link</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="discord"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Discord</FormLabel>
                      <FormControl>
                        <Input className="border-0 bg-[#0000001A] rounded" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <label className="flex items-center text-xl">
                <input
                  type="checkbox"
                  checked={showForm}
                  onChange={handleCheckboxChange}
                  className="mr-2 "
                />
                My brand is part of MyriadFlow Elevate Program
              </label>
              {showForm && (
                <div className="mt-6">
                  <div className="flex flex-col gap-4">
                    <label>
                      Select Region
                      <select
                        className="border rounded px-2 py-1 border border-black ml-2 w-96"
                        value={elevateRegion} // Update this to the appropriate state for region
                        onChange={(e) => setElevateRegion(e.target.value)} // Update this to handle region selection
                        required
                      >
                        <option value="">Select Region</option>
                        <option value="Africa">Africa</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="North America">North America</option>
                        <option value="South America">South America</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </label>
                    <button
                      className="w-fit border border-black bg-[#0000001A] rounded-lg text-black text-2xl mt-4 px-6"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <FormField
                name="additional_info"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Brand Information for AI *
                    </FormLabel>
                    <FormDescription className="text-lg font-semibold">
                      Fill this field if you want to create an AI-powered brand ambassador
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        className="border-0 bg-[#0000001A] text-lg"
                        placeholder="Give as much information as possible about your brand. Anything you want the AI avatar to know and share with your customers. "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-fit bg-[#30D8FF] text-black hover:text-white rounded-full"
              >
                {loading ? "loading..." : isEdit ? "Update brand" : "Launch brand"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
