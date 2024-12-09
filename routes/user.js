const {Router, response} =require("express")
const userRouter = Router();
const jwt = require("jsonwebtoken")
const {userModel, copiesModel, colorModel,pageModel, sizeModel} = require("../db")
const {JWT_USER_SECRET} = require("../config")
const{ zodLoginverify}=require("../middeware/zodlogin")
const {userjwtverify} =require("../middeware/authJWTuser")
const bcrypt = require("bcrypt");
const multer = require("multer")
require("../middeware/googelauth");

const passport = require("passport");





const { default: mongoose } = require("mongoose");
const { boolean } = require("zod");
require("dotenv").config()

function isLoggedIn(req,res,next){
    req.user? next():res.sendStatus(401);
}

userRouter.post("/signup", zodLoginverify, async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || !email.includes("@") ) {
        return res.status(400).json({
            message: "Email is incorrect",
        });
    }

    try {
     
        const hashPassword = await bcrypt.hash(password, 8);

      
        await userModel.create({
           
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
});


userRouter.post("/signin", zodLoginverify, async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ 
            error: "Email and password are required." 
        });
    }

    try {
       
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                error: "Invalid email or password. Please try again." 
            });
        }

        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                error: "Invalid email or password. Please try again." 
            });
        }

       
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            JWT_USER_SECRET, 
         
        );

        
        return res.status(200).json({
            token,
            message: "Logged in successfully."
        });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ 
            error: "An internal server error occurred. Please try again later." 
        });
    }
});

userRouter.get("/me", userjwtverify, async (req, res) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(400).json({
            message: "Please login"
        });
    }

    try {
      
        const decoded = jwt.verify(token, JWT_USER_SECRET);
             const user = await userModel.findOne({ _id: decoded.id }); 
        
        if (user) {
            return res.json({
                message: "Verified successfully",
                user: user 
            });
        } else {
            return res.status(404).json({
                message: "User not found"
            });
        }

    } catch (error) {
        console.error("Error verifying token or finding user:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


userRouter.get("/",(req,res)=>{
    res.send(`<a href="/auth/google">Authenticate with Google</a>`)
})

userRouter.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect :'/protected',
        failureRedirect :'/auth/failure'
    })
);

userRouter.get('/auth/google',
    passport.authenticate('google',{scope:['email','profile']})
   

    
)
userRouter.get("/protected",isLoggedIn,(req,res)=>{
    res.send(`Hello ${req.user.displayName}`);
})
userRouter.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
  });

  userRouter.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });


userRouter.post("/numberofcopies", async (req, res) => {
    const { numberOfCopies } = req.body;

    
    if (!numberOfCopies || typeof numberOfCopies !== "number" || numberOfCopies <= 0) {
        return res.status(400).json({
            message: "Invalid number of copies. It must be a positive number.",
        });
    }

    try {
      
        const newCopy = new copiesModel({ numberOfCopies });
        await newCopy.save();

        res.status(201).json({
            message: "Number of copies selected successfully!",
            numberOfCopies,
        });
    } catch (err) {
        console.error("Error saving copies:", err);
        res.status(500).json({
            message: "Failed to save copies.",
            error: err.message,
        });
    }
});

userRouter.post("/colorChoice",async(req,res)=>{
    const { color, blackAndWhite, both } = req.body;

    
    if (typeof color !== 'boolean' || typeof blackAndWhite !== 'boolean' || typeof both !== 'boolean') {
        return res.status(400).json({ message: 'All options must be boolean values (true or false).' });
    }

  if (color && blackAndWhite) {
        return res.status(400).json({ message: 'Cannot select both Color and Black & White at the same time. Choose one or select "both".' });
    }

    if (!color && !blackAndWhite && !both) {
        return res.status(400).json({ message: 'At least one option must be selected (Color, Black & White, or Both).' });
    }

    
    if (both && (color || blackAndWhite)) {
        return res.status(400).json({ message: 'When selecting "Both", Color and Black & White must be false.' });
    }
    try {
       
        const newColorChoice = new colorModel({ color, blackAndWhite, both });
        await newColorChoice.save();

    
        let selectedOption = "";

        if (both) {
            selectedOption = "Both Color and Black & White";
        } else if (color) {
            selectedOption = "Color";
        } else if (blackAndWhite) {
            selectedOption = "Black & White";
        }

        res.status(201).json({
            message: 'Color choice saved successfully!',
            selectedOption: selectedOption,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save the color choice', error: err.message });
    }
})


userRouter.post("/pageside",async(req,res)=>{
    const {one , both} = req.body;
   if(typeof one !== 'boolean' || typeof both !== 'boolean'){
  return  res.status(400).json({
        messege:'All option must be boolean values (True or False)'
    })
   }
    if (one && both){
     return res.status(400).json({
            messege:"Can not select two option in same time"
        })
    }
    if(!one && !both){
      return res.status(400).json({
            messege:"At list one option must be selected"
        })
    }
    try{
        const Sides = new pageModel({one,both});
           await Sides.save();

        let selectedOption = one
        ? 'You selected one side successfully'
        : 'You selected both sides successfully';

         res.status(201).json({
         messege:"You successfully selected pages",
         selectedOption,
         })
      
    }catch(e){
         res.status(500).json({
            messege:'Failed to Pageselection',
            essror:e.message
         })
    }
})
   



userRouter.post("/Size",async(req,res)=>{
    const{A4SIZE ,A2SIZE}=req.body;
    if(typeof A4SIZE !== 'boolean' || typeof A2SIZE !== 'boolean'){
        return res.status(400).json({
            messege :"All option must be boolean value (true or false",
        })
    }
 if(A4SIZE && A2SIZE){
     return res.status(400).json({messege:"Can not select two option at same time"})
 }
 if(!A4SIZE && !A2SIZE){return res.status(400).json({messege:"At list one option must be selected"})}
 try{
    const xeroxsize = new sizeModel({A4SIZE,A2SIZE});
    await xeroxsize.save();
   
    selectedOption= A4SIZE ? "You selected A4SIZE": "You Selected A2SIZE";
    res.status(201).json({
        messege:"You Sucsessfully Slected XeroxSize",
        selectedOption
    })


 }catch(e){
    res.status(500).json({
        messege:"Failed to xeroxSize selection",
        error : e.message
    })
 }
    
});







module.exports ={
   userRouter
}