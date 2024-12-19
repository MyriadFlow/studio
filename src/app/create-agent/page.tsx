"use client";
import React, { useState, useEffect } from "react";
import { Navbar, Button, Input, Textarea } from "@/components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PauseIcon, PlayIcon, DownArrowIcon, UpArrowIcon } from "@/components/ui/icons";

const CreateAgent = () => {
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
            "xi-api-key": "sk_6939735f214e71262950c91628fb36735ed360ca31f77587",
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

  const handleCreateAgent = async () => {
    if (!prompt || !firstMessage || !voiceId || !agentName) {
      toast.error("Please fill all the fields!");
      return;
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
            prompt: prompt,
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
            knowledge_base: [
              {
                type: "file",
                name: "exampleFile",
                id: "file-id",
              },
            ],
          },
          first_message: firstMessage,
          language: "en",
        },
        asr: {
          quality: "high",
          provider: "elevenlabs",
          user_input_audio_format: "pcm_16000",
          keywords: ["example"],
        },
        turn: {
          turn_timeout: 7,
        },
        tts: {
          model_id: "eleven_turbo_v2",
          voice_id: voiceId,
          agent_output_audio_format: "pcm_16000",
          optimize_streaming_latency: 0,
          stability: 0.5,
          similarity_boost: 0.8,
        },
        conversation: {
          max_duration_seconds: 600,
          client_events: ["conversation_initiation_metadata"],
        },
      },
      platform_settings: {
        auth: {
          enable_auth: false,
        },
        evaluation: {
          criteria: [
            {
              id: "example-id",
              name: "example-criteria",
              type: "prompt",
              conversation_goal_prompt: "Evaluate based on this goal.",
            },
          ],
        },
        widget: {
          variant: "compact",
          avatar: {
            type: "orb",
            color_1: "#2792dc",
            color_2: "#9ce6e6",
          },
          custom_avatar_path: "https://example.com/avatar.png",
          bg_color: bgColor,
          text_color: textColor,
          btn_color: btnColor,
          btn_text_color: btnTextColor,
          border_color: borderColor,
          focus_color: "#000000",
          border_radius: 123,
          btn_radius: 123,
          action_text: "Start Chat",
          start_call_text: "Call Agent",
          end_call_text: "End Call",
          expand_text: "Expand",
          listening_text: "Listening...",
          speaking_text: "Speaking...",
        },
        data_collection: {},
      },
      name: agentName,
    };

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": "sk_6939735f214e71262950c91628fb36735ed360ca31f77587",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Agent created successfully!");
        console.log(data);
      } else {
        toast.error(`Error: ${data.error || "Something went wrong!"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create the agent. Please try again.");
    }
  };
  console.log("isVoiceDropdownOpen", isVoiceDropdownOpen);
  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="p-4">
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
            The first message the agent will say. If empty, the agent will wait for the user to
            start the conversation <span className="">*</span>
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
            <div className="mb-4 pt-4 space-y-2 bg-gray-50">
              {voices.map((voice: any) => (
                <>
                  {" "}
                  <div
                    key={voice.voice_id}
                    className="flex items-center gap-4 cursor-pointer"
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
        <div className="mb-4 space-x-4 flex justify-around items-center">
          {/* Background Color Picker */}
          <div>
            <label htmlFor="bg-color-input" className="block text-sm font-medium mb-2">
              Background Color
            </label>
            <input
              type="color"
              id="bg-color-input"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
              title="Choose background color"
            />
          </div>

          {/* Text Color Picker */}
          <div>
            <label htmlFor="text-color-input" className="block text-sm font-medium mb-2">
              Text Color
            </label>
            <input
              type="color"
              id="text-color-input"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
              title="Choose text color"
            />
          </div>

          {/* Button Color Picker */}
          <div>
            <label htmlFor="btn-color-input" className="block text-sm font-medium mb-2">
              Button Color
            </label>
            <input
              type="color"
              id="btn-color-input"
              value={btnColor}
              onChange={(e) => setBtnColor(e.target.value)}
              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
              title="Choose button color"
            />
          </div>

          {/* Button Text Color Picker */}
          <div>
            <label htmlFor="btn-text-color-input" className="block text-sm font-medium mb-2">
              Button Text Color
            </label>
            <input
              type="color"
              id="btn-text-color-input"
              value={btnTextColor}
              onChange={(e) => setBtnTextColor(e.target.value)}
              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
              title="Choose button text color"
            />
          </div>

          {/* Border Color Picker */}
          <div>
            <label htmlFor="border-color-input" className="block text-sm font-medium mb-2">
              Border Color
            </label>
            <input
              type="color"
              id="border-color-input"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
              title="Choose border color"
            />
          </div>
        </div>

        <Button onClick={handleCreateAgent}>Create Agent</Button>
      </main>
    </>
  );
};

export default CreateAgent;
