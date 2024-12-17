import { z } from "zod";

// Base schema for both phygital and rare items
export const baseFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .regex(/^[a-zA-Z0-9\s]*$/, {
      message: "Name must only contain letters and numbers",
    }),
  category: z.array(z.string()) || z.string(),
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters",
    })
    .max(1000, {
      message: "Description should be less than 1000 words",
    }),
  price: z.string().min(1, { message: "Price must be provided" }),
  royality: z.string(),
  product_info: z.string().min(2, {
    message: "Product Information must be at least 2 characters",
  }),
  image: z.string(),
  brand_name: z.string(),
  tags: z.array(z.string()).optional(),
  quantity: z.number(),
  color: z.string().min(1, "Color is required"),
  size_option: z.number(),
  size_details: z
    .array(
      z.object({
        size: z.string(),
        quantity: z.number(),
        additional_details: z.string().optional(),
      })
    )
    .optional(),
});

// Details form schema
export const detailsFormSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size_details: z.array(
    z.object({
      size: z.string(),
      quantity: z.number(),
      additional_details: z.string().optional(),
    })
  ),
  weight: z.string().min(1, "Weight is required"),
  material: z.string().min(1, "Material is required"),
  usage: z.string().optional(),
  care_instructions: z.string().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  origin_country: z.string().min(1, "Country of origin is required"),
});

export const categories = [
  { id: "fashion", label: "Fashion" },
  { id: "home & decor", label: "Home & Decor" },
  { id: "sustainable goods", label: "Sustainable goods" },
  { id: "collectibles", label: "Collectibles" },
  { id: "functional items", label: "Functional items" },
  { id: "tech enabled", label: "Tech enabled" },
  { id: "art & photography", label: "Art & Photography" },
  { id: "luxury goods", label: "Luxury goods" },
  { id: "music lovers", label: "Music lovers" },
];

export interface FormDataEntry {
  title: string;
  description: string;
}

export interface TagsInputProps {
  selectedTags: (tags: string[]) => void;
  tags: string[];
}

export type PhygitalType = "regular" | "rare";

export interface PhygitalData {
  name: string;
  brand_name: string;
  category: Array<string>;
  tags: Array<string>;
  description: string;
  price: string;
  quantity?: number;
  royality: string;
  images: Array<string>;
  product_info?: string;
  product_url?: string;
  metadata_uri?: string;
  graph_url?: string;
  elevate_region?: string;
  type?: string;
  size_option?: number;
  size_details?: Array<{
    size: string;
    quantity: number;
    additional_details: string;
  }>;
}
