import { describe, it, expect } from "vitest"
import { buildSummary } from "../src/components/EmailSummaryButton";
import type { Task } from "../src/types/task";

describe("Pruebas unitarias para el generador de reportes de correo", () => {
    it("Debería de calcular correctamente las tareas pendientes y completadas", () => {
        const mockTasks: Task[] = [
            {
                id: "1",
                userId: "user123",
                title: "Tarea Pendiente Alta",
                description: "Detalle",
                completed: false,
                priority: "high",
                createdAt: new Date().toISOString(),
            },
            {
                id: "2",
                userId: "user123",
                title: "Tarea Completada Media",
                description: "Detalle",
                completed: true,
                priority: "medium",
                createdAt: new Date().toISOString(),
            },
        ];
        const result = buildSummary(mockTasks);

        expect(result).toContain("Tareas Pendientes: 1");
        expect(result).toContain("Tareas Completadas: 1");
        expect(result).toContain("· Tarea Pendiente Alta (high)");
    });

    it("Debería indicar 'Ninguna' si no hay tareas pendientes en el reporte", () => {
        const mockEmptyTasks: Task[] = [];
        const result = buildSummary(mockEmptyTasks);

        expect(result).toContain("Tareas Pendientes: 0");
        expect(result).toContain("Tareas Completadas: 0");
        expect(result).toContain("Ninguna");
    });
});