"use client";

import React, { useState } from "react";
import { X, Upload, Music, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MusicUploadModal({ isOpen, onClose, onSuccess }: MusicUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "audio/mpeg") {
                setError("Por favor selecciona un archivo MP3.");
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

    const handleUpload = async () => {
        if (!file || !title || !artist) {
            setError("Todos los campos son obligatorios.");
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
                throw new Error(data.error || "Error al subir la canción");
            }

            onSuccess();
            onClose();
            // Reset form
            setFile(null);
            setTitle("");
            setArtist("");
        } catch (err: any) {
            setError(err.message);
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
                        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                            <Music size={24} className="text-warning" /> Subir Música
                        </h4>
                        <button onClick={onClose} className="btn btn-link text-white p-0">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 text-primary">
                        {error && (
                            <div className="alert alert-danger mb-4 small py-2">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="small fw-bold mb-2 d-block">ARCHIVO MP3</label>
                            <div
                                className={`border-2 border-dashed rounded-4 p-4 text-center cursor-pointer transition-all ${file ? 'border-success bg-success bg-opacity-5' : 'border-light-subtle hover-bg-light'
                                    }`}
                                onClick={() => document.getElementById('music-file')?.click()}
                            >
                                <input
                                    type="file"
                                    id="music-file"
                                    className="d-none"
                                    accept="audio/mpeg"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <div className="text-success">
                                        <Save size={32} className="mb-2" />
                                        <div className="small fw-bold">{file.name}</div>
                                    </div>
                                ) : (
                                    <div className="text-muted">
                                        <Upload size={32} className="mb-2 opacity-50" />
                                        <div className="small">Haz click para seleccionar archivo</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="small fw-bold mb-2 d-block">TÍTULO</label>
                            <input
                                type="text"
                                className="form-control rounded-3 border-light-subtle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nombre de la canción"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="small fw-bold mb-2 d-block">ARTISTA</label>
                            <input
                                type="text"
                                className="form-control rounded-3 border-light-subtle"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                placeholder="Nombre del artista o ministerio"
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !file}
                            className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Publicar Canción
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
