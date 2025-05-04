import { useState, useEffect } from "react";
import {
  CheckCircle,
  X,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  Search,
} from "lucide-react";

export default function Todo() {
  const getSavedTodos = () => {
    const savedTodos = localStorage.getItem("todoList");
    return savedTodos ? JSON.parse(savedTodos) : [];
  };

  // States
  const [todos, setTodos] = useState(getSavedTodos);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priority, setPriority] = useState("medium");

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todos));
  }, [todos]);

  // Generate unique ID
  const generateId = () => Date.now() + Math.random();

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Handle input change
  const handleTask = (e) => {
    setTask(e.target.value);
  };

  // Add new task
  const addTask = () => {
    if (task.trim() === "") return;

    const { date, time } = getCurrentDateTime();
    const newTask = {
      id: generateId(),
      text: task,
      completed: false,
      date,
      time,
      priority,
    };

    setTodos([newTask, ...todos]);
    setTask("");
    setPriority("medium");
  };

  // Ensure all todos have the required properties
  useEffect(() => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      priority: todo.priority || "medium",
      completed: typeof todo.completed === "boolean" ? todo.completed : false,
      date: todo.date || getCurrentDateTime().date,
      time: todo.time || getCurrentDateTime().time,
    }));

    if (JSON.stringify(updatedTodos) !== JSON.stringify(todos)) {
      setTodos(updatedTodos);
    }
  }, []);

  // Handle key press for adding task
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Delete task
  const deleteTask = (id) => {
    setTodos(todos.filter((task) => task.id !== id));
  };

  // Start edit
  const startEdit = (id, text) => {
    setEditIndex(id);
    setEditTask(text);
  };

  // Save edit
  const saveEdit = () => {
    if (editTask.trim() === "") return;
    setTodos(
      todos.map((t) => (t.id === editIndex ? { ...t, text: editTask } : t))
    );
    setEditIndex(null);
    setEditTask("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTask("");
  };

  // Toggle task completion
  const toggleTaskComplete = (id) => {
    setTodos(
      todos.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks
  const filteredTodos = todos.filter((todo) => {
    // Search filter
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Status filter
    if (filter === "completed") {
      return todo.completed && matchesSearch;
    } else if (filter === "active") {
      return !todo.completed && matchesSearch;
    }
    return matchesSearch;
  });

  // Clear completed tasks
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Get priority color
  const getPriorityColor = (priority = "medium") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 to-green-800 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Task Manager
          </h1>
        </div>

        {/* Add task section */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              value={task}
              onChange={handleTask}
              onKeyPress={handleKeyPress}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button
              onClick={addTask}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="p-4 md:p-6 bg-gray-50 border-b flex flex-col md:flex-row gap-3 md:gap-4 md:items-center justify-between">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full text-black pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-between md:justify-end">
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                className={`px-3 py-2 ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-2 ${
                  filter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={`px-3 py-2 ${
                  filter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>

            <button
              onClick={clearCompleted}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear Done
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="overflow-y-auto max-h-96">
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  {editIndex === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      />
                      <button
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskComplete(todo.id)}
                        className="flex-shrink-0"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-green-500 text-white"
                              : "border-2 border-gray-300"
                          }`}
                        >
                          {todo.completed && <CheckCircle size={20} />}
                        </div>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm md:text-base ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {todo.text}
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {todo.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {todo.time}
                          </span>
                          {todo.priority && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                                todo.priority
                              )} border`}
                            >
                              {todo.priority.charAt(0).toUpperCase() +
                                todo.priority.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTask(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm mt-2">
                {searchQuery
                  ? "Try a different search query"
                  : filter !== "all"
                  ? `No ${filter} tasks`
                  : "Add a task to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center text-sm text-gray-500">
          {todos.length > 0 ? (
            <p>{`${
              todos.filter((t) => !t.completed).length
            } task(s) left to complete`}</p>
          ) : (
            <p>Your task list is empty</p>
          )}
        </div>
      </div>
    </div>
  );
}
