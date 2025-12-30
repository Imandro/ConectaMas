import { Instagram } from "lucide-react";

export default function InstagramCard() {
    return (
        <a
            href="https://www.instagram.com/_conectamass?igsh=MTBrMnJtYjI1Z3FlOA=="
            target="_blank"
            rel="noopener noreferrer"
            className="d-block text-decoration-none"
        >
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-scale transition-all position-relative" style={{ background: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                    <div className="bg-white p-3 rounded-circle shadow-sm">
                        <Instagram size={32} className="text-danger" />
                    </div>
                    <div className="text-white">
                        <h5 className="fw-bold mb-1">Síguenos en Instagram</h5>
                        <p className="small mb-0 lh-sm opacity-90">@_conectamass - Contenido diario de transformación</p>
                    </div>
                </div>
            </div>
        </a>
    );
}
