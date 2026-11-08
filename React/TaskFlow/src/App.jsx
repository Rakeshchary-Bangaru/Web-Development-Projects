
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "/api/tasks";

const emptyForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "TODO",
  dueDate: "",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load tasks.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks. Please check the backend.");
    }
  };

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      completed: tasks.filter((task) => task.status === "COMPLETED").length,
    };
  }, [tasks]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(
          editingId
            ? "Unable to update task."
            : "Unable to create task."
        );
      }

      resetForm();
      await fetchTasks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      priority: task.priority ?? "MEDIUM",
      status: task.status ?? "TODO",
      dueDate: task.dueDate ?? "",
    });

    setEditingId(task.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete task.");
      }

      await fetchTasks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task status.");
      }

      await fetchTasks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleComplete = async (task) => {
    await updateTaskStatus(task, "COMPLETED");
  };

  const handleReopen = async (task) => {
    await updateTaskStatus(task, "TODO");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddTask = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="app">

      <header className="header">
        <div>
          <p className="eyebrow">
            TASK MANAGEMENT
          </p>

          <h1>TaskFlow</h1>

          <p className="subtitle">
            Organize your work and keep track of what needs to get done.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddTask}
        >
          + Add Task
        </button>
      </header>

      <section className="stats-grid">
        <StatCard
          label="Total Tasks"
          value={stats.total}
        />

        <StatCard
          label="To Do"
          value={stats.todo}
        />

        <StatCard
          label="In Progress"
          value={stats.progress}
        />

        <StatCard
          label="Completed"
          value={stats.completed}
        />
      </section>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <section className="form-panel">

          <div className="form-heading">

            <h2>
              {editingId
                ? "Edit Task"
                : "Create Task"}
            </h2>

            <button
              className="close-button"
              type="button"
              onClick={resetForm}
              aria-label="Close form"
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="task-form"
          >

            <div className="form-group full-width">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the task"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="TODO">
                  To Do
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">
                Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">

              <button
                className="primary-button"
                type="submit"
              >
                {editingId
                  ? "Update Task"
                  : "Create Task"}
              </button>

            </div>

          </form>

        </section>
      )}

      <section className="tasks-section">

        <div className="section-heading">

          <div>

            <h2>
              Your Tasks
            </h2>

            <p>
              {tasks.length} task(s) currently available
            </p>

          </div>

        </div>

        {tasks.length === 0 ? (

          <div className="empty-state">

            <h3>
              No tasks yet
            </h3>

            <p>
              Create your first task to get started.
            </p>

          </div>

        ) : (

          <div className="task-grid">

            {tasks.map((task) => (

              <article
                className={`task-card priority-card-${task.priority.toLowerCase()}`}
                key={task.id}
              >

                <div className="card-top">

                  <PriorityBadge
                    priority={task.priority}
                  />

                  <StatusBadge
                    status={task.status}
                  />

                </div>

                <h3>
                  {task.title}
                </h3>

                <p className="description">
                  {task.description ||
                    "No description provided."}
                </p>

                <div className="task-meta">

                  <span>
                    Due
                  </span>

                  <strong>
                    {task.dueDate ||
                      "No due date"}
                  </strong>

                </div>

                <div className="card-actions">

                  {task.status !== "COMPLETED" ? (

                    <button
                      className="success-button"
                      onClick={() =>
                        handleComplete(task)
                      }
                    >
                      Complete
                    </button>

                  ) : (

                    <button
                      className="reopen-button"
                      onClick={() =>
                        handleReopen(task)
                      }
                    >
                      Reopen
                    </button>

                  )}

                  <button
                    className="secondary-button"
                    onClick={() =>
                      handleEdit(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(task.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">

      <p>
        {label}
      </p>

      <h2>
        {value}
      </h2>

    </div>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`badge priority-${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const label = status.replace(
    "_",
    " "
  );

  return (
    <span
      className={`badge status-${status.toLowerCase()}`}
    >
      {label}
    </span>
  );
}

export default App;
