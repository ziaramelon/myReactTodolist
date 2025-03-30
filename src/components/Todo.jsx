import { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";

export const Todo = () => {
  const getSavedTodos = () => {
    const savedTodos = localStorage.getItem("todoList"); // pang get ni if naay existing todo
    return savedTodos ? JSON.parse(savedTodos) : []; // pra pang save ni sa mga todo maskin mag reload. pag la laman mag return ra og empty array
  };

  // useStates pra store og tasks, edit, delete
  const [todo, setTodo] = useState(getSavedTodos);
  const [task, setTask] = useState(""); // State pra sa new task input
  const [editIndex, setEditIndex] = useState(null); // itrack unsa task ang gina edit
  const [editTask, setEditTask] = useState(""); // istore ang edited task text

  // isave ang tasks sa localStorage pag naay changes sa imong todolist
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todo));
  }, [todo]);

  // function pra mag generate unique id sa kada task na icreate
  const generateId = () => Date.now() + Math.random();

  // function pra ma get ang time and date
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };
  };

  // ga handle sa mga gina input nimo pra mag add ka og task
  const handleTask = (e) => {
    setTask(e.target.value);
  };

  // function pra maka add new task
  const addTask = () => {
    if (task.trim() === "") return; // gina prevent maka add og empty task
    const { date, time } = getCurrentDateTime();
    const newTask = {
      id: generateId(),
      text: task,
      completed: false,
      date,
      time,
    };
    setTodo([newTask, ...todo]); //gina make sure na ang giadd na task sa beginning sa list mu add
    setTask(""); // clear input field
  };

  // delete task
  const deleteTask = (id) => {
    setTodo(todo.filter((task) => task.id !== id));
  };

  // start edit
  const startEdit = (id, text) => {
    setEditIndex(id);
    setEditTask(text);
  };

  // save edit task
  const saveEdit = () => {
    if (editTask.trim() === "") return;
    setTodo(
      todo.map((t) => (t.id === editIndex ? { ...t, text: editTask } : t))
    );
    setEditIndex(null);
    setEditTask("");
  };

  // cancel edit
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTask("");
  };

  // toggle task pag done na
  const toggleTaskComplete = (id) => {
    setTodo(
      todo.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container mx-auto h-screen flex items-center justify-center px-2 sm:px-10">
      <div className="p-4 h-[90%] border-2 border-secondary w-full space-y-4 px-4 rounded-lg overflow-y-auto">
        <h1 className="text-center text-3xl font-bold">To-do List</h1>
        <div>
          {/* input field and add button */}
          <div className="flex items-center justify-center gap-1">
            <input
              type="text"
              className="input focus:outline-none focus:scale-100"
              value={task}
              onChange={handleTask}
            />
            <button className="btn rounded-lg" onClick={addTask}>
              Add
            </button>
          </div>

          {/* task list */}
          <ul className="list mt-6">
            {todo.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                {editIndex === t.id ? (
                  <>
                    {/* edit task */}
                    <input
                      type="text"
                      className="input focus:outline-none focus:scale-100"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                    />
                    <button
                      className="btn rounded-lg btn-success btn-xs sm:btn-sm"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn rounded-lg btn-secondary btn-xs sm:btn-sm"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {/* display task */}
                    <div className="flex items-center w-full">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-sm md:checkbox"
                        onChange={() => toggleTaskComplete(t.id)}
                        checked={t.completed}
                      />
                      <li
                        className={`list-row w-full flex flex-col text-xs sm:text-sm md:text-base md:flex-row justify-between ${
                          t.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {t.text}
                        <div className="flex gap-2 items-center text-gray-500 text-sm">
                          <span>{t.date}</span>
                          <span>{t.time}</span>
                        </div>
                      </li>
                    </div>
                    <button
                      className="btn btn-xs sm:btn-sm btn-warning"
                      onClick={() => startEdit(t.id, t.text)}
                    >
                      <SquarePen color="white" className="w-4 sm:w-6" />
                    </button>
                    <button
                      className="btn btn-xs sm:btn-sm btn-error"
                      onClick={() => deleteTask(t.id)}
                    >
                      <Trash2 color="white" className="w-4 sm:w-6" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
