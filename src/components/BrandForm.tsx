"use client";
import { useState, useEffect, useRef, ChangeEvent, useMemo } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
  logo_image: string;
  cover_image: string;
  manager_id: string;
  access_master: string;
  trade_hub: string;
  payout_address: string;
  chain_id: string;
  chaintype_id: string;
  elevate_region?: string;
  webxr_experience_with_ai_avatar: boolean;
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
  google?: string;
  tiktok?: string;
  snapchat?: string;
  pinterest?: string;
  discord?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

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
  description: z
    .string()
    .min(2, { message: "Brand description must be at least 2 characters" })
    .max(1000, {
      message: "Brand description should be less than 1000 words",
    }),
  representative: z
    .string()
    .min(2, { message: "Brand Representative must be at least 2 characters" }),
  contact_email: z
    .string()
    .email()
    .min(2, { message: "Contact email must be a valid email" }),
  contact_phone: z
    .string()
    .min(2, { message: "Contact phone number must be a valid phone number" }),
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
  webxr_experience_with_ai_avatar: z.boolean().default(false),
});

export default function CreateBrand({
  mode = "create",
  initialData = null,
}: BrandFormProps) {
  const { address: walletAddress } = useAccount();
  const isEdit = mode === "edit";
  const router = useRouter();
  const account = useAccount();

  // State management
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [elevateRegion, setElevateRegion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [cidCover, setCidCover] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const inputFile = useRef(null);

  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = useMemo(() => {
    if (wallet) {
      return new Metaplex(connection).use(walletAdapterIdentity(wallet));
    }
  }, [wallet, connection]);

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
      logo_image: "",
      cover_image: "",
      manager_id: "",
      access_master: "",
      trade_hub: "",
      payout_address: "",
      chain_id: "",
      chaintype_id: "",
      webxr_experience_with_ai_avatar: false,
    },
  });

  const uploadFile = async (fileToUpload: string | Blob) => {
    try {
      setLogoUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      console.log(resData);
      setCid(resData.IpfsHash);
      toast.success("Logo Upload Completed!", {
        position: "top-left",
      });
    } catch (e) {
      console.error(e);
      toast.error("Trouble uploading logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const uploadCoverFile = async (fileToUpload: string | Blob) => {
    try {
      setCoverUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCidCover(resData.IpfsHash);
      toast.success("Cover Upload Completed!", {
        position: "top-left",
      });
    } catch (e) {
      console.error(e);
      toast.error("Trouble uploading cover image");
    } finally {
      setCoverUploading(false);
    }
  };

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
  };

  const getWebsiteUrl = () => {
    const websiteLink = socialLinks.find((link) => link.platform === "website");
    return websiteLink?.url || "";
  };

  const deployContract = async () => {
    if (!publicKey || !metaplex) {
        toast.error("Please connect your wallet first");
        return;
    }

    try {
        // Check SOL balance
        const balance = await connection.getBalance(publicKey);
        if (balance < LAMPORTS_PER_SOL * 0.05) {
            toast.error("Insufficient SOL balance. Need at least 0.05 SOL");
            return;
        }

        // Create metadata
        const metadata = {
            name: form.getValues("name"),
            symbol: "BRAND",
            description: form.getValues("description"),
            image: `ipfs://${cid}`,
            external_url: getWebsiteUrl(),
            attributes: [
                {
                    trait_type: "Brand Representative",
                    value: form.getValues("representative"),
                },
                {
                    trait_type: "Region",
                    value: elevateRegion || "Global",
                },
            ],
        };

        // Upload to IPFS
        const { IpfsHash } = await uploadToIPFS(metadata);
        const metadataUri = `ipfs://${IpfsHash}`;

        // Create Brand Collection
        const { nft: collectionNft } = await metaplex.nfts().create({
            uri: metadataUri,
            name: form.getValues("name"),
            sellerFeeBasisPoints: 500, // 5% royalty
            symbol: "BRAND",
            isCollection: true,
            updateAuthority: metaplex.identity(),
        });

        // Store collection address for future reference
        setIsDeployed(true);
        return collectionNft.address.toString();
    } catch (error) {
        console.error("Deployment error:", error);
        toast.error(getErrorMessage(error));
        throw error;
    }
};

  const deployTradehubContract = async (
    platformFee: number,
    memory_name: string
  ) => {
    if (!publicKey || !metaplex) {
      throw new Error("Wallet not connected");
    }

    try {
      const metadata = {
        name: memory_name,
        symbol: "TRADE",
        description: `Trading collection for ${form.getValues("name")}`,
        image: `ipfs://${cidCover}`,
        external_url: getWebsiteUrl(),
        attributes: [
          {
            trait_type: "Platform Fee",
            value: platformFee.toString(),
          },
        ],
      };

      const response = await fetch("/api/upload-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: metadata }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const metadataUri = `ipfs://${data.IpfsHash}`;

      const { nft: tradingCollection } = await metaplex.nfts().create({
        uri: metadataUri,
        name: memory_name,
        sellerFeeBasisPoints: platformFee * 100,
        symbol: "TRADE",
        isCollection: true,
        updateAuthority: metaplex.identity(),
      });

      setIsDeployed(true);
      return {
        mintAddress: tradingCollection.address.toString(),
        metadataAddress: tradingCollection.metadataAddress.toString(),
        // tokenAddress: tradingCollection.tokenAddress?.toString() || null,
      };
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Error deploying trading collection: " + error);
      throw error;
    }
  };

  const createAndUploadMetadata = async (metadata: any) => {
    try {
      const response = await fetch("/api/upload-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: metadata }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return `ipfs://${data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };

  const mintNFTToCollection = async (
    collectionAddress: string,
    metadata: any
  ) => {
    if (!publicKey || !metaplex) {
      throw new Error("Wallet not connected");
    }

    try {
      const metadataUri = await createAndUploadMetadata(metadata);

      const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: metadata.name,
        sellerFeeBasisPoints: metadata.royalties || 0,
        symbol: metadata.symbol || "NFT",
        collection: new PublicKey(collectionAddress),
        collectionAuthority: publicKey as any,
      });

      return nft;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleElevateSubmit = () => {
    if (!elevateRegion) {
      toast.warning("Region selection is required.");
      return;
    }
    localStorage.setItem("elevateRegion", elevateRegion);
    if (elevateRegion === "Africa") {
      localStorage.setItem(
        "BaseSepoliaChain",
        "6c736e9b-37e6-43f5-9841-c0ac740282df"
      );
    } else {
      localStorage.setItem(
        "BaseSepoliaChain",
        "554b4903-9a06-4031-98f4-48276c427f78"
      );
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey || !metaplex) {
      throw new Error("Wallet not connected");
    }

    if (!isEdit && !cid) {
      setImageError(true);
      return;
    }

    try {
      const socialLinksObject = socialLinks.reduce((acc, link) => {
        if (link.platform && link.url) {
          acc[link.platform] = link.url;
        }
        return acc;
      }, {} as Record<string, string>);

      if (cid) {
        values.logo_image = "ipfs://" + cid;
      } else if (isEdit && initialData?.logo_image) {
        values.logo_image =
          "ipfs://" + initialData.logo_image.split("/ipfs/")[1];
      }

      if (cidCover) {
        values.cover_image = "ipfs://" + cidCover;
      } else if (isEdit && initialData?.cover_image) {
        values.cover_image =
          "ipfs://" + initialData.cover_image.split("/ipfs/")[1];
      }

      values.manager_id = account.address!;
      localStorage.setItem("brand_name", values.name);

      const apiUrl = process.env.NEXT_PUBLIC_URI;

      if (isEdit && initialData) {
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/brands/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              ...socialLinksObject,
              elevate_region: elevateRegion,
            }),
          });

          if (!response.ok) throw new Error("Failed to update brand");

          toast.success("Your Brand has been updated");
          router.push(
            `https://discover.myriadflow.com/brand/${initialData.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          );
        } catch (error) {
          console.error(error);
          toast.error("Failed to update Brand: " + error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (cid) {
        setLoading(true);
        toast.warning("Deploying brand collection...");

        const collectionAddress = await deployContract();
        localStorage.setItem("AccessMasterAddress", collectionAddress as string);
        console.log("Brand collection deployed at:", collectionAddress);

        toast.warning("Deploying trading collection...");
        const tradingCollectionAddresses = await deployTradehubContract(
          30,
          "NFT BAZAAR"
        );
        localStorage.setItem(
          "TradehubAddress",
          tradingCollectionAddresses.mintAddress
        );
        localStorage.setItem(
          "TradehubMetadataAddress",
          tradingCollectionAddresses.metadataAddress
        );
        // if (tradingCollectionAddresses.tokenAddress) {
        //   localStorage.setItem(
        //     "TradehubTokenAddress",
        //     tradingCollectionAddresses.tokenAddress
        //   );
        // }
        console.log(
          "Trading collection deployed at:",
          tradingCollectionAddresses.mintAddress
        );

        toast.success("Collections deployed successfully");

        const brandId = uuidv4();
        const chaintype = localStorage.getItem("BaseSepoliaChain");
        const elevateRegion = localStorage.getItem("elevateRegion");

        const response = await fetch(`${apiUrl}/brands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: brandId,
            ...values,
            ...socialLinksObject,
            access_master: collectionAddress,
            trade_hub: tradingCollectionAddresses.mintAddress,
            payout_address: account.address,
            chain_id: "84532",
            chaintype_id: chaintype,
            elevate_region: elevateRegion,
          }),
        });

        if (!response.ok) throw new Error("Failed to create brand");

        const brand = await response.json();
        localStorage.setItem("BrandId", brand.id);
        localStorage.setItem('webxr-experience-with-ai-avatar', values.webxr_experience_with_ai_avatar.toString())

        const users = await fetch(`${apiUrl}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: brandId,
            wallet_address: account.address,
            chaintype_id: chaintype,
          }),
        });

        if (!users.ok) throw new Error("Failed to add user");

        toast.success("Your Brand has been created");

        router.push("/create-webxr-experience");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Brand: " + error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem(
        "BaseSepoliaChain",
        "554b4903-9a06-4031-98f4-48276c427f78"
      );
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        ...initialData,
        webxr_experience_with_ai_avatar:
          initialData.webxr_experience_with_ai_avatar || false,
      });

      setElevateRegion(initialData.elevate_region || "");
      setShowForm(!!initialData.elevate_region);

      const initialSocialLinks: SocialLink[] = [];
      const socialPlatforms = [
        "website",
        "twitter",
        "instagram",
        "facebook",
        "telegram",
        "linkedin",
        "youtube",
        "whatsapp",
        "google",
        "tiktok",
        "snapchat",
        "pinterest",
        "discord",
      ];

      socialPlatforms.forEach((platform) => {
        if (initialData[platform as keyof BrandData]) {
          initialSocialLinks.push({
            platform,
            url: initialData[platform as keyof BrandData] as string,
          });
        }
      });
      setSocialLinks(initialSocialLinks);
    }
  }, [isEdit, initialData, form]);

  const uploadToIPFS = async (content: any) => {
    const response = await fetch("/api/upload-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
    }

    return response.json();
  };

  const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="min-h-screen">
        <div className="px-16 py-8 border-b text-black border-black">
          <h1 className="font-bold uppercase text-3xl mb-4">
            {isEdit ? "Edit your brand" : "Create your brand"}
          </h1>
          <p>Fill out the details for your brand</p>
        </div>

        {!connected ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-lg">Please connect your wallet to continue</p>
            <WalletMultiButton />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="py-4 px-32 flex flex-col gap-12">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold mb-4">
                        Brand Name*
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 bg-[#0000001A] rounded"
                          {...field}
                        />
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
                        Brand Slogan*
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 bg-[#0000001A] rounded"
                          {...field}
                        />
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
                        Brand Description*
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-0 bg-[#0000001A]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-12">
                  <div>
                    <h3 className="text-2xl">Upload Logo*</h3>
                    <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6 relative">
                      {logoUploading ? (
                        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                          <p className="mt-4 text-black font-medium">
                            Uploading Logo...
                          </p>
                        </div>
                      ) : (
                        <>
                          <UploadIcon />
                          <p>Drag file here to upload. Choose file </p>
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
                                disabled={logoUploading}
                              />
                              <img
                                src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                                alt=""
                                className="w-10 h-10"
                              />
                              <div className="text-white ml-1">
                                {cid ? "Replace" : "Upload"}
                              </div>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                    {imageError && (
                      <p className="text-red-700">You have to upload a logo</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl">Preview</h3>
                    {isEdit && !cid ? (
                      <img
                        src={`${initialData?.logo_image}`}
                        alt="preview image"
                        height={250}
                        width={350}
                        className="object-contain"
                      />
                    ) : cid ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                        alt="preview image"
                        height={250}
                        width={350}
                        className="object-contain"
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
                    <h3 className="text-2xl">Upload Cover Image*</h3>
                    <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6 relative">
                      {coverUploading ? (
                        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                          <p className="mt-4 text-black font-medium">
                            Uploading Cover Image...
                          </p>
                        </div>
                      ) : (
                        <>
                          <UploadIcon />
                          <p>Drag file here to upload. Choose file </p>
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
                                disabled={coverUploading}
                              />
                              <img
                                src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                                alt=""
                                className="w-10 h-10"
                              />
                              <div className="text-white ml-1">
                                {cidCover ? "Replace" : "Upload"}
                              </div>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl">Preview</h3>
                    {isEdit && !cidCover ? (
                      <img
                        src={`${initialData?.cover_image}`}
                        alt="preview image"
                        height={250}
                        width={350}
                        className="object-contain"
                      />
                    ) : cidCover ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cidCover}`}
                        alt="preview image"
                        height={250}
                        width={350}
                        className="object-contain"
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
                        Name of Brand Representative *
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 bg-[#0000001A] rounded"
                          {...field}
                        />
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
                        Contact Email*
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 bg-[#0000001A] rounded"
                          {...field}
                        />
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
                        Contact Phone*
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
                        Shipping address for NFC tags*
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

                <div className="space-y-4">
                  <FormLabel className="text-xl font-semibold">
                    Social Links
                  </FormLabel>

                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-4">
                      <select
                        className="bg-white rounded w-48 h-10 border border-black px-4 font-semibold"
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(index, "platform", e.target.value)
                        }
                      >
                        <option value="">Select Platform</option>
                        {[
                          { value: "website", label: "Website" },
                          { value: "telegram", label: "Telegram" },
                          { value: "linkedin", label: "LinkedIn" },
                          { value: "youtube", label: "YouTube" },
                          { value: "whatsapp", label: "WhatsApp" },
                          { value: "google", label: "Google" },
                          { value: "tiktok", label: "TikTok" },
                          { value: "snapchat", label: "Snapchat" },
                          { value: "pinterest", label: "Pinterest" },
                          { value: "twitter", label: "Twitter" },
                          { value: "instagram", label: "Instagram" },
                          { value: "facebook", label: "Facebook" },
                          { value: "discord", label: "Discord" },
                        ]
                          .filter(
                            (platform) =>
                              platform.value === link.platform ||
                              !socialLinks.some(
                                (l) => l.platform === platform.value
                              )
                          )
                          .map((platform) => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label}
                            </option>
                          ))}
                      </select>

                      <Input
                        className="border-0 bg-[#0000001A] rounded flex-1"
                        placeholder="Enter URL"
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="px-4 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {socialLinks.length < 13 && (
                    <Button
                      type="button"
                      onClick={addSocialLink}
                      className="mt-2"
                    >
                      Add Social Link
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="webxr_experience_with_ai_avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold">
                          Do you want to create WebXR experience with a unique
                          AI avatar?
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={field.value === true}
                                onChange={() => field.onChange(true)}
                                className="form-radio"
                              />
                              <span>Yes</span>
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={field.value === false}
                                onChange={() => field.onChange(false)}
                                className="form-radio"
                              />
                              <span>No</span>
                            </label>
                          </div>
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
                    onChange={() => setShowForm(!showForm)}
                    className="mr-2"
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
                          value={elevateRegion}
                          onChange={(e) => setElevateRegion(e.target.value)}
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
                        type="button"
                        className="w-fit border border-black bg-[#0000001A] rounded-lg text-black text-2xl mt-4 px-6"
                        onClick={handleElevateSubmit}
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
                        Fill this field if you want to create an AI-powered
                        brand ambassador
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          className="border-0 bg-[#0000001A] text-lg"
                          placeholder="Give as much information as possible about your brand. Anything you want the AI avatar to know and share with your customers. "
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
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isEdit
                    ? "Update brand"
                    : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </main>
    </>
  );
}