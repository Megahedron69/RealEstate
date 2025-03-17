import path from "path";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase";
import { ApiError } from "../middlewares/errorMiddleware";

export const uploadImagesToSupabase = async (
  images: any[] | any | undefined,
  propertyId: string
): Promise<string[]> => {
  try {
    if (!images) return [];
    const imageFiles = Array.isArray(images) ? images : [images];
    const imageUrls: string[] = [];
    for (const image of imageFiles) {
      const ext = path.extname(image.name);
      const fileName = `${uuidv4()}${ext}`;
      const filePath = `properties/${propertyId}/${fileName}`;

      const { error } = await supabase.storage
        .from("propertyImages")
        .upload(filePath, image.data, { contentType: image.mimetype });

      if (error) {
        console.error("Image upload failed:", error.message);
        throw new Error("Image upload failed");
      }
      const { data } = supabase.storage
        .from("propertyImages")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      if (publicUrl) {
        imageUrls.push(publicUrl);
      } else {
        console.error("Failed to get public URL for:", filePath);
      }
    }

    return imageUrls;
  } catch (error: any) {
    throw new ApiError(500, "Failed to upload file", [
      { reason: error.message },
    ]);
  }
};
