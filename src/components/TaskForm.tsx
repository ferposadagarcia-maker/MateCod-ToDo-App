import React, { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import type { TaskPriority } from "../types/task";
import "./TaskForm.css";

interface TaskFormProps {
    onAddTask: (
        title: string,
        description: string,
        priority: TaskPriority,
        dueDate?: string
    ) => Promise<void>;
}

function TaskForm({ onAddTask }: TaskFormProps): JSX.Element {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [dueDate, setDueDate] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("El titulo es obligatorio");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onAddTask(title.trim(), description.trim(), priority, dueDate ||
                undefined);

            setTitle("");
            setDescription("");
            setPriority("medium");
            setDueDate("");
        } catch (error) {
            setError("Error al crear la tarea");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form-container">
            <h3 className="form-title">Nueva Tarea</h3>

            {error && <div className="form-error-alert">{error}</div>}
            <div className="form-group">
                <label className="form-label">Título de la tarea</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej.Comprar café"
                    className="form-input"
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Añade detalles sobre la tarea..."
                    rows={3}
                    className="form-textarea"
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Fecha límite</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-input"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Prioridad</label>
                <div className="priority-selector">
                    {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`priority-btn ${p} ${priority === p ? "active" : ""}`}
                            disabled={isSubmitting}>{p === "low" ? "Baja" : p === "medium" ? "Media" : "Alta"}
                        </button>
                    ))}
                </div>
            </div>
            <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="form-submit-btn"
            >
                {isSubmitting ? "Guardando..." : "Agregar Tarea"}
            </button>
        </form>
    );
}

export default TaskForm;