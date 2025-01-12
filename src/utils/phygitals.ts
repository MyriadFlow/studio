import { z } from "zod";

// Initial form schema for rare items (first page)
export const baseFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .regex(/^[a-zA-Z0-9\s]*$/, {
      message: "Name must only contain letters and numbers",
    }),
  category: z.array(z.string()),
  price: z.string().min(1, { message: "Price must be provided" }),
  image: z.string().optional(),
  brand_name: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Details form schema (second page)
export const detailsFormSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters",
    })
    .max(1000, {
      message: "Description should be less than 1000 words",
    }),
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
  product_info: z.string(),
  royality: z.string(),
  quantity: z.number(),
  size_option: z.number(),
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
