"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Navbar,
  Textarea,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PlusIcon,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import FormRepeater from "react-form-repeater";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import ShippingZoneForm from "@/components/ShippingForm";
import { z } from "zod";

const apiUrl = process.env.NEXT_PUBLIC_URI;

// Define the schema for the form
const detailsFormSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size_details: z
    .array(
      z.object({
        size: z.string(),
        quantity: z.number(),
        additional_details: z.string().optional(),
      })
    )
    .optional(),
  weight: z.string().min(1, "Weight is required"),
  material: z.string().min(1, "Material is required"),
  usage: z.string().optional(),
  care_instructions: z.string().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  origin_country: z.string().min(1, "Country of origin is required"),
});

interface ShippingZone {
  zone_name: string;
  continents: string[];
  countries: string[];
  delivery_days_min: number;
  delivery_days_max: number;
  shipping_price: number;
  per_order_fee_limit: boolean;
}

export default function CreatePhygitalDetail() {
  const { address: walletAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const [phygitalData, setPhygitalData] = useState<any>(null);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [sizeDetails, setSizeDetails] = useState([
    { size: "", quantity: 0, additional_details: "" },
  ]);
  const router = useRouter();

  const form = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      color: "",
      weight: "",
      material: "",
      usage: "",
      care_instructions: "",
      manufacturer: "",
      origin_country: "",
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem("phygitalData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setPhygitalData(parsed);
    } else {
      router.push("/create-phygital");
    }
  }, [router]);

  const handleSizeDetailsChange = (data: any) => {
    setSizeDetails(data);
  };

  const handleShippingZonesChange = (zones: ShippingZone[]) => {
    setShippingZones(zones);
  };

  async function onSubmit(values: z.infer<typeof detailsFormSchema>) {
    try {
      setLoading(true);

      const phygitalId = uuidv4();
      const CollectionId = localStorage.getItem("CollectionId");
      const ChainTypeId = localStorage.getItem("ChainTypeId");

      const requestBody = {
        id: phygitalId,
        name: phygitalData?.name,
        brand_name: phygitalData?.brand_name,
        category: phygitalData?.category || {},
        tags: phygitalData?.tags || {},
        description: phygitalData?.description,
        price: parseFloat(phygitalData?.price),
        quantity: phygitalData?.quantity,
        royality: parseInt(phygitalData?.royality),
        images: phygitalData?.images || [],
        product_info: phygitalData?.product_info,
        product_url: phygitalData?.product_url,
        collection_id: CollectionId,
        chaintype_id: ChainTypeId,
        deployer_address: walletAddress,
        color: values.color,
        size_details: sizeDetails,
        weight: parseFloat(values.weight),
        material: values.material,
        usage: values.usage,
        care_instructions: values.care_instructions,
        manufacturer: values.manufacturer,
        origin_country: values.origin_country,
        metadata_uri: phygitalData?.metadata_uri || "",
        graph_url: phygitalData?.graph_url || "",
        elevate_region: phygitalData?.elevate_region || "",
        shipping_zones: shippingZones,
      };

      const response = await fetch(`${apiUrl}/phygitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response?.ok) {
        throw new Error("Failed to create phygital");
      }

      localStorage.setItem("PhygitalId", phygitalId);
      toast.success("Phygital created successfully!");
      // router.push("/create-avatar");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create phygital");
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
            Additional details for{" "}
            {phygitalData?.type === "rare" ? "Rare Item" : "Phygital"}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-4 px-32 flex flex-col gap-12">
              <FormField
                name="color"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">Colors*</FormLabel>
                    <FormDescription>
                      Use commas to separate multiple colors
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="border-0 bg-[#0000001A] rounded w-2/5"
                        placeholder="e.g., Red, Blue, Green"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div>
                <Label className="text-xl mb-6">Size Details</Label>
                <FormRepeater
                  initialValues={[
                    { size: "", quantity: 0, additional_details: "" },
                  ]}
                  onChange={handleSizeDetailsChange}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="text"
                      name="size"
                      placeholder="Size (e.g., XS, S, M)"
                      className="border-0 bg-[#0000001A] rounded"
                    />
                    <Input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      className="border-0 bg-[#0000001A] rounded"
                    />
                    <Input
                      type="text"
                      name="additional_details"
                      placeholder="Additional Details"
                      className="border-0 bg-[#0000001A] rounded"
                    />
                  </div>
                </FormRepeater>
              </div> */}

              <FormField
                name="weight"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">Weight (kg)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="border-0 bg-[#0000001A] rounded w-2/5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="material"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">Material*</FormLabel>
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

              <FormField
                name="care_instructions"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">
                      Care Instructions
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-0 bg-[#0000001A] rounded"
                        placeholder="Enter care instructions"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="usage"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mb-6">Usage</FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-0 bg-[#0000001A] rounded"
                        placeholder="Describe how to use this product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  name="manufacturer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl mb-6">
                        Manufacturer*
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
                  name="origin_country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl mb-6">Made In*</FormLabel>
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
              </div>

              <div>
                <h3 className="text-2xl mb-4">Shipping & Delivery</h3>
                <ShippingZoneForm onZonesChange={handleShippingZonesChange} />
              </div>

              <Button
                type="submit"
                className="w-fit bg-[#30D8FF] rounded-full hover:text-white text-black"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Launch Phygital"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
