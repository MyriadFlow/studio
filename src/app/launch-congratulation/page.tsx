"use client";
import { useState, useEffect } from "react";
import { Button, Navbar } from "@/components";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export default function LaunchCongratulation() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showOptions, setShowOptions] = useState(true);
  const [brandName, setBrandName] = useState<string | null>(null);
  const [hasWebXrExperience, setHasWebXrExperience] = useState<string | null>(null);
  const [showNFTCreation, setShowNFTCreation] = useState(false);
  const router = useRouter();
  const phygitalName = localStorage.getItem("PhygitalName");

  useEffect(() => {
    const storedBrandName = localStorage.getItem("brand_name");
    const webXrExperience = localStorage.getItem("webxr-experience-with-ai-avatar");
    setBrandName(storedBrandName);
    setHasWebXrExperience(webXrExperience);
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleLaunchAnother = () => {
    setShowNFTCreation(true);
    setShowOptions(false);
  };

  const handleContinue = () => {
    if (selectedOption === "brand") {
      setShowOptions(false);
    } else if (selectedOption === "create") {
      router.push("/create-webxr-experience");
    } else if (selectedOption === "none") {
      setShowOptions(false);
    }
  };

  if (showNFTCreation) {
    return (
      <Suspense>
        <Navbar />
        <main className="h-screen py-12 px-16 flex flex-col gap-8 text-black">
          <h1 className="text-3xl font-bold">{"Let's"} Go!</h1>
          <p className="text-xl">
            You are ready to create another NFT for the Brand {brandName}
          </p>
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

  return (
    <Suspense>
      <Navbar />
      <main className="min-h-screen py-12 px-16 bg-white text-black">
        <h1 className="text-4xl font-bold mb-8">Congratulations!</h1>

        {showOptions ? (
          <>
            <p className="text-xl mb-12">
              Your phygital {phygitalName} has been launched successfully.
            </p>
            <p className="text-xl mb-8">
              Choose the best alternative for your WebXR Experience.
            </p>

            <div className="flex flex-col gap-6 max-w-xl mb-12">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="radio"
                  name="webxr-option"
                  value="brand"
                  checked={selectedOption === "brand"}
                  onChange={() => handleOptionSelect("brand")}
                  className="w-5 h-5 accent-[#30D8FF]"
                />
                <span className="text-lg">
                  Use Brand Ambassador WebXR Experience
                </span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="radio"
                  name="webxr-option"
                  value="create"
                  checked={selectedOption === "create"}
                  onChange={() => handleOptionSelect("create")}
                  className="w-5 h-5 accent-[#30D8FF]"
                />
                <span className="text-lg">
                  Create new unique avatar and WebXR Experience
                </span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="radio"
                  name="webxr-option"
                  value="none"
                  checked={selectedOption === "none"}
                  onChange={() => handleOptionSelect("none")}
                  className="w-5 h-5 accent-[#30D8FF]"
                />
                <span className="text-lg">No avatar or WebXR</span>
              </label>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="bg-[#30D8FF] text-black hover:text-white rounded-full px-12 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            {selectedOption === "brand" && (
              <p className="text-xl mb-12">
                Brand Ambassador WebXR Experience will be used for this
                phygital.
              </p>
            )}
            {selectedOption === "none" && (
              <p className="text-xl mb-12">
                Your phygital {phygitalName} has been launched successfully.
              </p>
            )}

            <div className="flex flex-col gap-6">
              <div>
                <Button 
                  onClick={handleLaunchAnother}
                  className="bg-[#30D8FF] text-white hover:text-white rounded-full px-12 py-3 text-lg"
                >
                  Launch another
                </Button>
              </div>

              <div>
                <Link href="https://discover.myriadflow.com/" target="_blank">
                  <Button className="border-2 border-black text-white hover:bg-black hover:text-white rounded-full px-12 py-3 text-lg">
                    View on Discover
                  </Button>
                </Link>
              </div>

              <Link href="https://webxr.myriadflow.com/" target="_blank">
                <Button className="border-2 border-black text-white hover:bg-black hover:text-white rounded-full px-12 py-3 text-lg">
                  View on WebXR
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </Suspense>
  );
}
