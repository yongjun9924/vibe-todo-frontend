import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todos";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      setError(e.message || "할일 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    setError("");
    try {
      const created = await createTodo(title);
      setTodos((prev) => [created, ...prev]);
      setInput("");
    } catch (e) {
      setError(e.message || "할일 추가에 실패했습니다.");
    }
  };

  const handleToggle = async (todo) => {
    setError("");
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (e) {
      setError(e.message || "완료 상태 변경에 실패했습니다.");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (editingId == null) return;
    const title = editingTitle.trim();
    if (!title) {
      setError("할일 내용을 입력해 주세요.");
      return;
    }
    setError("");
    try {
      const updated = await updateTodo(editingId, { title });
      setTodos((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (e) {
      setError(e.message || "수정에 실패했습니다.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setError("");
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      setError(e.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>할일</h1>
      </header>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할일을 입력하세요"
          className="add-input"
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          추가
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="loading">불러오는 중...</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              {editingId === todo._id ? (
                <div className="edit-row">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="edit-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={handleSaveEdit}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-ghost"
                    onClick={cancelEdit}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed ?? false}
                    onChange={() => handleToggle(todo)}
                    className="todo-checkbox"
                  />
                  <span className="todo-title">{todo.title}</span>
                  <div className="todo-actions">
                    <button
                      type="button"
                      className="btn btn-small btn-ghost"
                      onClick={() => startEdit(todo)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(todo._id)}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && todos.length === 0 && (
        <p className="empty">할일이 없습니다. 위에서 추가해 보세요.</p>
      )}
    </div>
  );
}

export default App;
