"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface CloudinaryUploadProps {
  url?: string;
  folder?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function CloudinaryUpload({
  url,
  folder = "portfolio",
  onUpload,
  label = "Image",
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ folder }),
      });
      const { signature, timestamp, apiKey, cloudName } = await signRes.json();

      const fd = new FormData();
      fd.append("file",      file);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("api_key",   apiKey);
      fd.append("folder",    folder);

      const upRes  = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await upRes.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        setError("Upload failed. Check Cloudinary credentials.");
      }
    } catch {
      setError("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>

      {url && (
        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#2d3748]">
          <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      {url && (
        <p className="text-xs text-slate-500 break-all max-w-sm">{url}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 rounded-lg bg-[#2d3748] hover:bg-[#384561] text-slate-200 text-sm transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading…" : url ? "Change Image" : "Upload Image"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
