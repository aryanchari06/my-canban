import { useEffect, useState } from "react";

function App() {
  const [columns, setColumns] = useState([
    {
      id: Date.now(),
      title: "To-Do",
      tasks: [
        {
          id: 1,
          taskName: "Complete project",
          isComplete: false,
        },
        {
          id: 2,
          taskName: "Complete another project",
          isComplete: false,
        },
      ],
    },
    {
      id: Date.now() + 1,
      title: "Ongoing",
      tasks: [],
    },
    {
      id: Date.now() + 2,
      title: "Completed",
      tasks: [],
    },
  ]);
  const [columnNameInput, setColumnNameInput] = useState();
  const [columnTaskInput, setColumnTaskInput] = useState();

  const setRandomBg = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.random() * 20;
    const l = 75 + Math.random() * 15;

    return hslToHex(h, s, l);
  };

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      Math.round(
        255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
      );

    return `#${[f(0), f(8), f(4)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;
  }

  const handleAddColumn = () => {
    if (!columnNameInput || columnNameInput === "") return;
    setColumns((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: columnNameInput,
        tasks: [],
      },
    ]);
    setColumnNameInput("");
  };

  const handleAddColumnTask = (columnId) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [
            ...col.tasks,
            {
              taskName: columnTaskInput,
              id: Date.now(),
              isComplete: false,
            },
          ],
        };
      }
      return col;
    });
    setColumns(updatedColumns);
    setColumnTaskInput("");

    console.log("clicked");
  };

  const handleDragDrop = (data) => {
    if (data.columnId === data.dropZoneId || !data.dropZoneId) return;
    console.log(data);
    const updatedColumns = columns.map((col) => {
      if (col.id === data.columnId) {
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== data.task.id),
        };
      } else if (col.id === data.dropZoneId) {
        return {
          ...col,
          tasks: [...col.tasks, data.task],
        };
      }
      return col;
    });
    setColumns(updatedColumns);
  };

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("userCanvas", JSON.stringify(columns));
    }, 500);
  }, [columns]);

  useEffect(() => {
    const columns = localStorage.getItem("userCanvas");
    console.log(columns);
    if (columns) setColumns(JSON.parse(columns));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          onChange={(e) => setColumnNameInput(e.currentTarget.value)}
          placeholder="Enter column name"
          value={columnNameInput}
        />
        <button
          onClick={handleAddColumn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Add Column
        </button>
      </div>

      {columns && columns.length > 0 && (
        <ul className="flex flex-wrap gap-6">
          {columns.map((column) => (
            <li
              key={column.id}
              id={column.id}
              style={{ backgroundColor: setRandomBg() }}
              className=" w-72 p-4 rounded-xl shadow-md border border-gray-200 flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const elementData = JSON.parse(
                  e.dataTransfer.getData("text/plain")
                );
                handleDragDrop({
                  ...elementData,
                  dropZoneId: Number(e.target.id),
                });
              }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {column.title}
              </h2>

              <div className="flex-1 min-h-[100px]" id={column.id}>
                {column.tasks.length > 0 && (
                  <ul className="space-y-2">
                    {column.tasks.map((task) => (
                      <li
                        key={task.taskName}
                        className={`rounded-md p-2 bg-opacity-50 bg-[#ffffff78] hover:bg-[#ffffffc5] cursor-move transition ${
                          task.isComplete
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            "text/plain",
                            JSON.stringify({
                              task,
                              columnId: column.id,
                            })
                          );
                        }}
                      >
                        {task.taskName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  onChange={(e) => setColumnTaskInput(e.currentTarget.value)}
                  placeholder="Enter task name"
                />
                <button
                  onClick={() => handleAddColumnTask(column.id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-md transition"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
