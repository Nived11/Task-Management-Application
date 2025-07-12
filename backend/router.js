import { Router } from "express";
import Auth from "./Middleware/auth.js"
import * as registeruser from "./RequestHandler/user.rh.js"


const router=Router()

router.route("/register").post(registeruser.registerUser)
router.route("/login").post(registeruser.loginUser)

export default router