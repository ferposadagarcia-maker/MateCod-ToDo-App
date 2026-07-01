import { useState } from "react";
import type { Task } from "../types/task";
import "./EmailSummaryButton.css";

interface EmailSummaryButtonProps {
    tasks: Task[];
    userEmail: string;
}

export function buildSummary(tasks: Task[]): string {
    const pendientes = tasks.filter((t) => !t.completed).length;
    const completadas = tasks.filter((t) => t.completed).length;
    const listaPendientes = tasks
        .filter((t) => !t.completed)
        .map((t) => `· ${t.title} (${t.priority})`)
        .join("\n");

    return `Tareas Pendientes: ${pendientes}\nTareas Completadas: ${completadas}\n\nDetalle de pendientes:\n${listaPendientes || "Ninguna"}`;
}

export function EmailSummaryButton({ tasks, userEmail }: EmailSummaryButtonProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [cooldownUntil, setCoolDownUntil] = useState(0);

    const handleSend = async () => {
        if (Date.now() < cooldownUntil) return;

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: userEmail,
                    subject: "Mis tareas pendientes",
                    body: buildSummary(tasks),
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.ok) {
                setStatus("error");
                setErrorMsg(data.message || "Ocurrió un error al enviar el email.");
                return;
            }
            setStatus("success");
            setCoolDownUntil(Date.now() + 60000);

        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMsg("Ocurrió un error inesperado. Intenta nuevamente.");
        }
    };

    return (
        <div className="email-button-container">
            <button onClick={handleSend} disabled={status === "loading" || Date.now() < cooldownUntil || tasks.length === 0}
                className={`email-submit-btn ${status}`}>
                {status === "loading" && "enviando..."}
                {status === "success" && "¡Enviado con éxito!"}
                {status === "error" && "Error al enviar"}
                {status === "idle" && "Enviar resumen de tareas"}
            </button>

            {status === "error" && <p className="email-error-text">{errorMsg}</p>}
            {status === "success" && (
                <p className="email-success-text">¡Revisa tu bandeja de entrada!</p>
            )}
        </div>
    );
}