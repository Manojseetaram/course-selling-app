# Alvas printify Backend code
- initialize a new Node.js project
- step by step router for User side
- login page 
- upload file






# course-selling-app
-initialize a new Node.js project
-User side router structure Authentication and profile management
/login , /register./ profile : Display user profile details (optional)
- File selection and Upload : / upload - Allows users to upload a PDF or image
-Order Details : /order-details : number of copies,color,select pages
-Payment Process :/payment : Handles the paymnet process using a paymnet gateway.
-Oeder Confirmation : /confirmation : Generated Token number after paymnet is success full

POST    /login               -> User login authentication
POST    /upload              -> Upload file (PDF/Image)
GET     /gallery             -> Fetch user's gallery files
POST    /options             -> Submit xerox options
POST    /payment             -> Process payment
GET     /token               -> Retrieve OTP/token
GET     /order-status/:token -> Check order status

User Authentication:

    POST /login: User logs in.
    POST /logout: User logs out.

Gallery and Document Selection:

    GET /gallery: Fetches the user's gallery of PDFs/images.
    POST /select-document: User selects the document to print.

Xerox Order Details:

    POST /order: User specifies the number of copies, page count, and color choice.
    GET /order-summary: Displays the order details (copies, color, total price).
    POST /pay: Processes the payment.

OTP and Token Generation:

    POST /payment-success: Generates OTP/token after successful payment.
    GET /order-status: Displays the order status and token information.

Pickup and Token Verification:

    POST /verify-token: User shows the token to confirm pickup.
    //
# mongo db

//Upload file (PDF/Image)
.post("/upload",(req,res)=>{
   
})
//Retrieve OTP/token
userRouter.get("/token",(req,res)=>{
    

})
//Check order status
userRouter.get("/order-status",(req,res)=>{

})

//Submit xerox options
.post("/optional",(req,res)=>{

})
//Fetch user's gallery files
.get("/gallery",(req,res)=>{

})
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();

const userRouter = Router();

// Import dependencies
const { userModel } = require("../db");
const { JWT_USER_SECRET } = require("../config");
const { zodLoginverify } = require("../middeware/zodlogin");
const { userjwtverify } = require("../middeware/authJWTuser");

// Helper function to check if user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

// Signup route
userRouter.post("/signup", zodLoginverify, async (req, res) => {
    const { email, password } = req.body;

    // Validate email
    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user in the database
        await userModel.create({ email, password: hashedPassword });

        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "An error occurred during signup" });
    }
});

// Signin route
userRouter.post("/signin", zodLoginverify, async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Find the user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_USER_SECRET);
        res.status(200).json({ token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ error: "An error occurred during signin" });
    }
});

// Get user details
userRouter.get("/me", userjwtverify, async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, JWT_USER_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Verified successfully", user });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Google OAuth routes
userRouter.get("/", (req, res) => {
    res.send(`<a href="/auth/google">Authenticate with Google</a>`);
});

userRouter.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

userRouter.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure"
}));

userRouter.get("/auth/failure", (req, res) => {
    res.send("Authentication failed");
});

userRouter.get("/protected", isLoggedIn, (req, res) => {
    res.send(`Hello, ${req.user.name || "User"}!`);
});

module.exports = { userRouter };
