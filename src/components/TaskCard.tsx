import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import type { Task, TaskPriority } from "../types/task";
import "./TaskCard.css";

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string, currentCompleted: boolean) => Promise<void>;
    onDelete: (taskId: string, updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>) => Promise<void>;
    onEdit: (taskId: string, updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>) => Promise<void>;
}

function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps): JSX.Element {
    const [isEditing, setIsEditing] = useState(false);

    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority);
    const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!editedTitle.trim()) return;
        setIsSaving(true);
        try {
            await onEdit(task.id, {
                title: editedTitle.trim(),
                description: editedDescription.trim(),
                priority: editedPriority,
                dueDate: editedDueDate || "",
            });
            setIsEditing(false)
        } catch (error) {
            console.error("Error al guardar cambios de la tarea", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedPriority(task.priority);
        setEditedDueDate(task.dueDate || "")
        setIsEditing(false);
    };

    return (
        <div className={`task-card-container ${task.completed ? "completed" : ""} ${task.priority}`}>
            {isEditing ? (
                <div className="card-edit-mode">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="edit-input-title"
                        disabled={isSaving}
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="edit-input-description"
                        rows={2}
                        disabled={isSaving}
                    />
                    <div className="edit-meta-row">
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            className="edit-input-date"
                            disabled={isSaving}
                        />
                        <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
                            className="edit-input-select"
                            disabled={isSaving}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <div className="card-actions-row">
                        <button onClick={handleSave} className="btn-save" disabled={isSaving || !editedTitle.trim()}>
                            {isSaving ? "Guardando..." : "Guardar"}
                        </button>
                        <button onClick={handleCancel} className="btn-cancel" disabled={isSaving}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card-read-mode">
                    <div className="card-header">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleComplete(task.id, task.completed)}
                            className="card-checkbox"
                        />
                        <h4 className="task-title-text">{task.title}</h4>
                        <span className={`priority-badge ${task.priority}}`}>
                            {task.priority === "low" ? "Baja" : task.priority === "medium" ? "Media" : "Alta"}
                        </span>
                    </div>
                    {task.description && <p className="task-description-text">{task.description}</p>}

                    <div className="card-footer">
                        {task.dueDate ? (
                            <span className="task-due-date">📅 Vence: {task.dueDate}</span>
                        ) : (
                            <span className="task-due-date-empty">Sin fecha límite</span>
                        )}

                        <div className="card-actions-group">
                            <button onClick={() => setIsEditing(true)} className="btn-action-edit" disabled={task.completed}>
                                Editar
                            </button>
                            <button onClick={() => onDelete(task.id, {})} className="btn-action-delete">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskCard;