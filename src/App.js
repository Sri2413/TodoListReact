import React, { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minutes, setMinutes] = useState("");
  const [ampm, setAmPm] = useState("");
  const [tasks, setTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarGrid, setCalendarGrid] = useState([]);
  const [openAccordions, setOpenAccordions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [anovisi, setAnovisi] = useState(false);
  const [image, setImgae] = useState(true);

  useEffect(() => {
    populateYears();
    updateCalendar();
  }, [selectedMonth, selectedYear]);

  const populateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year <= currentYear + 40; year++) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const updateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const newCalendarGrid = [];

    for (let i = 0; i < firstDay; i++) {
      newCalendarGrid.push(<div key={`empty-${i}`} className="day-cell"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = (
        <div
          key={day}
          className="day-cell"
          onClick={() => handleCalendarClick(day)}
        >
          {day}
        </div>
      );
      newCalendarGrid.push(dayCell);
    }

    setCalendarGrid(newCalendarGrid);
  };

  const handleCalendarClick = (day) => {
    setDate(day);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "myselect":
        setHour(value);
        break;
      case "min":
        setMinutes(value);
        break;
      case "ampm":
        setAmPm(value);
        break;
      default:
        break;
    }
  };

  const handleAddTask = () => {
    if (!date) {
      alert("Please select a date and time before adding a task.");
      return;
    }
    const taskKey = `${getMonthName(selectedMonth)} ${date} ${selectedYear}`;
    const taskValue = document.getElementById("task").value;
    if (tasks[taskKey]) {
      tasks[taskKey].push({
        text: taskValue,
        time: `${hour}:${minutes} ${ampm}`,
      });
    } else {
      tasks[taskKey] = [
        { text: taskValue, time: `${hour}:${minutes} ${ampm}` },
      ];
    }

    setTasks({ ...tasks });
    document.getElementById("task").value = "";
    setImgae(false);
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };

  const handleEditTask = (taskKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey][index] = {
      ...updatedTasks[taskKey][index],
      editing: true,
    };

    setTasks(updatedTasks);
  };

  const handleEditInputChange = (taskKey, index, value) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey][index].text = value;
    setTasks(updatedTasks);
  };

  const handleSaveTask = (taskKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey][index].editing = false;
    setTasks(updatedTasks);
  };

  const handleCancelEdit = (taskKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey][index].editing = false;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey].splice(index, 1);
    setTasks(updatedTasks);

    const remainingTask = Object.values(updatedTasks).flat();
    if (remainingTask.length === 0) {
      setImgae(true);
    }
  };

  const handleCheckboxChange = (taskKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[taskKey][index].completed =
      !updatedTasks[taskKey][index].completed;
    setTasks(updatedTasks);
  };

  const filterTasks = () => {
    const filteredTasks = {};

    for (let key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        const filteredTaskList = tasks[key].filter((task) =>
          task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredTaskList.length > 0) {
          filteredTasks[key] = filteredTaskList;
        }
      }
    }

    return filteredTasks;
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAccordionToggle = (taskKey) => {
    setOpenAccordions((prevAccordions) => {
      if (prevAccordions.includes(taskKey)) {
        return prevAccordions.filter((key) => key !== taskKey);
      } else {
        return [...prevAccordions, taskKey];
      }
    });
  };

  return (
    <>
      <h1
        style={{ textAlign: "center", color: "#166088" }}
        className="gradient"
      >
        TO-DO LIST APP
      </h1>
      <div className="container">
        <div className="search">
          <span>To-Do</span>&nbsp;
          <input
            id="search1"
            type="search"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>

        <div id="card">
          <div className="text">
            <input
              type="text"
              id="task"
              placeholder="Add your To-do Task...."
              required
            />
            &nbsp;
            <br />
            <br />
            <button id="addTask" onClick={handleAddTask}>
              Add Task
            </button>
          </div>

          <div className="time">
            <span className="cla" onClick={() => setVisible(!visible)}>
              &#128197; Today{" "}
            </span>
            <span className="tym" onClick={() => setAnovisi(!anovisi)}>
              &#128337; Set time
            </span>
          </div>
          {visible && (
            <div className="cal">
              <div className="calendar">
                <div className="controls">
                  <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {populateYears()}
                  </select>
                  <select
                    id="monthSelect"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {getMonthName(i)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="days">
                  <div className="day">Sun</div>
                  <div className="day">Mon</div>
                  <div className="day">Tue</div>
                  <div className="day">Wed</div>
                  <div className="day">Thu</div>
                  <div className="day">Fri</div>
                  <div className="day">Sat</div>
                </div>
                <div className="grid">{calendarGrid}</div>
              </div>
            </div>
          )}
          <br />
          {anovisi && (
            <div className="container1">
              <div className="grid">
                <select id="myselect" onChange={handleInputChange}>
                  {Array.from({ length: 13 }, (_, i) => i).map((hour) => (
                    <option
                      key={hour}
                      value={hour < 10 ? `0${hour}` : `${hour}`}
                    >
                      {hour < 10 ? `0${hour}` : `${hour}`}
                    </option>
                  ))}
                </select>
                <select id="min" onChange={handleInputChange}>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option
                      key={minute}
                      value={minute < 10 ? `0${minute}` : `${minute}`}
                    >
                      {minute < 10 ? `0${minute}` : `${minute}`}
                    </option>
                  ))}
                </select>
                <select id="ampm" onChange={handleInputChange}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          )}
          <br />
          <div id="taskList">
            {Object.entries(filterTasks()).map(([taskKey, taskList]) => (
              <div key={taskKey} className="accordion">
                <div
                  className="accordion-header"
                  onClick={() => handleAccordionToggle(taskKey)}
                >
                  {taskKey} &nbsp;&nbsp;&nbsp;&nbsp;<span>&#9660;</span>
                </div>
                <div
                  className={`accordion-content ${
                    openAccordions.includes(taskKey) ? "open" : ""
                  }`}
                >
                  {taskList.map((task, index) => (
                    <div
                      key={index}
                      className={`taskvalue ${
                        task.completed ? "completedTask" : ""
                      }`}
                    >
                      {task.editing ? (
                        <input
                          type="text"
                          value={task.text}
                          onChange={(e) =>
                            handleEditInputChange(
                              taskKey,
                              index,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() =>
                              handleCheckboxChange(taskKey, index)
                            }
                          />
                          {task.text}&nbsp;&nbsp;<span>{task.time}</span>
                          <br />
                        </>
                      )}
                      &nbsp;
                      {task.editing ? (
                        <>
                          <button
                            className="saveBtn"
                            onClick={() => handleSaveTask(taskKey, index)}
                          >
                            Save
                          </button>
                          &nbsp;
                          <button
                            className="cancelBtn"
                            onClick={() => handleCancelEdit(taskKey, index)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="editBtn"
                            onClick={() => handleEditTask(taskKey, index)}
                          >
                            Edit
                          </button>
                          &nbsp;
                          <button
                            className="deleteBtn"
                            onClick={() => handleDeleteTask(taskKey, index)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {image && (
          <img
            className="todoimg"
            style={{
              width: "320px",
              textAlign: "center",
              justifyContent: "center",
              height: "320px",
            }}
            src="https://static.vecteezy.com/system/resources/previews/008/491/236/original/3d-render-icon-check-list-png.png"
            alt="ToDoImage"
          />
        )}
      </div>
    </>
  );
};

export default App;
