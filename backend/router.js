import { Router } from "express";
import Auth from "./Middleware/auth.js"
import * as registeruser from "./RequestHandler/user.rh.js"
import * as tasks from "./RequestHandler/task.rh.js"


const router=Router()

router.route("/register").post(registeruser.registerUser)
router.route("/login").post(registeruser.loginUser)
router.route("/dashboard").get(Auth, registeruser.dashBoard)

router.route("/addtask").post(Auth, tasks.addTask)
router.route("/displaytask/:id").get(Auth, tasks.displayTask)
router.route("/updatetask/:userId/:taskId").put(Auth, tasks.updateTask)
router.route("/deletetask/:userId/:taskId").delete(Auth, tasks.DeleteTask)
router.route("/taskcompleted/:taskId").put(Auth, tasks.taskCompleted)

export default router