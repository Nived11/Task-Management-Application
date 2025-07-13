import Task from "../Models/task.model.js";

export const addTask = async (req, res) => {
  try {
    const { title, description, id } = req.body; 
    const task = new Task({ title, description, userId: id });
    await task.save();
    res.status(201).json({ msg: "Task added successfully" });
  } catch (error) {
    console.error("Task creation failed:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const displayTask = async (req, res) => {
  try {
    const { id } = req.params; // userId from URL
    const tasks = await Task.find({ userId: id }).sort({ createdAt: -1 }); // latest first
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetching tasks failed:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


export const DeleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    console.error("Deleting task failed:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { title, description } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { title, description },
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    res.status(200).json({ msg: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Task update failed:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


export const taskCompleted = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json({ msg: "Task completed", task });
  } catch (error) {
    console.error("Error toggling complete:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
