export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`flex items-center justify-between p-3 mb-2 border rounded ${
        task.completed ? "bg-green-100 text-green-700" : "bg-white"
      }`}
    >
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mr-3"
        />
        <span className={task.completed ? "line-through" : ""}>{task.title}</span>
      </label>

      <button
        onClick={() => onDelete(task.id)}
        className="text-red-600 hover:text-red-800 font-bold"
        aria-label={`Eliminar tarea: ${task.title}`}
      >
        ✖
      </button>
    </div>
  );
}
