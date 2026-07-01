import { useState, useEffect, useCallback } from "react";
import type { Task, TaskPriority } from "../types/task";
import { getTasksByUser, addTask, updateTask, deleteTask } from "../services/tasksService";

export function useTasks(uid: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!uid) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getTasksByUser(uid);
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("No se pudieron obtener las tareas.");
        } finally {
            setLoading(false);
        }
    }, [uid]);

    useEffect(() => {
        if (!uid) {
            setTasks([]);
            return;
        }
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTasksByUser(uid);
                if (!cancelled) setTasks(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setError("No se pudieron cargar las tareas.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [uid]);

    const handleAddTask = async (
        title: string,
        description: string,
        priority: TaskPriority,
        dueDate?: string
    ) => {
        if (!uid) return;
        setError(null);
        try {
            await addTask({ userId: uid, title, description, priority, dueDate });
            await fetchTasks();
        } catch (err) {
            console.error("Error adding task:", err);
            setError("Error al crear la tarea.");
            throw err;
        }
    };

    const handleToggleComplete = async (taskId: string, currentCompleted: boolean) => {
        setError(null);
        try {
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, completed: !currentCompleted } : t))
            );
            await updateTask(taskId, { completed: !currentCompleted });
        } catch (err) {
            console.error("Error updating task status:", err);
            setError("No se pudo actualizar el estado.");
            await fetchTasks();
        }
    };

    const handleEditTask = async (
        taskId: string,
        updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>
    ) => {
        setError(null);
        try {
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
            );
            await updateTask(taskId, updates);
        } catch (err) {
            console.error("Error editing task:", err);
            setError("No se pudieron guardar los cambios.");
            await fetchTasks();
            throw err;
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        setError(null);
        try {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            await deleteTask(taskId);
        } catch (err) {
            console.error("Error deleting task:", err);
            setError("No se pudo eliminar la tarea.");
            await fetchTasks();
        }
    };

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        handleAddTask,
        handleToggleComplete,
        handleEditTask,
        handleDeleteTask,
    };
}