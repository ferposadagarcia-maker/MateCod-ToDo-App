export type TaskPriority = "low" | "medium" | "high";

export type Task = {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    dueDate?: string;
    createdAt?: string;
}

export type NewTaskInput = {
    userId: string;
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
};

