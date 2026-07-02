import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useAuth } from "../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { EmailSummaryButton } from "../components/EmailSummaryButton";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import "./DashboardPage.css";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const getCurrentMonthName = () => {
    return new Date().toLocaleString("es-ES", { month: "long", year: "numeric" });
};

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

    const getDayInMonth = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const days = [];
        const padDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        for (let i = 0; i < padDays; i++) {
            days.push(null);
        }
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const daysInMonth = getDayInMonth();

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
                    <div className="calendar-widget">
                        <h4 className="calendar-widget-title capitalize">{getCurrentMonthName()}</h4>
                        <div className="calendar-grid">

                            {WEEKDAYS.map((day) => (
                                <span key={day} className="calendar-day-name">{day}</span>
                            ))}

                            {daysInMonth.map((dayDate, index) => {
                                if (!dayDate) return <div key={`empty-${index}`} className="calendar-day-empty"></div>;

                                const dayNum = dayDate.getDate();
                                const year = dayDate.getFullYear();
                                const month = String(dayDate.getMonth() + 1).padStart(2, "0");
                                const formattedDay = String(dayNum).padStart(2, "0");

                                const dateStr = `${year}-${month}-${formattedDay}`;

                                const hasTask = tasks.some((t) => t.dueDate === dateStr && !t.completed);
                                const isToday = new Date().toDateString() === dayDate.toDateString();

                                return (
                                    <div
                                        key={dateStr}
                                        className={`calendar-day-number ${isToday ? "today" : ""} ${hasTask ? "has-task" : ""}`}
                                    >
                                        {dayNum}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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