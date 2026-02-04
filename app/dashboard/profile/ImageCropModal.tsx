"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Search } from 'lucide-react';

interface ImageCropModalProps {
    image: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}

export default function ImageCropModal({ image, onCropComplete, onClose }: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop: any) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        // Set dimensions to 400x400 for optimization
        canvas.width = 400;
        canvas.height = 400;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            400,
            400
        );

        return canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality for smaller size
    };

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4"
            style={{
                zIndex: 2000,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                className="bg-white rounded-4 shadow-lg w-100 d-flex flex-column"
                style={{
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h6 className="fw-bold mb-0">Recortar Foto</h6>
                    <button className="btn btn-link text-muted p-0" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="position-relative w-100 flex-grow-1" style={{ minHeight: '300px', backgroundColor: '#1a1a1a' }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteInternal}
                    />
                </div>

                {/* Controls Area */}
                <div className="p-3 p-md-4 bg-white border-top">
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small text-muted d-flex align-items-center gap-2 mb-0">
                                <Search size={14} /> Zoom
                            </label>
                            <span className="badge bg-light text-dark">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            className="form-range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                    </div>

                    <div className="d-grid">
                        <button
                            className="btn btn-primary rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                            onClick={handleSave}
                        >
                            <Check size={18} /> Aplicar Recorte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
