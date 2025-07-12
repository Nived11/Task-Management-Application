import bcrypt from "bcryptjs"
import User from "../Models/user.model.js"
import pkg from "jsonwebtoken";
const {sign}=pkg

export const registerUser = async (req,res)=>{
    try {
        const {name,email,password,cpassword}=req.body;
     if(!(name && email && password && cpassword)){
            return res.status(400).json({msg:"all fields are required"})
        }
        if(password!==cpassword)
        return(res.status(404).send({msg:"password not match"}));

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({msg:"user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashedPassword,
        })

        await newUser.save();

        res.status(201).json({msg:"user registered successfully"})
    } catch (error) {
        console.error("registration failed :",error.msg);
        res.status(500).json({msg:"server error"})
    }
}

export async function loginUser(req,res) {
    try {
        const {email,password}=req.body;
    if(!(email&&password))
        return res.status(404).send({msg:"Fields are empty"});
    const user=await User.findOne({email})
    if(user==null)
        return res.status(404).send({msg:"email is not valid"});

    const success=await bcrypt.compare(password,user.password)
    console.log(success);
    if (!success)
        return res.status(401).send({msg:"Invalid password"});
    const token=await sign({userID:user._id},process.env.JWT_SECRET,
        {expiresIn:"24h"});
        console.log(user._id+ "user id");
       console.log(token+"token");
       
        
    res.status(200).send({msg:"successfully loged in",token,userId:user._id})
        
    } catch (error) {
        console.error("Login failed:", error.message);
res.status(500).send({ msg: "Login failed", error: error.message });
    }
}

export async function dashBoard(req,res){
    try{
        console.log("end point");
        console.log(req.user);
        const _id=req.user.userID;
        console.log(_id);
        
        const user=await User.findOne({_id});
        res.status(200).send({_id:_id, name:user.name, email:user.email});  
    }catch(error){
        console.error("Dashboard access failed:", error.message);
        res.status(400).send({error})
    }
}