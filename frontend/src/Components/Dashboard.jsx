import {FaSun,FaMoon,FaBook,FaPlus,FaTimes,FaTrash,FaEdit,FaChevronDown,FaChevronUp,FaSearch,} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ApiPath from "../ApiPath";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskForm, setTaskForm] = useState({ id: "", title: "",description: "",});
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

    const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios.get(`${ApiPath()}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setName(res.data.name);
      })
      .catch((err) => {
          console.error(err);
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          toast.error(err.response.data.msg, {
            position: "top-right",
            autoClose: 2000,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
      });
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

  
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setTaskForm({ title: "", description: "" });
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      id: task._id,
      title: task.title,
      description: task.description,
    });
    setIsEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "" });
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {setSearchTerm(e.target.value); };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${ApiPath()}/addtask`,{
          id: userId,
          title: taskForm.title,
          description: taskForm.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });

      closeAddTaskModal();
      displayTasks();
    } catch (error) {
      console.error( "Error adding task:", error.response?.data);
      toast.error(error.response?.data?.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${ApiPath()}/updatetask/${userId}/${editingTask._id}`,{
          title: taskForm.title,
          description: taskForm.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });

      closeEditTaskModal();
      displayTasks();
    } catch (error) {
      console.error("Error updating task:",error.response?.data);
      toast.error(error.response?.data?.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await axios.delete(`${ApiPath()}/deletetask/${userId}/${taskId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });

      displayTasks();
    } catch (error) {
      console.error("Error deleting task:", error.response?.data);
      toast.error(error.response?.data?.msg, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const displayTasks = async () => {
    if (!userId || !token) return;

    try {
      const res = await axios.get(`${ApiPath()}/displaytask/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch tasks", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const taskCompletion = async (taskId, completed) => {
    try {
      const res = await axios.put( `${ApiPath()}/taskcompleted/${taskId}`,{
          completed: !completed,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(!completed ? "Task completed" : "Task not completed", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });

      displayTasks();
    } catch (error) {
      console.error("Failed to toggle completion:", error.message);
      toast.error("Failed to update task", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    displayTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.error("Logout successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const getUserInitials = (name) => {
    return name ? name .split(" ").map((n) => n[0]).join("").toUpperCase(): "";
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day) {
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        day
      );
      setSelectedDate(newDate);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark" : ""}`}>
      <header className={`dashboard-header ${isDarkMode ? "dark" : ""}`}>
        <div className="header-left">
          <div className="lgo">
            <img src={logo} alt="logo" />
          </div>
        </div>

        <div className="header-right">
          <button  className={`theme-toggle ${isDarkMode ? "dark" : ""}`} onClick={toggleDarkMode}>
            {isDarkMode ? (
              <FaSun color="#fbbf24" />
            ) : (
              <FaMoon color="#6b7280" />
            )}
          </button>

          <div className="user-profile">
            <button className={`profile-button ${isDarkMode ? "dark" : ""}`} onClick={toggleProfile}>
              <div className="user-avatar">{getUserInitials(name)}</div>
              <span className={`user-name ${isDarkMode ? "dark" : ""}`}>
                {name.toUpperCase() || "User"}
              </span>
            </button>

            <div className={`dropdown-menu ${isDarkMode ? "dark" : ""} ${ isProfileOpen ? "visible" : "hidden" }`}>
              <button className={`logout-button ${isDarkMode ? "dark" : ""}`} onClick={handleLogout} >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <aside className={`dashboard-sidebar ${isDarkMode ? "dark" : ""}`}>
          <div className="sidebar-section">
            <h3 className={`sidebar-title ${isDarkMode ? "dark" : ""}`}>
              Tasks
            </h3>
            <div className={`sidebar-item active ${isDarkMode ? "dark" : ""}`}>
              <span>Total</span>
              <span className="sidebar-item-count">{tasks.length}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className={`sidebar-title ${isDarkMode ? "dark" : ""}`}>
              Calendar
            </h3>
            <div className={`calendar-container ${isDarkMode ? "dark" : ""}`}>
              <div className="calendar-header">
                <button  className={`calendar-nav-btn ${isDarkMode ? "dark" : ""}`}  onClick={() => navigateMonth(-1)} >
                  &#8249;
                </button>
                <h4 className={`calendar-month ${isDarkMode ? "dark" : ""}`}>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>
                <button className={`calendar-nav-btn ${isDarkMode ? "dark" : ""}`} onClick={() => navigateMonth(1)}>
                  &#8250;
                </button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className={`calendar-weekday ${ isDarkMode ? "dark" : "" }`} >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="calendar-days">
                  {generateCalendarDays().map((day, index) => (
                    <div key={index} className={`calendar-day ${day ? "active" : "inactive"} ${ isToday(day) ? "today" : ""  } 
                    ${isDarkMode ? "dark" : ""}`} onClick={() => handleDateClick(day)}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className={`dashboard-content ${isDarkMode ? "dark" : ""}`}>
          <div className="content-header">
            <h1 className={`content-title ${isDarkMode ? "dark" : ""}`}>
              My Tasks
            </h1>
         
            <div className={`search-container ${isDarkMode ? "dark" : ""}`}>
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search tasks..."  value={searchTerm}
                  onChange={handleSearchChange}  className={`search-input ${isDarkMode ? "dark" : ""}`}/>
              </div>
            </div>
          </div>

          <div className={`calendar-widget ${isDarkMode ? "dark" : ""}`}>
            <div className="calendar-header">
              <h2 className={`calendar-title ${isDarkMode ? "dark" : ""}`}>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <span className={`calendar-date ${isDarkMode ? "dark" : ""}`}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="tasks-container">
              {filteredTasks.length === 0 ? (
                <div className={`no-tasks ${isDarkMode ? "dark" : ""}`}>
                  <p>  {searchTerm.trim() !== ""  ? `No tasks found matching "${searchTerm}"`  : "Click the + button to add your first task!"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div  key={task._id}  className={`task-item-wrapper ${isDarkMode ? "dark" : ""}`}>
                    <div className={`task-item ${isDarkMode ? "dark" : ""}`}>
                      <div className="task-content">
                        
                        <div className={`task-checkbox ${ task.completed ? "checked" : "" } ${isDarkMode ? "dark" : ""}`}
                          onClick={() => taskCompletion(task._id, task.completed) }>
                        </div>

                        <div className="task-content-text"
                          onClick={() => toggleTaskExpansion(task._id)}
                          style={{  display: "flex", alignItems: "center", flex: 1,  cursor: "pointer", }} >
                          <FaBook className="task-icon" color="#fbbf24" />
                          <span className={`task-text ${ task.completed ? "completed" : ""  } ${isDarkMode ? "dark" : ""}`} >
                            {task.title.toUpperCase()}
                          </span>
                          <div className="task-expand-icon">
                            {expandedTasks.has(task._id) ? (
                              <FaChevronUp color="#6b7280" />
                            ) : (
                              <FaChevronDown color="#6b7280" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button className={`task-action-btn edit-btn ${  isDarkMode ? "dark" : "" }`}
                          onClick={() => openEditTaskModal(task)}
                          disabled={task.completed}  title={  task.completed ? "Cannot edit completed task" : "Edit Task" } >
                          <FaEdit />
                        </button>
                        <button className={`task-action-btn delete-btn ${ isDarkMode ? "dark" : "" }`}
                          onClick={() => handleDeleteTask(task._id)} title="Delete Task">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {expandedTasks.has(task._id) && task.description && (
                      <div className={`task-description ${ isDarkMode ? "dark" : "" }`} >
                        <p>{task.description}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

  
      <button className="add-task-btn" onClick={openAddTaskModal}>
        <FaPlus />
      </button>

    
      {isAddTaskModalOpen && (
        <div className="modal-overlay" onClick={closeAddTaskModal}>
          <div className={`modal-content ${isDarkMode ? "dark" : ""}`} onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h2 className={`modal-title ${isDarkMode ? "dark" : ""}`}>
                Add New Task
              </h2>
              <button className={`modal-close-btn ${isDarkMode ? "dark" : ""}`} onClick={closeAddTaskModal} >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="task-form">
              <div className="form-group">
                <label htmlFor="title" className={`form-label ${isDarkMode ? "dark" : ""}`} >
                  Title *
                </label>
                <input type="text" id="title" name="title"
                  value={taskForm.title} onChange={handleTaskFormChange}
                  className={`form-input ${isDarkMode ? "dark" : ""}`}  placeholder="Enter task title"  required />
              </div>

              <div className="form-group">
                <label htmlFor="description" className={`form-label ${isDarkMode ? "dark" : ""}`} >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  className={`form-textarea ${isDarkMode ? "dark" : ""}`}
                  placeholder="Enter task description (optional)"
                  rows="4" />
              </div>

              <div className="form-actions">
                <button  type="button" onClick={closeAddTaskModal} className={`btn-cancel ${isDarkMode ? "dark" : ""}`}>
                  Cancel
                </button>
                <button type="submit" className={`btn-submit ${isDarkMode ? "dark" : ""}`} >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {isEditTaskModalOpen && (
        <div className="modal-overlay" onClick={closeEditTaskModal}>
          <div className={`modal-content ${isDarkMode ? "dark" : ""}`}  onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h2 className={`modal-title ${isDarkMode ? "dark" : ""}`}>
                Edit Task
              </h2>
              <button className={`modal-close-btn ${isDarkMode ? "dark" : ""}`} onClick={closeEditTaskModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditTask} className="task-form">
              <div className="form-group">
                <label  htmlFor="edit-title" className={`form-label ${isDarkMode ? "dark" : ""}`}>
                  Title *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  className={`form-input ${isDarkMode ? "dark" : ""}`}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description" className={`form-label ${isDarkMode ? "dark" : ""}`}>
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  className={`form-textarea ${isDarkMode ? "dark" : ""}`}
                  placeholder="Enter task description (optional)"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button"onClick={closeEditTaskModal}className={`btn-cancel ${isDarkMode ? "dark" : ""}`}>
                  Cancel
                </button>
                <button type="submit"className={`btn-submit ${isDarkMode ? "dark" : ""}`}>
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
