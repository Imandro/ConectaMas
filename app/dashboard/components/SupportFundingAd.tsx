"use client";

import { Gift, Heart } from "lucide-react";

export default function SupportFundingAd() {
    const GOAL = 25; // $25 USD
    const CURRENT = 12; // Example: $12 collected so far (Update manually or via API later)
    const progress = (CURRENT / GOAL) * 100;

    return (
        <div className="card border-0 shadow-sm bg-primary text-white overflow-hidden position-relative">
            {/* Background pattern */}
            <div className="position-absolute top-0 end-0 p-3 opacity-10">
                <Gift size={120} />
            </div>

            <div className="card-body p-4 position-relative z-10">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-white text-primary p-2 rounded-circle shadow-sm">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h5 className="fw-bold m-0">¡Ayúdanos a llegar a la Play Store!</h5>
                        <p className="small text-white-50 m-0">Meta: Licencia de Desarrollador ($25 USD)</p>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                        <span>Recaudado: ${CURRENT}</span>
                        <span>Meta: ${GOAL}</span>
                    </div>
                    <div className="progress bg-white bg-opacity-25 rounded-pill" style={{ height: '10px' }}>
                        <div
                            className="progress-bar bg-warning rounded-pill"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>

                <a
                    href="https://cafecito.app/imandro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning w-100 fw-bold rounded-pill text-primary shadow-sm mt-2"
                >
                    <Gift size={18} className="me-2" />
                    ¡Quiero apoyar!
                </a>
            </div>
        </div>
    );
}
