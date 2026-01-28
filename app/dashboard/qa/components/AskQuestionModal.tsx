"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { createQuestion } from "../actions";
import { useLanguage } from "@/app/LanguageContext";
import { toast } from "react-hot-toast";

interface AskQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AskQuestionModal({ isOpen, onClose }: AskQuestionModalProps) {
    const { t } = useLanguage();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (title.length < 5 || content.length < 10) {
            toast.error(t.qa.toast_short);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createQuestion(title, content);
            if (res.success) {
                toast.success(t.qa.toast_success);
                setTitle("");
                setContent("");
                onClose();
            } else {
                toast.error(t.qa.toast_error);
            }
        } catch (e) {
            toast.error(t.qa.toast_error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-index-modal d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1050 }}>
            <div className="bg-white rounded-4 shadow w-100 animate-slide-up" style={{ maxWidth: 500 }}>
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">{t.qa.modal_title}</h5>
                    <button onClick={onClose} className="btn btn-sm btn-light rounded-circle p-2">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">{t.qa.modal_title_label}</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t.qa.modal_title_placeholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={80}
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">{t.qa.modal_details_label}</label>
                        <textarea
                            className="form-control"
                            rows={5}
                            placeholder={t.qa.modal_details_placeholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <>
                                <Send size={18} />
                                {t.qa.modal_submit}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
