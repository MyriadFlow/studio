import React, { useState, useEffect, MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./navigation-menu";
import { Logo } from "./logo";
import { toast, ToastContainer } from "react-toastify";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLink {
  title: string;
  path: string;
}

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const baseUri = process.env.NEXT_PUBLIC_URI || "https://app.myriadflow.com";

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setIsSessionActive(true);
    }
    if (isConnected) {
      if (!savedAddress && address) {
        localStorage.setItem("walletAddress", address);
      }
      setIsSessionActive(true);
    } else {
      if (savedAddress) {
        localStorage.removeItem("walletAddress");
        setIsSessionActive(false);
      }
    }
  }, [isConnected, address]);

  useEffect(() => {
    const getUserData = async () => {
      if (address) {
        try {
          const response = await fetch(
            `${baseUri}/profiles/wallet/${address}`,
            {
              method: "GET",
              headers: {
                "content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setProfileImage(data.profile_image);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };
    getUserData();
  }, [address]);

  const navlinks: NavLink[] = [
    { title: "Home", path: "https://myriadflow.com" },
    { title: "Discover", path: "https://discover.myriadflow.com" },
    { title: "WebXR", path: "https://webxr.myriadflow.com" },
    { title: "Studio", path: "https://studio.myriadflow.com" },
  ];

  const Notification = () => {
    if (!address) {
      toast.warning(
        "Currently works with Metamask and Coinbase Wallet Extension. We are working on Smart Wallet functionality.",
        {
          containerId: "containerA",
          position: "top-left",
        }
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("walletAddress");
    disconnect();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const ProfileDropdown = () => (
    <div className="absolute right-0 mt-2 p-6 bg-white rounded-lg shadow-xl z-50 w-64">
      <div className="flex items-center px-4 py-2">
        <img
          src={
            profileImage
              ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profileImage}`
              : "/profile.png"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full mr-2"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-black">{name}</span>
          <Link
            href="/profile"
            className="text-sm text-gray-500 hover:underline"
          >
            View profile
          </Link>
        </div>
      </div>

      {[
        { title: "My assets", path: "/" },
        { title: "On sale", path: "/" },
        { title: "My brands", path: "/" },
        { title: "My collections", path: "/" },
        { title: "Activity", path: "/" },
        { title: "Rewards", path: "/" },
        { title: "Create", path: "/" },
        { title: "Profile Settings", path: "/profile-setting" },
      ].map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          onClick={() => setIsDropdownOpen(false)}
        >
          {item.title}
        </Link>
      ))}

      <div className="px-4 py-2 text-xs text-gray-500 truncate">{address}</div>
      <div className="border-t border-gray-200 my-2"></div>
      <button
        onClick={handleLogout}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
      >
        Log out
      </button>
    </div>
  );

  return (
    <>
      <NavigationMenu className="nav max-w-full w-full px-4 md:px-8 py-4 md:py-6 relative">
        <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
          <a href="/" className="z-20">
            <Logo />
          </a>

          {/* Desktop Menu */}
          <NavigationMenuList className="hidden md:flex gap-8 items-center text-white text-lg">
            {navlinks.map((link, index) => (
              <Link
                href={link.path}
                key={index}
                target={link.title === "Home" ? "_blank" : undefined}
              >
                <NavigationMenuItem>
                  {link.title}
                  {link.title === "Home" && (
                    <img
                      src="/images/whitearrow.png"
                      alt="Arrow"
                      className="inline-block ml-1 w-3 h-3"
                    />
                  )}
                </NavigationMenuItem>
              </Link>
            ))}

            {/* Profile/Connect Section */}
            <div className="flex items-center gap-4">
              {address ? (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img
                      src={
                        profileImage
                          ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profileImage}`
                          : "/profile.png"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </button>
                  {isDropdownOpen && <ProfileDropdown />}
                </div>
              ) : (
                <div onClick={Notification}>
                  <w3m-button />
                </div>
              )}
            </div>
          </NavigationMenuList>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-20">
            {address ? (
              <div className="relative hidden lg:flex">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={
                      profileImage
                        ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${profileImage}`
                        : "/profile.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
                {isDropdownOpen && <ProfileDropdown />}
              </div>
            ) : (
              <div className="hidden lg:flex" onClick={Notification}>
                <w3m-button />
              </div>
            )}

            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 pt-20 px-6 z-10">
            <div className="flex flex-col gap-6 text-white text-xl">
              {navlinks.map((link, index) => (
                <Link
                  href={link.path}
                  key={index}
                  target={link.title === "Home" ? "_blank" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <NavigationMenuItem className="flex items-center">
                    {link.title}
                    {link.title === "Home" && (
                      <img
                        src="/images/whitearrow.png"
                        alt="Arrow"
                        className="inline-block ml-2 w-3 h-3"
                      />
                    )}
                  </NavigationMenuItem>
                </Link>
              ))}
            </div>
          </div>
        )}
      </NavigationMenu>
      <ToastContainer
        className="absolute top-0 right-0"
        containerId="containerA"
      />
    </>
  );
};

export default Navbar;
