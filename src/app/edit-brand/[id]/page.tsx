"use client";
import { useState, useEffect } from "react";
import BrandForm, { BrandData } from "@/components/BrandForm";
import { useAccount } from "wagmi";
import { Navbar } from "@/components";
import Footer from "@/components/footer";

export default function EditBrand({ params }: { params: { id: string } }) {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { address: userAddress } = useAccount();

  useEffect(() => {
    const fetchBrandData = async () => {
      const baseUri =
        process.env.NEXT_PUBLIC_URI || "https://app.myriadflow.com";
      try {
        const res = await fetch(
          `${baseUri}/brands/all/554b4903-9a06-4031-98f4-48276c427f78`
        );
        const brands = await res.json();

        const brandName = params?.id
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char: string) => char.toUpperCase());

        const matchedBrand: BrandData = brands.find(
          (brand: BrandData) => brand.name === brandName
        );
        if (matchedBrand) {
          const transformedBrand = {
            ...matchedBrand,
            logo_image: matchedBrand.logo_image
              ? `https://nftstorage.link/ipfs/${matchedBrand.logo_image.slice(7)}`
              : "",
            cover_image: matchedBrand.cover_image
              ? `https://nftstorage.link/ipfs/${matchedBrand.cover_image.slice(7)}`
              : "",
          };

          setBrandData(transformedBrand);
          setIsOwner(
            userAddress?.toLowerCase() ===
              matchedBrand.payout_address?.toLowerCase()
          );
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, [params?.id, userAddress]);
  console.log(brandData);

  if (!brandData) return <div>Loading...</div>;

  if (!isOwner) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You {"don't"} have permission to edit this brand.</p>
        </div>
        <Footer />
      </>
    );
  }

  return <BrandForm mode="edit" initialData={brandData} />;
}
