import { supabase } from "./db";
import { useEffect, useState } from "react";
import { Database } from "./types";
import "./App.css";
type Todo = Database["public"]["Tables"]["todos"]["Row"];

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [isBoxFrozen, setIsBoxFrozen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  function fetchTodo() {
    supabase
      .from("todos")
      .select("*")
      .then((res) => {
        setTodos(res.data || []);
      });
  }

  useEffect(() => {
    fetchTodo();
  }, []);

  function resetInfoboxState() {
    setHoveredInfo(null);
    setIsBoxFrozen(false);
    setSelectedTodoId(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "info") {
      setInfo(value);
    }
  }

  const handleSubmit = () => {
    if (!title) return;
    supabase
      .from("todos")
      .insert([{ title: title, info: info }])
      .then((res) => {
        console.log(res);
        fetchTodo();
        setTitle("");
        setInfo("");
        resetInfoboxState();
      });
  };

  function handleDelete(todo: Todo) {
    supabase
      .from("todos")
      .delete()
      .eq("id", todo.id)
      .then((res) => {
        console.log(res);
        fetchTodo();
        resetInfoboxState();
      });
  }

  const handleDeleteAll = () => {
    let promises = todos.map((todo) => {
      return supabase.from("todos").delete().eq("id", todo.id);
    });

    Promise.all(promises).then(() => {
      console.log("All todos deleted");
      fetchTodo();
      resetInfoboxState();
    });
  };

  const generateRandomTodos = () => {
    let promises = [];
    for (let i = 0; i < 10; i++) {
      let todoTitle = `Random Todo ${Math.random().toString(36).substring(7)}`;
      let todoInfo = `Random Info ${Math.random().toString(36).substring(7)}`;

      promises.push(
        supabase.from("todos").insert([{ title: todoTitle, info: todoInfo }])
      );
    }

    Promise.all(promises).then(() => {
      console.log("Random 10 Todos with info generated");
      fetchTodo();
      resetInfoboxState();
    });
  };

  return (
    <>
      <h1>
        {Array.from("To Do(s)").map((char, index) => (
          <span
            className="jumping-char"
            style={{ animationDelay: `${index * 0.2}s` }}
            key={index}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      <div className="center-container">
        <div className="input-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            className="center-input"
            placeholder="Enter todo title"
          />
        </div>
        <div style={{ marginLeft: "10px" }} className="input-group">
          <label htmlFor="info">Info:</label>
          <input
            id="info"
            name="info"
            value={info}
            onChange={handleChange}
            className="center-input"
            placeholder="Enter todo details"
          />
        </div>
      </div>

      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleDeleteAll}>Delete all todos</button>
      <button onClick={generateRandomTodos}>Generate 10 random todos</button>
      <div style={{ fontSize: "13px" }}>
        *Hint: "Hover" over a todo to see its details, and "click" to freeze the
        info box.
      </div>

      <div className="todo-wrapper">
        {todos.map((todo, idx) => {
          const time = new Date(todo.created_at).toLocaleTimeString();
          const date = new Date(todo.created_at).toLocaleDateString();
          return (
            <div
              key={todo.id}
              className={`todo-item ${
                todo.id === selectedTodoId ? "selected" : ""
              }`}
              onMouseEnter={() => !isBoxFrozen && setHoveredInfo(todo.info)}
              onMouseLeave={() => !isBoxFrozen && setHoveredInfo(null)}
              onClick={() => {
                if (selectedTodoId === todo.id) {
                  setIsBoxFrozen(false);
                  setSelectedTodoId(null);
                  setHoveredInfo(null);
                } else {
                  setIsBoxFrozen(true);
                  setSelectedTodoId(todo.id);
                  setHoveredInfo(todo.info);
                }
              }}
            >
              <span>({idx + 1})</span>
              <span>📆{date}</span>
              <span>⏰{time}</span>
              <span>📰{todo.title}</span>
              <span className="trash" onClick={() => handleDelete(todo)}>
                ❌
              </span>
            </div>
          );
        })}
      </div>

      <div
        className={`info-label ${
          hoveredInfo || isBoxFrozen ? "info-label-visible" : ""
        }`}
      >
        ❔Info❔
      </div>
      <div
        className={`info-box ${
          hoveredInfo || isBoxFrozen ? "info-box-visible" : ""
        }`}
      >
        {hoveredInfo}
      </div>
    </>
  );
}

export default App;
