// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No estás autenticado. Por favor inicia sesión.");
      // Opcional: navegar a login después de mostrar el mensaje
      // setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);

        if (res.status === 401 || res.status === 403) {
          setErrorMessage("Token inválido o expirado. Por favor inicia sesión nuevamente.");
          // Opcional: navegar a login después de mostrar mensaje
          // setTimeout(() => navigate("/login"), 3000);
        } else {
          setErrorMessage("Error al cargar las tareas. Intenta más tarde.");
        }
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada del backend:", data);
        setErrorMessage("Respuesta inesperada del servidor.");
        return;
      }

      setTasks(data);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setErrorMessage("Error de conexión. Intenta más tarde.");
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al agregar tarea:", errorData);
        setErrorMessage("No se pudo agregar la tarea.");
        return;
      }

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      setErrorMessage("Error de conexión al agregar tarea.");
    }
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al actualizar tarea:", errorData);
        setErrorMessage("No se pudo actualizar la tarea.");
        return;
      }

      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setErrorMessage("Error de conexión al actualizar tarea.");
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al eliminar tarea:", errorData);
        setErrorMessage("No se pudo eliminar la tarea.");
        return;
      }

      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setErrorMessage("Error de conexión al eliminar tarea.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Mis Tareas</h1>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded-l"
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          ➕
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tienes tareas.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))
      )}
    </div>
  );
}
