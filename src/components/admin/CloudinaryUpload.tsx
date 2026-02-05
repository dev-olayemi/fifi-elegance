import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dgpu70zzs";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "fifi_fashion";

const CloudinaryUpload = ({ images, onImagesChange, maxImages = 5 }: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "fifi-fashion-products");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images. Please check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-navy text-cream text-xs rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <label
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold transition-colors ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-gold animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-muted rounded-full mb-3">
                  <Upload className="w-6 h-6 text-gold" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Click to upload images
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 10MB ({images.length}/{maxImages})
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            First image will be used as the main product image
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
