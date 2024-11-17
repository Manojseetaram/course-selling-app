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

