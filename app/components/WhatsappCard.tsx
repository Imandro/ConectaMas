import { MessageCircle } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function WhatsappCard() {
    const { t } = useLanguage();

    return (
        <a
            href="https://chat.whatsapp.com/BymmU4EoImgFxLVbUfCzBX"
            target="_blank"
            rel="noopener noreferrer"
            className="d-block text-decoration-none"
        >
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-scale transition-all bg-success bg-opacity-10">
                <div className="card-body p-4 d-flex align-items-center gap-3">
                    <div className="bg-white p-3 rounded-circle shadow-sm text-success">
                        <MessageCircle size={32} fill="#25D366" color="white" />
                    </div>
                    <div>
                        <h5 className="fw-bold text-dark mb-1">{t.whatsapp.card_title}</h5>
                        <p className="text-secondary small mb-0 lh-sm">{t.whatsapp.card_desc}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}
