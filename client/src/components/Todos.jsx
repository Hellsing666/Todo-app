import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  const updateTodo = async (id, description, completed) => {
    try {
      const response = await axios.patch(`http://localhost:5000/todos/${id}`, {
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

  const addTodo = async (description) => {
    try {
      const response = await axios.post(`http://localhost:5000/todos/`, {
        description: description,
      });
      setTodos((prevTodos) => [...prevTodos, response.data]);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/todos/${id}`);
      console.log(response.data);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTodos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div>
      <h2>Todo list</h2>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <span>{todo.description}</span>
              <button
                onClick={() => {
                  const newDescription = prompt(
                    "Enter new description",
                    todo.description
                  );
                  if (newDescription !== null) {
                    updateTodo(todo.id, newDescription, todo.completed);
                  }
                }}
              >
                Edit
              </button>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  updateTodo(todo.id, todo.description, !todo.completed);
                }}
              />
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          );
        })}
        <button
          onClick={() => {
            const newDescription = prompt("Enter description");
            if (newDescription !== null) {
              addTodo(newDescription);
            }
          }}
        >
          Add{" "}
        </button>
      </ul>
    </div>
  );
};
export default Todos;
