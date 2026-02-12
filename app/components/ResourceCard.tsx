"use client";

import { Download, FileText, Lock } from 'lucide-react';

interface ResourceCardProps {
    resource: {
        id: string;
        title: string;
        description: string;
        type: string;
        url: string;
        category: string;
        downloadCount: number;
        isPremium: boolean;
    };
}

export default function ResourceCard({ resource }: ResourceCardProps) {
    const handleDownload = async () => {
        // Track download
        try {
            await fetch(`/api/resources/${resource.id}/download`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error tracking download:', error);
        }

        // Open resource
        window.open(resource.url, '_blank');
    };

    return (
        <div
            className="card border-0 shadow-sm h-100 bg-white hover-scale transition-all"
            style={{ borderRadius: '24px' }}
        >
            <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3 mb-4">
                    <div className="bg-danger-subtle text-danger p-3 rounded-4">
                        <FileText size={32} />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="badge bg-light text-muted fw-normal px-3 py-1 rounded-pill small">
                                PDF • {resource.category}
                            </span>
                            {resource.isPremium && (
                                <div className="text-warning d-flex align-items-center gap-1">
                                    <Lock size={14} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PREMIUM</span>
                                </div>
                            )}
                        </div>
                        <h6 className="fw-bold text-dark fs-5 mb-2">{resource.title}</h6>
                        <p className="text-muted small mb-0 lh-base" style={{ fontSize: '0.85rem' }}>
                            {resource.description}
                        </p>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-auto">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                        <Download size={14} />
                        <span>{resource.downloadCount} descargas</span>
                    </div>
                    <button
                        onClick={handleDownload}
                        className={`btn btn-sm ${resource.isPremium ? 'btn-warning text-dark' : 'btn-primary'} rounded-pill px-4 fw-bold`}
                    >
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    );
}
