"use client";
import { useSearchParams } from "next/navigation";
import { Button, Navbar } from "@/components";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";

export default function Congratulations() {
  const [brandName, setBrandName] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasWebXrExperience, setHasWebXrExperience] = useState<string | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem("webxr-experience-with-ai-avatar", true.toString());
    // Access localStorage after component mounts
    const storedBrandName = localStorage.getItem("brand_name");
    const webXrExperience: string | null = localStorage.getItem(
      "webxr-experience-with-ai-avatar"
    );
    setBrandName(storedBrandName);
    console.log(webXrExperience);
    setHasWebXrExperience(webXrExperience);
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Suspense>
      <Navbar />
      <main className="h-screen py-12 px-16 flex flex-col gap-8 text-black">
        <h1 className="text-3xl font-bold">Congratulations</h1>
        {hasWebXrExperience === "true" ? (
          <p className="text-xl">
            Your brand {brandName} and brand ambassador WebXR have been <br />{" "}
            launched successfully. You are now ready to launch NFTs.
          </p>
        ) : (
          <p className="text-xl">
            Your brand {brandName} has been launched successfully. <br />
            You are now ready to launch NFTs.
          </p>
        )}
        <h1 className="text-4xl font-medium">What would you like to create?</h1>
        <div>
          <select
            style={{
              backgroundImage: "url('/choose-down-arrow.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "16px 16px",
              appearance: "none",
              paddingRight: "2rem",
            }}
            className="bg-white rounded w-3/12 h-10 mt-8 border border-black px-4 font-semibold"
            onChange={handleSelectChange}
            value={selectedOption}
          >
            <option value="">+ Choose</option>
            <option value="rare">Rare item (ERC-721)</option>
            <option value="limited">Limited Edition (ERC-721A)</option>
          </select>
          {selectedOption === "limited" ? (
            <Link href="/create-phygital">
              <Button className="w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl ml-20">
                Continue
              </Button>
            </Link>
          ) : selectedOption === "rare" ? (
            <Link href="/create-rare-item">
              <Button className="w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl ml-20">
                Continue
              </Button>
            </Link>
          ) : (
            <Button
              className="w-fit bg-[#30D8FF] hover:text-white rounded-full text-black text-2xl ml-20"
              disabled={selectedOption !== "limited"}
            >
              Continue
            </Button>
          )}
        </div>
      </main>
    </Suspense>
  );
}
