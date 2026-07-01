import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, NewTaskInput } from "../types/task";

type TaskFirestoreDoc = Omit<Task, "id">;

function mapTask(docId: string, data: DocumentData): Task {
    const typed = data as TaskFirestoreDoc;
    return {
        id: docId,
        title: typed.title,
        completed: typed.completed,
        priority: typed.priority,
        description: typed.description,
        dueDate: typed.dueDate,
        createdAt: typed.createdAt,
        userId: typed.userId
    }
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
    const q = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapTask(d.id, d.data()))
}

export async function addTask(input: NewTaskInput): Promise<Task> {
    const payload: Omit<Task, "id"> = {
        userId: input.userId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate,
        completed: false,
        createdAt: serverTimestamp() as unknown as Task["createdAt"],
    };
    const docRef = await addDoc(collection(db, "tasks"), payload);
    return { id: docRef.id, ...payload }
}

export async function updateTask(
    taskId: string,
    updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>
): Promise<void> {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updates);
}

export async function deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
}