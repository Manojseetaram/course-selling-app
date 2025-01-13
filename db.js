const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
     email: { type: String, unique: true, required: true },
     password: { type: String, required: true },
     isAdmin: { type: Boolean, default: false },
     isverfied: {
          type: String,
          default: false
     },
     verifycode: String,

}, { timestamps: true });




const fileSchema = new Schema({
     filename: {
          type: String,
          required: true,
     },
     filetype: {
          type: String,
          required: true,
     },
     numberOfCopies: {
          type: Number,
          default: 1,
          required: true,
     },
     isColour: {
          type: String,
          default: "black & white",
          required: true,
          enum: ["colour", "black & white"],
     },
     sizeOfPage: {
          type: String,
          default: "A4",
          required: true,
          enum: ["A4", "A2"],
     },
     sizeOfFile: {
          type: String,
          required: true,
     },
});

const multipleFileSchema = new Schema({
     username: {
          type: String,
          required: true,
     },
     totalFiles: {
          type: Number,
          required: true,
     },
     files: [fileSchema],
}, { timestamps: true });

// Creating models
const UserModel = mongoose.model("User", userSchema);
const FileModel = mongoose.model("File", fileSchema);
const MultipleFileModel = mongoose.model("MultipleFile", multipleFileSchema);

// Exporting models
module.exports = {
     UserModel,
     FileModel,
     MultipleFileModel,
};
