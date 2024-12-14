import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compressImage = async (
  imageFile: File,
  targetWidth: number,
  targetHeight: number,
  quality: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        // Set the target canvas size
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the image to fit within the specified dimensions
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Compress the image
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], imageFile.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject("Failed to compress image");
            }
          },
          "image/jpeg", // Output format
          quality // Compression quality (0 to 1)
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};
