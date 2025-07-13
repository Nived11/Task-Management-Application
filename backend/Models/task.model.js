import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    completed: { type: Boolean, default: false }
}, {
    timestamps: true
});


export default mongoose.models.Task || mongoose.model("Task", taskSchema);