// src/components/TaskItem.jsx
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded shadow mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mr-3"
        />
        <span className={task.completed ? "line-through text-gray-500" : ""}>
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        ❌
      </button>
    </div>
  );
}
