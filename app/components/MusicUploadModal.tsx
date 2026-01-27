"use client";

import React, { useState } from "react";
import { X, Music, Upload, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useLanguage } from "../LanguageContext";

interface MusicUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export default function MusicUploadModal({ isOpen, onClose, onUploadSuccess }: MusicUploadModalProps) {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "audio/mpeg") {
                toast.error(t.music_upload.error_mp3);
                setFile(null); // Clear file if invalid
                return;
            }
            setFile(selectedFile);
            setError("");
            // Auto-fill title from filename if empty
            if (!title) {
                setTitle(selectedFile.name.replace(".mp3", ""));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title || !artist) {
            toast.error(t.music_upload.error_fields);
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("artist", artist);

            const response = await fetch("/api/songs/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || t.music_upload.error_upload);
            }

            onUploadSuccess();
            onClose();
            toast.success(t.music_upload.success_message);
            // Reset form
            setFile(null);
            setTitle("");
            setArtist("");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                style={{ zIndex: 1050, backgroundColor: 'rgba(11, 27, 50, 0.8)' }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-4 w-100 shadow-2xl overflow-hidden"
                    style={{ maxWidth: '500px' }}
                >
                    {/* Header */}
                    <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center">
                        <div className="text-start">
                            <h5 className="fw-bold m-0">{t.music_upload.title}</h5>
                            <p className="text-white-50 small m-0 uppercase letter-spacing-1">{t.music_upload.subtitle}</p>
                        </div>
                        <button onClick={onClose} className="btn btn-link text-white p-0">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-4 text-primary">
                        {error && (
                            <div className="alert alert-danger mb-4 small py-2 d-flex align-items-center gap-2">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="small fw-bold mb-2 d-block">{t.music_upload.file_label}</label>
                            <div className="position-relative">
                                <input
                                    type="file"
                                    accept=".mp3"
                                    onChange={handleFileChange}
                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                    style={{ zIndex: 2 }}
                                />
                                <div className={`p-4 rounded-3 border-2 border-dashed text-center transition-all ${file ? 'border-success bg-success bg-opacity-10' : 'border-light-subtle bg-light bg-opacity-50'}`}>
                                    {file ? (
                                        <>
                                            <Check size={24} className="text-success mb-2" />
                                            <p className="small fw-bold m-0">{t.music_upload.file_selected}</p>
                                            <p className="extra-small text-muted text-truncate m-0">{file.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-primary mb-2" />
                                            <p className="small text-muted m-0">{t.music_upload.file_placeholder}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="small fw-bold mb-2 d-block">{t.music_upload.title_label}</label>
                            <input
                                type="text"
                                className="form-control rounded-3 border-light-subtle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t.music_upload.title_placeholder}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="small fw-bold mb-2 d-block">{t.music_upload.artist_label}</label>
                            <input
                                type="text"
                                className="form-control rounded-3 border-light-subtle"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                placeholder={t.music_upload.artist_placeholder}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading || !file}
                            className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    {t.music_upload.button_uploading}
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    {t.music_upload.button_publish}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
