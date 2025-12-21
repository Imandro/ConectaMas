"use client";

import { useState, useRef } from "react";
import { Camera, Edit2, User } from "lucide-react";
import { updateProfileImage } from "./actions";

interface ProfileHeaderProps {
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
        spiritualLevel: string;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const [image, setImage] = useState(user.image);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation (Max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen es demasiado grande. Máximo 2MB.");
            return;
        }

        setIsUploading(true);

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                // Optimistic update
                setImage(base64String);
                await updateProfileImage(base64String);
            } catch (error) {
                console.error("Error upload:", error);
                alert("Error al subir la imagen.");
                setImage(user.image); // Revert
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="card border-0 shadow-sm bg-white rounded-4 p-4 mb-4">
            <div className="d-flex align-items-center gap-4">
                <div className="position-relative cursor-pointer" onClick={handleImageClick}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {image ? (
                        <div
                            className="bg-primary rounded-circle overflow-hidden shadow-sm"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <img src={image} alt="Profile" className="w-100 h-100 object-fit-cover" />
                        </div>
                    ) : (
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center display-4 fw-bold shadow-sm" style={{ width: '80px', height: '80px' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}

                    <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm border">
                        <Camera size={16} className="text-secondary" />
                    </div>
                </div>

                <div>
                    <h4 className="fw-bold mb-1">{user.name || 'Usuario'}</h4>
                    <p className="text-muted mb-0">{user.email}</p>
                    <span className="badge bg-light text-secondary mt-2 rounded-pill border">
                        {user.spiritualLevel || "Explorador"}
                    </span>
                </div>
            </div>
        </div>
    );
}
