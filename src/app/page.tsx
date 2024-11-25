"use client";
import { useState, useEffect, CSSProperties } from "react";
import { Button, Navbar } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

import { toast, ToastContainer } from "react-toastify";
import Footer from "@/components/footer";
import { v4 as uuidv4 } from "uuid";

interface Brand {
  id: string; // UUID type
  logo_image: string;
  name: string;
  description: string;
}

export default function Home() {
  const { address: walletAddress } = useAccount();
  const [hasAddress, setHasAddress] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const account = useAccount();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [tosChecked, setTosChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_URI;
  const baseUri = process.env.NEXT_PUBLIC_URI || "https://app.myriadflow.com";

  useEffect(() => {
    const checkEmailExists = async () => {
      if (account?.address) {
        try {
          const response = await fetch(
            `${baseUri}/profiles/email/${account.address}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data.email);

            // If the email exists, set showForm to false
            if (data.email) {
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          } else {
            // Handle errors or cases where no data is returned
            setShowForm(true);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setShowForm(true);
        }
      }
    };

    checkEmailExists();
  }, [account.address]);

  const handleSubmit = async () => {
    if (displayName && email && tosChecked) {
      try {
        const profileId = uuidv4();
        const response = await fetch(`${baseUri}/profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: profileId,
            name: displayName,
            email: email,
            wallet_address: account.address,
            chaintype_id: "554b4903-9a06-4031-98f4-48276c427f78",
          }),
        });

        if (response.ok) {
          setShowForm(false);
        } else {
          console.error("Failed to submit profile data");
        }
      } catch (error) {
        console.error("Error submitting profile data:", error);
      }
    }
  };
  const getBrands = async () => {
    try {
      const res = await fetch(`${apiUrl}/brands/manager/${walletAddress}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result: Brand[] = await res.json();
      setBrands(result);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem(
        "BaseSepoliaChain",
        "554b4903-9a06-4031-98f4-48276c427f78"
        // '6c736e9b-37e6-43f5-9841-c0ac740282df'
      );
      setHasAddress(true);
      getBrands();
    } else {
      setHasAddress(false);
    }
  }, [walletAddress]);

  const ifConnected = async () => {
    if (!walletAddress) {
      toast.warning("Connect your wallet");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const heroSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: isMobile ? "auto" : "100vh",
    backgroundColor: "white",
    position: "relative",
    marginTop: "-40px",
  };

  const heroLeftStyle: CSSProperties = {
    width: isMobile ? "100%" : "50%",
    height: "full",
    padding: isMobile ? "20px" : "0 60px",
    display: "flex",
    flexDirection: "column",
    marginTop: isMobile ? "40px" : "240px",
  };

  const heroRightStyle: CSSProperties = {
    width: isMobile ? "100%" : "50%",
    minHeight: "full",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: isMobile ? "40px" : "0",
    flexDirection: isMobile ? "column-reverse" : "row",
  };

  const heroImageStyle: CSSProperties = {
    minHeight: isMobile ? "600px" : "98%",
    width: "100%",
    objectFit: "cover",
  };

  const heroTextStyle: CSSProperties = {
    position: "absolute",
    bottom: isMobile ? "14px" : "100px",
    padding: isMobile ? "0" : "20px",
    left: "32px",
    right: "32px",
    textAlign: "left",
    color: "black",
    fontSize: isMobile ? "18px" : "24px",
    fontFamily: "Bai Jamjuree, sans-serif",
    fontWeight: 400,
  };

  const featuresStyle: CSSProperties = {
    backgroundColor: "white",
    padding: isMobile ? "40px 20px" : "64px",
  };

  const featuresSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "64px",
  };

  const featureBlockStyle: CSSProperties = {
    width: isMobile ? "100%" : "48%",
    marginBottom: isMobile ? "40px" : "0",
    display: "flex",
    alignItems: "center",
  };

  const imageContainerStyle: CSSProperties = {
    position: "relative",
    width: isMobile ? "200px" : "300px",
    height: isMobile ? "200px" : "300px",
    marginLeft: "32px",
  };

  const programsStyle: CSSProperties = {
    backgroundColor: "white",
    padding: isMobile ? "40px 20px" : "64px",
  };

  const programsContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    gap: isMobile ? "40px" : "0",
  };

  const programCardStyle: CSSProperties = {
    width: isMobile ? "100%" : "48%",
    position: "relative",
  };

  return (
    <>
      <Navbar />
      <div>
        <div style={heroSectionStyle}>
          <div style={heroLeftStyle}>
            <div className="text-5xl lg:text-7xl md:text-6xl text-center lg:text-left font-bold mb-4 bg-gradient-to-l from-[#50B7F9] to-[#D32CE0] text-transparent bg-clip-text">
              MyriadFlow <br /> Studio
            </div>
            <div className="hidden lg:block text-3xl md:text-5xl font-thin mt-4 md:mt-6">
              Launch phygitals &<br />
              virtual experiences
            </div>
            <p className="hidden lg:block text-xl text-black mt-4">
              No coding knowledge needed.
            </p>
            <div
              style={{
                display: isMobile ? "none" : "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "24px",
                marginTop: isMobile ? "24px" : "80px",
              }}
              className="flex-wrap lg:flex-nowrap"
            >
              <div className="relative inline-block">
                <w3m-button />
              </div>
              {!walletAddress ? (
                <Button className="px-10 py-2 rounded-[20px] font-bold text-black hover:text-white bg-white border border-solid border-[#DF1FDD] text-center">
                  Works best on Chrome browser!
                </Button>
              ) : (
                <Link
                  href="/create-brand"
                  className="px-10 py-2 rounded-[30px] font-bold text-black bg-[#30D8FF] text-center"
                >
                  Works best on Chrome browser!
                </Link>
              )}
            </div>
          </div>

          <div style={heroRightStyle}>
            <img
              src="/images/hero_background.png"
              alt="Hero Background"
              style={heroImageStyle}
            />
            <div style={heroTextStyle}>
              Welcome to MyriadFlow Studio, your one-stop shop for creating
              groundbreaking phygital NFTs. Ready to take off to the next level?
            </div>
          </div>
        </div>

        <div className="bg-black py-4 md:py-6 text-center mt-0">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#F45EC1] to-[#4EB9F3] text-transparent bg-clip-text">
            Launch Your NFT Experiences.
          </h2>
        </div>

        <div className="hidden lg:flex" style={featuresStyle}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={featuresSectionStyle}>
              <div style={featureBlockStyle}>
                <h2
                  className="text-2xl md:text-3xl font-medium text-black mr-8"
                  style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
                >
                  Sell & showcase
                  <br />
                  your products as
                  <br />
                  phygital NFTs
                </h2>
                <div style={imageContainerStyle}>
                  <img
                    src="/images/discover_cover.png"
                    alt="Discover Cover"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px 0 0 0",
                    }}
                  />
                </div>
              </div>
              {!isMobile && (
                <div className="text-4xl font-bold text-black">+</div>
              )}
              <div style={featureBlockStyle}>
                <h2
                  className="text-2xl md:text-3xl font-medium text-black mr-8"
                  style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
                >
                  Captivate your
                  <br />
                  customers with
                  <br />
                  virtual experiences
                </h2>
                <div style={imageContainerStyle}>
                  <img
                    src="/images/webxr_cover.png"
                    alt="WebXR Cover"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px 0 0 0",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: isMobile ? "40px" : "0",
              }}
            >
              <p
                className="text-2xl md:text-3xl mb-2 text-black"
                style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
              >
                <span className="font-bold">Already launched your brand?</span>{" "}
                Go to{" "}
                <a href="#" className="underline">
                  my Brand
                </a>{" "}
                page.
              </p>
              <br />
              <p className="text-4xl font-bold mb-2 text-black">OR</p>
              <br />
              <p
                className="text-2xl md:text-3xl text-black"
                style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
              >
                <span className="font-bold">Just getting started?</span> Choose
                the correct alternative.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex" style={programsStyle}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={programsContainerStyle}>
              {/* Premium Brand Card */}
              <div style={programCardStyle}>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div className="bg-[#30D8FF] text-black text-2xl border border-black px-4 py-2 rounded-full inline-block">
                    Premium Brand
                  </div>
                </div>
                <ul
                  className="list-disc list-inside mb-4 text-black"
                  style={{ marginLeft: "20px" }}
                >
                  <li>99 USD / month</li>
                  <li>Access to all our premium features</li>
                  <li>AR and 3D models</li>
                  <li>Verified NFT Brand communities</li>
                  <li>Showcase on Discover page</li>
                </ul>
                <div className="bg-[#30D8FF] text-black rounded-xl border border-black p-8 pt-12 relative">
                  {/* Content remains the same */}
                </div>
              </div>

              {/* Elevate Program Card */}
              <div style={programCardStyle}>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div className="bg-[#30D8FF4D] text-black text-2xl border border-black px-4 py-2 rounded-full inline-block">
                    Elevate Program
                  </div>
                </div>
                <ul
                  className="list-disc list-inside mb-4 text-black"
                  style={{ marginLeft: "20px" }}
                >
                  <li>No upfront costs</li>
                  <li>Sponsored base themes</li>
                  <li>Sponsored transactions for launching collections</li>
                  <li>Showcase on Elevate page</li>
                </ul>
                <div className="bg-[#E0F7FA] text-black rounded-xl border border-black p-8 pt-12 relative">
                  {/* Content remains the same */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hidden lg:flex"
          style={{
            backgroundColor: "white",
            padding: isMobile ? "40px 20px" : "64px",
            color: "black",
            textAlign: "left",
            paddingTop: "96px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2
              className="text-4xl md:text-5xl font-bold mb-8 text-black"
              style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
            >
              Want to find out more?
            </h2>
            <p
              className="text-xl mb-4 text-black"
              style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
            >
              <a href="#" className="underline">
                Click here
              </a>{" "}
              for more details about the requirements.
            </p>
            <p
              className="text-xl text-black"
              style={{ fontFamily: "Bai Jamjuree, sans-serif" }}
            >
              Or{" "}
              <a href="#" className="underline">
                contact us
              </a>
              . We would love to hear from you!
            </p>
          </div>
        </div>

        <div className="block lg:hidden px-4 py-10">
          <p
            className="w-[334px] h-[153px] "
            style={{
              fontFamily: "Bai Jamjuree, sans-serif",
              fontSize: "22px",
              fontWeight: 300,
              lineHeight: "27.5px",
              textAlign: "center",
              margin: "auto",
            }}
          >
            Would you like to explore our Discover marketplace or WebXR on your
            mobile device?{" "}
          </p>

          <div className="flex flex-col gap-4 mt-6">
            <Link
              href="https://discover.myriadflow.com/"
              className="w-[233px] h-[60.91px] bg-[#30D8FF] rounded-[30px] mx-auto"
              style={{
                fontFamily: "Bai Jamjuree, sans-serif",
                fontSize: "30px",
                fontWeight: 400,
                lineHeight: "28px",
                letterSpacing: "0.45%",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Discover
            </Link>
            <Link
              href="https://webxr.myriadflow.com/"
              className="w-[233px] h-[60.91px] bg-[#30D8FF] rounded-[30px] mx-auto"
              style={{
                fontFamily: "Bai Jamjuree, sans-serif",
                fontSize: "30px",
                fontWeight: 400,
                lineHeight: "28px",
                letterSpacing: "0.45%",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              WebXR
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
