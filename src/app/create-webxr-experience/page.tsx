"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Button,
  Checkbox,
  Input,
  Navbar,
  PreviewIcon,
  Textarea,
  Form,
  UploadIcon,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@readyplayerme/visage";
import { NFTStorage } from "nft.storage";
import { v4 as uuidv4 } from "uuid";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PauseIcon, PlayIcon, DownArrowIcon, UpArrowIcon } from "@/components/ui/icons";
import ColorPicker from "@/components/ui/ColorPicker";
import { Canvas } from "@react-three/fiber";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API!;
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_KEY!;
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
  silver_reward: z.string().min(1, { message: "Silver reward must be provided" }),
  bronze_reward: z.string().min(1, { message: "Bronze reward must be provided" }),
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
  const router = useRouter();
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
  const [prompt, setPrompt] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [voices, setVoices] = useState([]);
  const [playingVoice, setPlayingVoice] = useState("");
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [color, setColor] = useState("#2563eb");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [btnColor, setBtnColor] = useState("#000000");
  const [btnTextColor, setBtnTextColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#e1e1e1");

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("https://api.elevenlabs.io/v1/voices", {
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch voices");
        }

        const data = await response.json();
        setVoices(data.voices);
      } catch (error) {
        console.error("Error fetching voices:", error);
        toast.error("Failed to fetch voices!");
      }
    };

    fetchVoices();
  }, []);

  const inputFile = useRef(null);

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
  const elevenLabsApiUrl = process.env.NEXT_PUBLIC_ELEVENLABS_URI;

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
  const fetchWithErrorHandling = async (
    url: string,
    options: RequestInit,
    successMessage: string
  ) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        toast.success(successMessage);
        return data;
      } else {
        const errorMessage = data.error || "Something went wrong!";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return null;
    }
  };

  const handleCreateAgent = async () => {
    if (!prompt || !firstMessage || !voiceId || !agentName) {
      toast.error("Please fill all the fields!");
      return null;
    }

    const payload = {
      conversation_config: {
        agent: {
          server: {
            url: "https://your-server-url.com",
            server_events: ["turn"],
            secret: "your-secret-key",
            timeout: 5,
            num_retries: 2,
            error_message:
              "I encountered an internal error while handling your request and cannot respond at the moment.",
          },
          prompt: {
            prompt,
            llm: "gpt-4o-mini",
            temperature: 0,
            max_tokens: -1,
            tools: [
              {
                type: "webhook",
                name: "myWebhookTool",
                description: "This tool integrates with a webhook API",
                placeholder_statement: "Please provide the necessary input.",
                api_schema: {
                  url: "https://api.example.com/webhook",
                  method: "GET",
                  path_params_schema: {},
                  query_params_schema: {
                    properties: {
                      param1: {
                        type: "string",
                        description: "Description of param1",
                      },
                    },
                    required: ["param1"],
                  },
                  request_headers: {
                    Authorization: "Bearer your-token",
                  },
                },
              },
            ],
            knowledge_base: [{ type: "file", name: "exampleFile", id: "file-id" }],
          },
          first_message: firstMessage,
          language: "en",
        },
        asr: { quality: "high", provider: "elevenlabs", user_input_audio_format: "pcm_16000" },
        turn: { turn_timeout: 7 },
        tts: {
          model_id: "eleven_turbo_v2",
          voice_id: voiceId,
          agent_output_audio_format: "pcm_16000",
          stability: 0.5,
          similarity_boost: 0.8,
        },
        conversation: { max_duration_seconds: 600 },
      },
      platform_settings: {
        widget: {
          variant: "compact",
          avatar: { type: "orb", color_1: "#2792dc", color_2: "#9ce6e6" },
          custom_avatar_path: parsedData?.url,
          bg_color: bgColor,
          text_color: textColor,
          btn_color: btnColor,
          btn_text_color: btnTextColor,
          border_color: borderColor,
          border_radius: 123,
          btn_radius: 123,
          action_text: "Start Chat",
        },
      },
      name: agentName,
    };

    return fetchWithErrorHandling(
      `${elevenLabsApiUrl}convai/agents/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify(payload),
      },
      "Agent created successfully!"
    );
  };

  const updateBrand = async (agentId: string) => {
    const BrandId = localStorage.getItem("BrandId");
    if (!BrandId) {
      toast.error("Failed to find BrandId in local storage. Deleting the agent...");

      await axios.delete(`${elevenLabsApiUrl}agents/${agentId}`, {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      });

      toast.success("Agent successfully deleted from ElevenLabs.");
      return null;
    }

    const payload = { agent_id: agentId };

    return fetchWithErrorHandling(
      `${apiUrl}brands/${BrandId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      "Brand updated successfully!"
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // console.log("Form submitted", values);

    const AgentResponse = await handleCreateAgent();
    // console.log("AgentResponse:", AgentResponse);
    // console.log("AgentResponse.agent_id:", AgentResponse.agent_id);

    if (AgentResponse?.agent_id) {
      await updateBrand(AgentResponse.agent_id);
    } else {
      console.error("Failed to create AI Agent experience or Agent ID is missing.");
      toast.error("Failed to create AI Agent experience or Agent ID is missing.");
    }

    try {
      // console.log("Starting AI Agent submission...");
      const webxrPayload = {
        ...values,
        free_nft_image: giveNFTs ? `ipfs://${cidCover}` : "",
        customizations: JSON.stringify({ data: values.customizations }),
        phygital_id: PhygitalId,
        chaintype_id: uuidv4(),
      };

      const response = await fetchWithErrorHandling(
        `${apiUrl}webxr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webxrPayload),
        },
        "AI Agent experience created successfully!"
      );

      if (response) {
        router.push("/congratulations");
      }
    } catch (error) {
      console.error("WebXR submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handlePlayPause = (voiceId: any, previewUrl: any, voice: any) => {
    if (playingVoice === voiceId) {
      // Pause the currently playing audio
      const audio = document.getElementById(voiceId) as HTMLAudioElement;
      audio?.pause();
      setPlayingVoice("");
    } else {
      // Play the selected audio and pause any other
      voices.forEach((voice: any) => {
        const audio = document.getElementById(voice.voice_id) as HTMLAudioElement;
        if (audio && voice.voice_id !== voiceId) {
          audio.pause();
        }
      });

      const audio = document.getElementById(voiceId) as HTMLAudioElement;
      audio?.play();
      setPlayingVoice(voiceId);
      setVoiceId(voiceId);
      setVoiceName(voice);
    }
  };

  // console.log("isVoiceDropdownOpen", isVoiceDropdownOpen);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="min-h-screen">
        <div className="px-16 py-8 border-b text-black border-black">
          <h1 className="font-bold uppercase text-3xl mb-4">AI AGENT EXPERIENCE</h1>
        </div>
        <Form {...form}>
          <form id="webxr-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="py-4 px-32 flex flex-col gap-12">
              {/* Avatar Preview Section */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl">
                  Congratulations on creating your avatar! You can now complete your AI Agent
                  experience.
                </h3>
                <div>
                  <h3 className="text-xl">Avatar preview</h3>
                  {parsedData.url ? (
                    <Avatar modelSrc={parsedData.url} cameraInitialDistance={1.5} />
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
                    {formatError && <p className="text-red-500 mt-2">{formatError}</p>}
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
                    <p className="text-red-700">You must upload a 3D model (GLB file)</p>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl">Preview</h3>
                  {cid ? (
                    <div className="border border-[#D9D8D8] h-60 w-80">
                      <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <Model url={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`} />
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

              <div className="">
                <h1 className="text-xl font-bold mb-4">Create Agent</h1>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Agent Name</label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter the first message"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    The first message the agent will say. If empty, the agent will wait for the user
                    to start the conversation <span className="">*</span>
                  </label>
                  <Input
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Enter the first message"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter the prompt"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Voice</label>
                  <div
                    className="cursor-pointer flex justify-between items-center border rounded p-2 w-full"
                    onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                  >
                    <div className="">
                      <span>{voiceName ? voiceName : "Select a voice"}</span>
                    </div>
                    {!isVoiceDropdownOpen ? <DownArrowIcon /> : <UpArrowIcon />}
                  </div>

                  {isVoiceDropdownOpen && (
                    <div className="mb-4 pt-4 bg-gray-50">
                      {voices.map((voice: any) => (
                        <>
                          {" "}
                          <div
                            key={voice.voice_id}
                            className={`${
                              playingVoice === voice.voice_id ? "bg-gray-200" : ""
                            } flex items-center gap-4 cursor-pointer hover:bg-gray-200 py-2`}
                            onClick={() => {
                              setVoiceId(voice.voice_id);
                              setVoiceName(voice.name);
                              handlePlayPause(voice.voice_id, voice.preview_url, voice?.name);
                              // setIsVoiceDropdownOpen(!isVoiceDropdownOpen);
                            }}
                          >
                            <audio id={voice.voice_id} src={voice.preview_url}></audio>
                            <button
                              value={voiceId}
                              className={`px-4 py-1 text-white rounded `}
                              // onClick={() =>
                              //   handlePlayPause(voice.voice_id, voice.preview_url, voice?.name)
                              // }
                            >
                              {playingVoice === voice.voice_id ? (
                                <PauseIcon className="w-6 h-6" />
                              ) : (
                                <PlayIcon className="w-6 h-6" />
                              )}
                            </button>
                            <span>{voice.name}</span>
                          </div>
                          <hr />
                        </>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mb-4 mt-10 space-x-4 flex justify-between items-center">
                  {/* Background Color Picker */}
                  <ColorPicker
                    id="bg-color-input"
                    label="Choose background color"
                    value={bgColor}
                    onChange={setBgColor}
                  />

                  {/* Text Color Picker */}
                  <ColorPicker
                    id="text-color-input"
                    label="Choose Text Color"
                    value={textColor}
                    onChange={setTextColor}
                  />

                  {/* Button Color Picker */}
                  <ColorPicker
                    id="btn-color-input"
                    label="Choose Button Color"
                    value={btnColor}
                    onChange={setBtnColor}
                  />

                  {/* Button Text Color Picker */}
                  <ColorPicker
                    id="btn-text-color-input"
                    label="Choose button text color"
                    value={btnTextColor}
                    onChange={setBtnTextColor}
                  />

                  {/* Border Color Picker */}
                  <ColorPicker
                    id="border-color-input"
                    label="Choose border color"
                    value={borderColor}
                    onChange={setBorderColor}
                  />
                </div>

                {/* <Button onClick={handleCreateAgent}>Create Agent</Button> */}
              </div>

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
