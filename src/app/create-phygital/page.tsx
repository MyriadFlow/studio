"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import {
  Button,
  Checkbox,
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
import { TagsInput } from "@/components/TagsInput";
import {
  baseFormSchema,
  categories,
  PhygitalData,
} from "../../utils/phygitals";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import SizeOptions from "@/components/SizeOptions";

export default function CreatePhygital() {
  const [files, setFiles] = useState<File[]>([]);
  const [cids, setCids] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sizeData, setSizeData] = useState<{
    option: number;
    details: Array<{
      size: string;
      quantity: number;
      additional_details: string;
    }>;
  }>({
    option: 0,
    details: [],
  });

  const inputFile = useRef(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof baseFormSchema>>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      name: "",
      category: [],
      description: "",
      price: "",
      royality: "",
      product_info: "",
      image: "",
      brand_name: "",
      tags: [],
      size_option: 0,
      size_details: [],
    },
  });

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCids((prev) => [...prev, resData.IpfsHash]);
      toast.success("Upload Completed!", {
        position: "top-left",
      });
    } catch (e) {
      console.error(e);
      toast.error("Trouble uploading file");
    } finally {
      setUploading(false);
    }
  };

  const uploadImages = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      if (files.length + selectedFiles.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((file) => uploadFile(file));
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCids((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (sizeData: {
    option: number;
    details: Array<{
      size: string;
      quantity: number;
      additional_details: string;
    }> | null;
  }) => {
    // Update form values
    form.setValue("size_option", sizeData.option);
    form.setValue("size_details", sizeData.details || []);

    // Optional: Store in local state if needed
    setSizeData({
      option: sizeData.option,
      details: sizeData.details || [],
    });
  };

  async function onSubmit(values: z.infer<typeof baseFormSchema>) {
    if (cids.length === 0) {
      setImageError(true);
      return;
    }

    try {
      const brand_name = localStorage.getItem("brand_name");
      const phygitalData: PhygitalData = {
        type: "regular",
        name: values.name,
        brand_name: brand_name || "",
        category: values.category,
        description: values.description,
        price: values.price,
        royality: values.royality,
        product_info: values.product_info,
        images: cids.map((cid) => "ipfs://" + cid),
        tags: tags,
        size_option: sizeData.option,
        size_details: sizeData.details,
      };

      localStorage.setItem("phygitalData", JSON.stringify(phygitalData));
      setLoading(true);
      router.push("/create-phygital-detail");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save data");
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
          <h1 className="font-bold uppercase text-3xl mb-4">Create Phygital</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-4 px-32 flex flex-col gap-12">
              <h2 className="text-xl font-bold">Chain: Base Network</h2>

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">
                      Phygital Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 bg-[#0000001A] rounded w-2/5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="text-xl mb-6">
                  Categories* &nbsp; &nbsp;
                  <span className="text-[#757575] text-base">
                    Choose all that apply
                  </span>
                </Label>
                <FormField
                  control={form.control}
                  name="category"
                  render={() => (
                    <FormItem className="flex justify-between mt-8 flex-wrap">
                      {categories.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem
                              key={item.id}
                              className="flex items-baseline space-x-3 space-y-6 basis-[30%]"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <Label className="text-xl mb-6">
                        Tags* &nbsp; &nbsp;
                        <span className="text-[#757575] text-base">
                          Add max 5 tags that represent your product
                        </span>
                      </Label>
                      <TagsInput selectedTags={setTags} tags={[]} />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Description*
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-0 bg-[#0000001A]"
                        placeholder="Describe your product in detail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price and Royalty Fields */}
              <div className="flex items-center justify-between gap-8">
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl mb-6">Price*</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            className="border-0 bg-[#0000001A] rounded"
                            type="number"
                            step="0.000001"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <span>USD</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="quantity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl mb-6">Quantity*</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            className="border-0 bg-[#0000001A] rounded"
                            type="number"
                            step="1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSizeData({
                                option: 0,
                                details: [],
                              });
                            }}
                          />
                        </FormControl>
                        <span>Items</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="royality"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl mb-6">Royalty</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            className="border-0 bg-[#0000001A] rounded"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <span>%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Information Field */}
              <FormField
                name="product_info"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4">
                      Product Information for AI*
                    </FormLabel>
                    <FormDescription>
                      Fill this field if you want to create an AI-powered brand
                      ambassador. Provide detailed information about your
                      product that can be used to generate AI responses.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        className="border-0 bg-[#0000001A] min-h-[150px]"
                        placeholder="Enter detailed product information, features, and unique selling points"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SizeOptions
                variant="phygital"
                onSizeChange={handleSizeChange}
                totalQuantity={Number(form.getValues("quantity")) || 0}
              />

              {/* Image Upload Section */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl">Upload Images* (Max 4)</h3>
                  <div className="border border-dashed border-black h-60 w-[32rem] flex flex-col items-center justify-center p-6">
                    <UploadIcon />
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#30D8FF]"></div>
                        <p className="mt-2">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <p>Drag files here to upload or choose files</p>
                        <p>Recommended size 1024 x 1024 px</p>
                      </>
                    )}
                    <div>
                      <label
                        htmlFor="upload"
                        className={`flex flex-row items-center ml-12 cursor-pointer mt-4 ${
                          uploading || files.length >= 4
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input
                          id="upload"
                          type="file"
                          multiple
                          className="hidden"
                          ref={inputFile}
                          onChange={uploadImages}
                          accept="image/*"
                          disabled={uploading || files.length >= 4}
                        />
                        <img
                          src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
                          alt=""
                          className="w-10 h-10"
                        />
                        <div className="text-white ml-1">
                          {uploading ? "Uploading..." : "Add Images"}
                        </div>
                      </label>
                    </div>
                  </div>
                  {imageError && (
                    <p className="text-red-700">
                      You have to upload at least one image
                    </p>
                  )}
                </div>

                {/* Preview Section */}
                <div className="grid grid-cols-2 gap-4">
                  {cids.map((cid, index) => (
                    <div key={cid} className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                        alt={`preview image ${index + 1}`}
                        className="object-cover rounded-lg h-40 w-full"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {cids.length === 0 && (
                    <div className="border border-[#D9D8D8] h-40 flex flex-col items-center justify-center p-6">
                      <PreviewIcon />
                      <p>Preview after upload</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-fit bg-[#30D8FF] rounded-full hover:text-white text-black"
              >
                {loading ? "Loading..." : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
