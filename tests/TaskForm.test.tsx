import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "../src/components/TaskForm";
import "@testing-library/jest-dom";

describe("Pruebas de Componente: TaskForm", () => {

    it("Debería renderizar todos los campos de entrada obligatorios del formulario", () => {
        render(<TaskForm onAddTask={vi.fn()} />);

        const titleInput = screen.getByPlaceholderText("Ej.Comprar café");
        const descInput = screen.getByPlaceholderText("Añade detalles sobre la tarea...");
        const submitButton = screen.getByRole("button", { name: "Agregar Tarea" });

        expect(titleInput).toBeInTheDocument();
        expect(descInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it("Debería simular la escritura del usuario y llamar a onAddTask al hacer el submit", async () => {
        const mockOnAddTask = vi.fn().mockResolvedValue(undefined);

        render(<TaskForm onAddTask={mockOnAddTask} />);

        const titleInput = screen.getByPlaceholderText("Ej.Comprar café");
        const descInput = screen.getByPlaceholderText("Añade detalles sobre la tarea...");
        const submitButton = screen.getByRole("button", { name: "Agregar Tarea" });

        fireEvent.change(titleInput, { target: { value: "Aprender Testing" } });
        fireEvent.change(descInput, { target: { value: "Completar la lecture de React Testing Library" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnAddTask).toHaveBeenCalledWith(
                "Aprender Testing",
                "Completar la lecture de React Testing Library",
                "medium",
                undefined
            );
        });
    });

});