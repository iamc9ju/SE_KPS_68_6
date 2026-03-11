"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

interface ImageUploadProps {
    currentImageUrl?: string | null;
    onUploadSuccess?: (imageUrl: string) => void;
    sizeClasses?: string;
}

export default function ImageUpload({ currentImageUrl, onUploadSuccess, sizeClasses = "w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, setUser } = useAuthStore();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/auth/avatar", formData);

            // Backend ResponseInterceptor wraps data in a 'data' field
            const newImageUrl = response.data.data.imageUrl;

            if (!newImageUrl) {
                throw new Error("No image URL received from server");
            }

            setPreviewUrl(newImageUrl);

            // Update auth store with new profile image URL
            if (user) {
                setUser({ ...user, profileImageUrl: newImageUrl });
            }

            if (onUploadSuccess) {
                onUploadSuccess(newImageUrl);
            }
        } catch (error: any) {
            console.error("Failed to upload image:", error);
            // Revert preview on failure
            setPreviewUrl(currentImageUrl || null);
            // Only show alert for non-auth errors (auth errors auto-redirect to /login)
            if (error?.response?.status !== 401) {
                alert("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`relative group ${sizeClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm relative">
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                ) : user?.profileImageUrl ? (
                    <Image
                        src={user.profileImageUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-xl">
                        {(user?.firstName?.[0] || "U").toUpperCase()}
                    </div>
                )}
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF6A2C] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#e55a1d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <Camera className="w-3 h-3" />
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
