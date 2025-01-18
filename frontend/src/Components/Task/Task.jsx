import { useState, useEffect, useRef } from "react";
import AddButtonTask from "../Common/AddButton/AddButtonTask.jsx";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import { FaTasks } from "react-icons/fa";
// import tasksData from "./tasksData.json";
import "./Task.css";
import axios from "axios";
import { useContext } from "react";
import { CurrentUser } from "../../Context/CurrentUserContext";
import Cookie from "cookie-universal";
import DeleteButton from "../Common/DeleteButtonForResTask/DeleteButton.jsx";
import { baseURL, TASK } from "../../Api/Api";

const Task = ({ role, session }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const newTaskRef = useRef(null);
  const { currentUser } = useContext(CurrentUser);
  const userToken = Cookie().get("academiqa");

  //get all tasks
  useEffect(() => {
    if (currentUser?.role === "Student" || currentUser?.role === "Teacher") {
      if (session?.id) {
        axios
          .get(`${baseURL}/${TASK}/${session?.id}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((response) => {
            setTasks(response.data);
          })
          .catch((error) => {
            console.error(`${error} - Failed to find task`);
          });
      }
    }
  }, [currentUser, session?.id]);

  //add new task (addButton)
  const handleAddTask = () => {
    if (currentUser?.role === "Teacher") {
      if (newTask !== "") {
        axios
          .post(
            `${baseURL}/${TASK}`,
            {
              content: newTask,
              isDone: false,
              session: session,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookie().get("academiqa")}`,
              },
            }
          )
          .then((response) => {
            setTasks((prevTasks) => [...prevTasks, response.data]);
          })
          .catch((error) => {
            console.error(`${error} - Failed to add task`);
          });
      }
      setNewTask("");
      setShowNewTask(false);
    }
  };

  //update the task (checkbox and content)
  const handleUpdateTask = (index, newContent, newIsDone) => {
    const task = tasks[index];
    if (currentUser?.role === "Teacher") {
      if (task && task.id) {
        axios
          .patch(
            `${baseURL}/${TASK}/${task.id}`,
            {
              content: newContent,
              isDone: newIsDone,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookie().get("academiqa")}`,
              },
            }
          )
          .then((response) => {
            setTasks((prevTasks) =>
              prevTasks.map((t, i) =>
                i === index
                  ? {
                      ...t,
                      content: response.data.content,
                      isDone: response.data.isDone,
                    }
                  : t
              )
            );
          })
          .catch((error) => {
            console.error(`${error} - Failed to update task`);
          });
      } else if (!task) {
        console.error("Task not found ");
      } else {
        console.error("Task id not found ");
      }
    }
  };

  //delete the task (deleteButton)
  const handleDeleteTask = (index) => {
    const task = tasks[index];
    if (currentUser?.role === "Teacher") {
      axios
        .delete(`${baseURL}/${TASK}/${task.id}`, {
          headers: {
            Authorization: `Bearer ${Cookie().get("academiqa")}`,
          },
        })
        .then((response) => {
          setTasks((prevTasks) => prevTasks.filter((t, i) => i !== index));
          //console.log(response.data);
        })
        .catch((error) => {
          console.error(`${error} - Failed to delete task`);
        });
    }
  };

  //show the new task input
  const handlePageClick = () => {
    setShowNewTask(true);
  };
  //scroll down to the new task input
  useEffect(() => {
    if (showNewTask) {
      newTaskRef.current.focus();
    }
  }, [showNewTask]);

  return (
    <div className="task h-56">
      <div className="tasks-title pl-8 pr-5 flex">
        Tasks
        {role === "teacher" && <AddButtonTask onClick={handlePageClick} />}
      </div>
      <div
        className="tasks-content"
        style={{ marginTop: "-22px", minWidth: "100%" }}
      >
        <Scrollbar
          thumbColor={"rgba(233, 177, 176, 0.62)"}
          trackColor={"#F5D8D6"}
          maxHeight={"165px"}
        >
          <div className="contentTask">
            <div className="row p-0 d-flex justify-content">
              {tasks.map((task, index) => (
                <div className="custom mb-2" key={task.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "85%",
                    }}
                  >
                    <label
                      className="containerCheck"
                      style={{
                        cursor: role === "student" ? "default" : "cursor",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={() =>
                          handleUpdateTask(index, task.content, !task.isDone)
                        }
                        disabled={role === "student"}
                      />
                      <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                        <path
                          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                          pathLength="575.0541381835938"
                          className="pathCheck"
                        ></path>
                      </svg>
                    </label>
                    <div className="Content">
                      <input
                        className={`inputNewTask ${
                          role === "teacher" && task.isDone ? "crossed" : ""
                        }`}
                        type="text"
                        defaultValue={task.content}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (role === "teacher") {
                              handleUpdateTask(
                                index,
                                e.target.value,
                                task.isDone
                              );
                            }
                            e.target.blur();
                          }
                        }}
                        readOnly={role === "student"}
                      />
                    </div>
                  </div>
                  {role === "teacher" && (
                    <div
                      className="deleteTask"
                      onClick={() => handleDeleteTask(index)}
                    >
                      <DeleteButton />
                    </div>
                  )}
                </div>
              ))}
              {showNewTask && (
                <div className="custom mb-2 d-flex justify-content-start">
                  <label
                    className="containerCheck"
                    style={{ cursor: "default" }}
                  >
                    <input type="checkbox" />
                    <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                      <path
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938"
                        className="pathCheckNew"
                      ></path>
                    </svg>
                  </label>
                  <div className="Content">
                    <input
                      className="inputNewTask"
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onBlur={handleAddTask}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTask();
                        }
                      }}
                      placeholder="Add new task ..."
                      ref={newTaskRef}
                    />
                  </div>
                </div>
              )}
            </div>
            {tasks.length === 0 && !showNewTask && (
              <div className="emptyTasks">
                <FaTasks size={"30px"} />
                <div>No tasks added</div>
              </div>
            )}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default Task;
