import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useAuth } from "../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { EmailSummaryButton } from "../components/EmailSummaryButton";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import "./DashboardPage.css";

function DashboardPage(): JSX.Element {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    async function handleLogout(): Promise<void> {
        await logout();
        navigate("/login");
    }
    const {
        tasks,
        loading,
        error,
        handleAddTask,
        handleToggleComplete,
        handleEditTask,
        handleDeleteTask,
    } = useTasks(user?.uid || "");

    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

    const filteredTasks = tasks.filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains("dark");
    });
    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);

        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-user-info">
                    <span className="user-avatar"></span>
                    <div>
                        <p className="user-welcome">Hola</p>
                        <p className="user-name">{user?.displayName}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        aria-label="Cambiar tema"
                    >
                        {isDark ? "☀️" : "🌙"}
                    </button>

                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                </button>
            </header>

            <main className="dashboard-grid">
                <section className="dashboard-sidebar">
                    <div className="stats-widget">
                        <h4 className="widget-title">Resumen de Tareas</h4>
                        <div className="stats-row">
                            <div className="stat-box">
                                <span className="stat-number">{pendingTasks}</span>
                                <span className="stat-label">Completada</span>
                            </div>
                        </div>
                    </div>
                    <EmailSummaryButton tasks={tasks} userEmail={user?.email || ""} />
                    <TaskForm onAddTask={handleAddTask} />
                </section>

                <section className="dashboard-main">
                    <div className="filter-bar">
                        <button onClick={() => setFilter("all")}
                            className={`filter-btn ${filter === "all" ? "active" : ""}`}>
                            Todas ({totalTasks})
                        </button>
                        <button onClick={() => setFilter("pending")}
                            className={`filter-btn ${filter === "pending" ? "active" : ""}`}>
                            Pendientes ({pendingTasks})
                        </button>
                        <button onClick={() => setFilter("completed")}
                            className={`filter-btn ${filter === "completed" ? "active" : ""}`}>
                            Completadas ({completedTasks})
                        </button>
                    </div>

                    {loading && <div className="loading-state">Cargando tus tareas...</div>}
                    {error && <div className="error-state">Error: {error}</div>}

                    <div className="task-list">
                        {!loading && filteredTasks.length === 0 ? (
                            <div className="empty-tasks-state">
                                <p className="empty-subtext">¡Crea una nueva tarea!</p>
                                <p className="empty-subtext">Agrega tareas para mantenerte organizado</p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleComplete={handleToggleComplete}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleEditTask}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
export default DashboardPage;