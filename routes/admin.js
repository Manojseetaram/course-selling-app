const {Router} = require("express")
const adminRouter = Router();
const jwt = require("jsonwebtoken")
const {adminModel} = require("../db")
const {JWT_ADMIN_SECRET} = require("../config")
const bcrypt = require("bcrypt");
const {zodLoginverify}=require("../middeware/zodlogin");
const {adminjwtverify}= require("../middeware/authJWtadmin")

 adminRouter.post("/signup", zodLoginverify,async(req,res)=>{
   const { email, password } = req.body;

    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({
            message: "Email is incorrect",
        });
    }

    try {
     
        const hashPassword = await bcrypt.hash(password, 8);

      
        await adminModel.create({
            email,
            password: hashPassword,
        });

        return res.status(201).json({
            message: "Signup successfully",
        });
    } catch (e) {
        return res.status(500).json({
            message: "Some error occurred",
            error: e.message,
        });
    }
 })
 adminRouter.post("/login",zodLoginverify,async(req,res)=>{
   const {email,password}= req.body;
   
   if(!email || !password){
   return res.status(400).json({messege :"Ivalid user and password"})
   }
   try{
      const admin= await adminModel.findOne({email})
      if(!admin){
         return res.status(400).json({messege:"Invalid user or password please try again"})
      }
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if(!isPasswordMatch){
         return res.status(400).json({
            messege : 'Invalid password plese try agin'
         })
         
      }
      const token = jwt.sign({
         email : admin.email,
         id : admin._id
      },JWT_ADMIN_SECRET)


     res.status(201).json({
      token,
      messege : "Signin successfully"
     })
   }catch(e){
        res.status(500).json({
         messege : "Server error occured plese try again",
         error : e.messege
        })
   }
 })
adminRouter.get("/verify",  adminjwtverify,async(req,res)=>{
   const{token} = req.headers
   if(!token){
      return res.status(400).json({
         messege:"Plese Login"
      })
   }
   try{
  const decoded = jwt.verify(token , JWT_ADMIN_SECRET)
  const admin = await adminModel.find({id : decoded._id})
  if(admin){
    return res.status(201).json({
      messege:"Verify successfully",
      admin
    })
  }else{
   res.status(404).json({messegE:'User not found'})
  }
   }catch(e){
    return res.status(500).json({messege :"Internal server error",error:e.messege})
   }
})

module.exports = {
    adminRouter
}
