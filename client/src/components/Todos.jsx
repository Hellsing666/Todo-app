import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const updateTodo = async (id, description, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}`, {
        description: description,
        completed: completed,
      });
      console.log(response.data);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, description: description, completed: completed }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/todos/`, {
        description: newTodo,
      });
      setTodos((prevTodos) => [...prevTodos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/todos/${id}`);
      console.log(response.data);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_URL}/todos`);
        setTodos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ My Todo List
        </h1>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No todos yet. Add one above! 🎯</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                  todo.completed
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => updateTodo(todo.id, todo.description, !todo.completed)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />

                {/* Todo Text */}
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => {
                      if (editText.trim()) {
                        updateTodo(todo.id, editText, todo.completed);
                      }
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (editText.trim()) {
                          updateTodo(todo.id, editText, todo.completed);
                        }
                        setEditingId(null);
                      }
                    }}
                    autoFocus
                    className="flex-1 px-2 py-1 border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.description}
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditText(todo.description);
                    }}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            {todos.filter((t) => !t.completed).length} of {todos.length} tasks remaining
          </div>
        )}
      </div>
    </div>
  );
};
export default Todos;
