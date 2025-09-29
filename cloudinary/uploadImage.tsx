"use client";

import { useState } from "react";
import Image from "next/image";

const UploadImage = ({
  setUploadedUrl,
}: {
  setUploadedUrl: (url: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Upload Result:", data);
      setUploadedUrl(data.secure_url); // ambil URL Cloudinary
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Preview + Upload ke Cloudinary</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="mt-4">
          <p>Preview sebelum upload:</p>
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload ke Cloudinary
        </button>
      )}
    </div>
  );
};

export default UploadImage;
