"use client";

import { useLanguage } from "@/app/LanguageContext";
import { ArrowLeft, Users, Target, Shield, Copy, CheckCircle2, Circle, MessageSquare, Plus, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { completeTask, submitNeed, createTask, removeMember } from "../actions";
import UserAvatar from "@/app/components/UserAvatar";

interface GroupDashboardProps {
    group: any;
    currentUserId?: string;
}

export default function GroupDashboardView({ group, currentUserId }: GroupDashboardProps) {
    const { t } = useLanguage();
    const [needs, setNeeds] = useState(group.needs || []);
    const [showNeedModal, setShowNeedModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [needContent, setNeedContent] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskType, setTaskType] = useState("Lectura");
    const [isAnonymous, setIsAnonymous] = useState(true);

    const isLeader = group.leaderId === currentUserId;

    const copyCode = () => {
        navigator.clipboard.writeText(group.accessCode);
        toast.success("Código copiado");
    };

    const handleCompleteTask = async (taskId: string) => {
        const res = await completeTask(taskId);
        if (res.success) {
            toast.success("Tarea completada");
            window.location.reload(); // Quick refresh
        }
    };

    const handleSubmitNeed = async () => {
        if (!needContent.trim()) return;
        const res = await submitNeed(group.id, needContent, isAnonymous);
        if (res.success) {
            toast.success("Necesidad enviada");
            setNeedContent("");
            setShowNeedModal(false);
        }
    };

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) return;
        const res = await createTask(group.id, taskTitle, taskType);
        if (res.success) {
            toast.success("Meta asignada");
            setTaskTitle("");
            setShowTaskModal(false);
            window.location.reload();
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (confirm("¿Estás seguro de que quieres remover a este miembro?")) {
            const res = await removeMember(group.id, userId);
            if (res.success) {
                toast.success("Miembro removido");
                window.location.reload();
            }
        }
    };

    const completedTasks = group.tasks.filter((t: any) => t.completions.length > 0).length;
    const progress = group.tasks.length > 0 ? (completedTasks / group.tasks.length) * 100 : 0;

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href="/dashboard/groups" className="btn btn-link text-muted p-0 mb-3 d-inline-flex align-items-center gap-2 text-decoration-none">
                <ArrowLeft size={18} />
                Regresar
            </Link>

            <div className="row g-4">
                {/* Header Card */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm bg-primary text-white overflow-hidden position-relative rounded-4">
                        <div className="card-body p-4 position-relative z-1">
                            <div className="badge bg-white text-primary mb-2 fw-bold px-3 py-1 bg-opacity-90">{group.motto || "Grupo Pequeño"}</div>
                            <h1 className="fw-bold mb-1">{group.name}</h1>
                            <div className="d-flex align-items-center gap-3 opacity-75 small">
                                <span>Líder: <strong>{group.leader.name}</strong></span>
                                <span>•</span>
                                <span>{group.members.length} miembros</span>
                            </div>

                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <button onClick={copyCode} className="btn btn-sm btn-white bg-white text-primary fw-bold d-inline-flex align-items-center gap-2 shadow-sm rounded-pill px-3">
                                    <Copy size={14} /> {group.accessCode}
                                </button>
                                <button onClick={() => setShowNeedModal(true)} className="btn btn-sm btn-outline-light border-2 fw-bold d-inline-flex align-items-center gap-2 rounded-pill px-3">
                                    <MessageSquare size={14} /> Compartir Necesidad
                                </button>
                            </div>
                        </div>
                        <Users size={200} className="position-absolute opacity-10" style={{ right: -40, bottom: -60, transform: 'rotate(-10deg)' }} />
                    </div>
                </div>

                {/* Progress Bar Item */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-bold mb-0">Progreso del Grupo</h6>
                                <span className="badge bg-primary rounded-pill">{Math.round(progress)}%</span>
                            </div>
                            <div className="progress rounded-pill" style={{ height: 12 }}>
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                                    role="progressbar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="small text-muted mt-2 mb-0">Completen las metas semanales para subir de liga!</p>
                        </div>
                    </div>
                </div>

                {/* Left Col: Tasks */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-secondary mb-4 d-flex align-items-center gap-2">
                                <Target size={20} /> Metas de la Semana
                            </h5>

                            {group.tasks.length === 0 ? (
                                <div className="text-center py-5 bg-light rounded-4 border-dashed">
                                    <p className="text-muted mb-0">No hay tareas asignadas aún.</p>
                                    {isLeader && (
                                        <button onClick={() => setShowTaskModal(true)} className="btn btn-link text-primary mt-2">Crear primera meta</button>
                                    )}
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {isLeader && (
                                        <button onClick={() => setShowTaskModal(true)} className="btn btn-outline-primary btn-sm rounded-pill mb-2 d-inline-flex align-items-center justify-content-center gap-2">
                                            <Plus size={14} /> Nueva Meta
                                        </button>
                                    )}
                                    {group.tasks.map((task: any) => {
                                        const isCompleted = task.completions.length > 0;
                                        return (
                                            <div key={task.id} className={`p-3 rounded-4 border-2 border d-flex align-items-center justify-content-between transition-all ${isCompleted ? 'bg-light border-success border-opacity-25 opacity-75' : 'bg-white border-light'}`}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`p-2 rounded-circle ${isCompleted ? 'text-success' : 'text-muted'}`}>
                                                        {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className={`fw-bold ${isCompleted ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>{task.title}</div>
                                                        <div className="text-muted small">{task.type}</div>
                                                    </div>
                                                </div>
                                                {!isCompleted && (
                                                    <button onClick={() => handleCompleteTask(task.id)} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                        Hecho
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Anonymous Needs (Leader View) */}
                    {isLeader && (
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold text-secondary mb-4 d-flex align-items-center gap-2">
                                    <Shield size={20} className="text-primary" /> Necesidades Anónimas
                                </h5>
                                {group.needs.length === 0 ? (
                                    <p className="text-muted small text-center py-4">No se han compartido necesidades esta semana.</p>
                                ) : (
                                    <div className="row g-3">
                                        {group.needs.map((need: any) => (
                                            <div key={need.id} className="col-md-6">
                                                <div className="p-3 bg-light rounded-4 h-100">
                                                    <div className="small text-primary fw-bold mb-2 d-flex align-items-center gap-1">
                                                        <Lock size={12} /> Confidencial
                                                    </div>
                                                    <p className="small mb-0 text-dark italic">"{need.content}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Col: Members */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
                        <div className="card-body p-4">
                            <h6 className="fw-bold text-muted mb-3">Miembros</h6>
                            <div className="d-flex flex-column gap-3">
                                {group.members.map((m: any) => (
                                    <div key={m.id} className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <UserAvatar name={m.user.name} size={40} />
                                            <div>
                                                <div className="fw-bold text-dark small">{m.user.name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    {m.role === 'ADMIN' ? 'Líder / Admin' : 'Miembro'}
                                                </div>
                                            </div>
                                        </div>
                                        {isLeader && m.userId !== currentUserId && (
                                            <button
                                                onClick={() => handleRemoveMember(m.userId)}
                                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isLeader && (
                                <button className="btn btn-outline-primary btn-sm w-100 mt-4 rounded-pill d-flex align-items-center justify-content-center gap-2">
                                    <Plus size={16} /> Invitar Miembros
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Need Modal */}
            {showNeedModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Compartir Necesidad</h5>
                                <button type="button" className="btn-close" onClick={() => setShowNeedModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted small mb-3">Tu necesidad solo será visible para el líder del grupo.</p>
                                <textarea
                                    className="form-control rounded-4 bg-light border-0 p-3"
                                    rows={4}
                                    placeholder="¿En qué podemos apoyarte o por qué podemos orar?"
                                    value={needContent}
                                    onChange={(e) => setNeedContent(e.target.value)}
                                ></textarea>

                                <div className="form-check form-switch mt-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                    />
                                    <label className="form-check-label small text-muted">Compartir de forma anónima</label>
                                </div>

                                <button
                                    onClick={handleSubmitNeed}
                                    className="btn btn-primary w-100 mt-4 rounded-pill py-2 fw-bold"
                                >
                                    Enviar al Líder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Task Modal */}
            {isLeader && showTaskModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Nueva Meta Semanal</h5>
                                <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Título de la meta</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill bg-light border-0"
                                        placeholder="Ej: Leer 3 capítulos de Lucas"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Tipo</label>
                                    <select
                                        className="form-select rounded-pill bg-light border-0"
                                        value={taskType}
                                        onChange={(e) => setTaskType(e.target.value)}
                                    >
                                        <option value="Lectura">Lectura</option>
                                        <option value="Oración">Oración</option>
                                        <option value="Servicio">Servicio</option>
                                        <option value="Estudio">Estudio</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleCreateTask}
                                    className="btn btn-primary w-100 mt-3 rounded-pill py-2 fw-bold"
                                >
                                    Asignar Meta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

