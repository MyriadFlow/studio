"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Button,
  Checkbox,
  Input,
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Avatar } from "@readyplayerme/visage";
import { NFTStorage } from "nft.storage";
import { v4 as uuidv4 } from "uuid";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API!;
const client = new NFTStorage({ token: API_KEY });

// 3D Model Preview Component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const formSchema = z.object({
  image360: z.string(),
  video360: z.string().optional(),
  rewards_metadata_uri: z.string().optional(),
  customizations: z.array(z.string()),
  free_nft_image: z.string(),
  gold_reward: z.string().min(1, { message: "Gold reward must be provided" }),
  silver_reward: z
    .string()
    .min(1, { message: "Silver reward must be provided" }),
  bronze_reward: z
    .string()
    .min(1, { message: "Bronze reward must be provided" }),
  avatar_voice: z.string(),
  elevate_region: z.string().optional(),
});

const items = [
  { id: "gender", label: "Gender" },
  { id: "face", label: "Face" },
  { id: "skin color", label: "Skin color" },
  { id: "hair", label: "Hair" },
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "animations", label: "Animations" },
];

export default function CreateWebxrExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [cidCover, setCidCover] = useState("");
  const [uploading3d, setUploading3d] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [avatarVoice, setAvatarVoice] = useState<string>("");
  const [modelError, setModelError] = useState<boolean>(false);
  const [formatError, setFormatError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [giveNFTs, setGiveNFTs] = useState<boolean>(false);

  const inputFile = useRef(null);
  const router = useRouter();

  const validate3dModel = (file: File) => {
    setFormatError("");
    if (!file.name.toLowerCase().endsWith(".glb")) {
      setFormatError("Please upload a GLB file format");
      return false;
    }
    return true;
  };

  const upload3dModel = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      try {
        if (!validate3dModel(files[0])) return;
        setUploading3d(true);
        await uploadFile(files[0]);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload 3D model");
      } finally {
        setUploading3d(false);
      }
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    try {
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const resData = await res.json();
      setCid(resData.IpfsHash);
      toast.success("3D model uploaded successfully!", {
        position: "top-left",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const uploadCoverFile = async (fileToUpload: File) => {
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
      toast.success("Cover image uploaded successfully!", {
        position: "top-left",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadCover = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      uploadCoverFile(files[0]);
    }
  };

  const getPhy = () => {
    if (typeof window !== "undefined" && localStorage) {
      return localStorage.getItem("phygitalData");
    }
  };

  const getAvatar = () => {
    if (typeof window !== "undefined" && localStorage) {
      return localStorage.getItem("avatar");
    }
  };

  const getPhygitalId = () => {
    if (typeof window !== "undefined" && localStorage) {
      return localStorage.getItem("PhygitalId");
    }
  };

  const storedData = getAvatar() ?? "{}";
  const phygital = getPhy() ?? "{}";
  const PhygitalId = getPhygitalId() ?? "{}";
  const parsedData = JSON.parse(storedData);
  const apiUrl = process.env.NEXT_PUBLIC_URI;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image360: "",
      video360: "",
      rewards_metadata_uri: "",
      customizations: [],
      free_nft_image: "",
      gold_reward: "1", // Set default values for required fields
      silver_reward: "1",
      bronze_reward: "1",
      avatar_voice: "", // Make sure this is included
      elevate_region: "North America",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted", values); // Debug log

    if (!cid) {
      setModelError(true);
      return;
    }

    try {
      setLoading(true);
      console.log("Starting submission..."); // Debug log

      const currentDate = new Date().toISOString();
      const webxrPayload = {
        ...values,
        image360: "ipfs://" + cid,
        free_nft_image: giveNFTs ? "ipfs://" + cidCover : "",
        customizations: JSON.stringify({ data: values.customizations }),
        phygital_id: PhygitalId,
        chaintype_id: uuidv4(),
        created_at: currentDate,
        updated_at: currentDate,
        avatar_voice: avatarVoice, // Make sure avatar voice is included
      };

      console.log("Payload:", webxrPayload); // Debug log

      localStorage.setItem("webxrData", JSON.stringify(values));

      const response = await fetch(`${apiUrl}/webxr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webxrPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData); // Debug log
        throw new Error(
          `Failed to create WebXR experience: ${response.statusText}`
        );
      }

      toast.success("WebXR experience created successfully!");
      router.push("/congratulations");
    } catch (error) {
      console.error("Submission error:", error); // Debug log
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create WebXR experience"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="min-h-screen">
        <div className="px-16 py-8 border-b text-black border-black">
          <h1 className="font-bold uppercase text-3xl mb-4">
            Create WebXR experience
          </h1>
        </div>
        <Form {...form}>
          <form
            id="webxr-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            <div className="py-4 px-32 flex flex-col gap-12">
              {/* Avatar Preview Section */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl">
                  Congratulations on creating your avatar! You can now complete
                  your WebXR experience.
                </h3>
                <div>
                  <h3 className="text-xl">Avatar preview</h3>
                  {parsedData.url ? (
                    <Avatar
                      modelSrc={parsedData.url}
                      cameraInitialDistance={1.5}
                    />
                  ) : (
                    <h2 className="text-2xl flex-col flex items-center ">
                      <span>Avatar</span> <span>image</span> <span>here</span>
                    </h2>
                  )}
                </div>
              </div>

              {/* 3D Model Upload Section */}
              <div className="flex gap-12">
                <div>
                  <h3 className="text-2xl">Upload 3D Model (GLB)*</h3>
                  <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6">
                    <UploadIcon />
                    {uploading3d ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#30D8FF]"></div>
                        <p className="mt-2">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <p>Drag GLB file here to upload or choose file</p>
                        <p>Only GLB format is supported</p>
                      </>
                    )}
                    {formatError && (
                      <p className="text-red-500 mt-2">{formatError}</p>
                    )}
                    <div>
                      <label
                        htmlFor="upload"
                        className={`flex flex-row items-center ml-12 cursor-pointer mt-4 ${
                          uploading3d ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <input
                          id="upload"
                          type="file"
                          className="hidden"
                          ref={inputFile}
                          onChange={upload3dModel}
                          accept=".glb"
                          disabled={uploading3d}
                        />
                        <img
                          src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                          alt=""
                          className="w-10 h-10"
                        />
                        <div className="text-white ml-1">
                          {uploading3d ? "Uploading..." : "Replace"}
                        </div>
                      </label>
                    </div>
                  </div>
                  {modelError && (
                    <p className="text-red-700">
                      You must upload a 3D model (GLB file)
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl">Preview</h3>
                  {cid ? (
                    <div className="border border-[#D9D8D8] h-60 w-80">
                      <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <spotLight
                          position={[10, 10, 10]}
                          angle={0.15}
                          penumbra={1}
                        />
                        <Model
                          url={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                        />
                        <OrbitControls autoRotate />
                      </Canvas>
                    </div>
                  ) : (
                    <div className="border border-[#D9D8D8] h-60 w-80 flex flex-col items-center justify-center p-6">
                      <PreviewIcon />
                      <p>Preview after upload</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl">Choose Avatar Voice*</h3>
                <div className="mt-6 ml-10">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      className="form-radio text-purple-600"
                      name="avatarVoice"
                      value="Denise"
                      checked={avatarVoice === "Denise"}
                      onChange={(e) => setAvatarVoice(e.target.value)}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <span className="ml-2 text-lg">Denise</span>
                  </label>
                  <label className="inline-flex items-center ml-80">
                    <input
                      type="radio"
                      className="form-radio text-purple-600"
                      name="avatarVoice"
                      value="Richard"
                      checked={avatarVoice === "Richard"}
                      onChange={(e) => setAvatarVoice(e.target.value)}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <span className="ml-2 text-lg">Richard</span>
                  </label>
                </div>
              </div>

              {/* NFT Section */}
              <div className="flex gap-12 flex-col">
                <div className="flex gap-4 items-center">
                  <h3 className="text-xl">
                    Give Free NFTs to users who interact with your avatar
                  </h3>
                  <div className="flex items-center gap-8">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-purple-600"
                        name="giveNFTs"
                        value="yes"
                        checked={giveNFTs === true}
                        onChange={() => setGiveNFTs(true)}
                        style={{ transform: "scale(1.5)" }}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-purple-600"
                        name="giveNFTs"
                        value="no"
                        checked={giveNFTs === false}
                        onChange={() => setGiveNFTs(false)}
                        style={{ transform: "scale(1.5)" }}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <p>
                  Choose this option if you want your avatars to compete on the
                  leaderboard for increased visibility and weekly rewards.
                </p>
              </div>

              {/* Conditional NFT Upload Section */}
              {giveNFTs && (
                <div className="flex gap-12 p-4 border-[#30D8FF] border rounded">
                  <div>
                    <h3 className="text-2xl">Upload free NFT image</h3>
                    <p>
                      You can upload anything. We recommend uploading an image
                      of your avatar in your background.
                    </p>
                    <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6">
                      <UploadIcon />
                      {uploadingCover ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#30D8FF]"></div>
                          <p className="mt-2">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <p>Drag file here to upload. Choose file </p>
                          <p>Recommended size 512 x 512 px</p>
                        </>
                      )}
                      <div>
                        <label
                          htmlFor="uploadCover"
                          className={`flex flex-row items-center ml-12 cursor-pointer mt-4 ${
                            uploadingCover
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <input
                            id="uploadCover"
                            type="file"
                            className="hidden"
                            ref={inputFile}
                            onChange={uploadCover}
                            accept="image/*"
                            disabled={uploadingCover}
                          />
                          <img
                            src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                            alt=""
                            className="w-10 h-10"
                          />
                          <div className="text-white ml-1">
                            {uploadingCover ? "Uploading..." : "Replace"}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl">Preview</h3>
                    {cidCover ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cidCover}`}
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
              )}

              <Button
                type="submit"
                className="bg-[#30D8FF] rounded-full hover:text-white text-black"
              >
                {loading ? "Loading..." : "Launch"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
