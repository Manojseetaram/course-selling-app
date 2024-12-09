const mongoose = require("mongoose")
const Schema = mongoose.Schema;
// const {MONGO_URL} = require("./config")
require("./config")

const ObjectId = mongoose.Types.ObjectId;



const userSchema = new Schema({
    
     email : {type: String,unique : true},
     password : String

});
const adminSchema = new Schema({
     email :{type: String,unique : true},
    
     password : String
});


const copiesSchema = new Schema({
         numberOfCopies :{
          type:Number,required :true,min:1
         }
        
})
const colorSchema = new Schema({
     color: {
          type: Boolean,
          required: true,  
      },
      blackAndWhite: {
          type: Boolean,
          required: true,  
      },
      both: {
          type: Boolean,
          required: true,  
      },
})
const pageSchema = new Schema({
     one :{
          type : Boolean,
          required:true
     },
     both :{
          type:Boolean,
          required:true

     }
})
const SizeSchema = new Schema({
     A4SIZE :{
          type:Boolean,
          require :true
     },
     A2SIZE :{
          type:Boolean,
          require:true
     }
})

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);


const copiesModel = mongoose.model("copies",copiesSchema);
const colorModel = mongoose.model("color",colorSchema);
const pageModel = mongoose.model("pages",pageSchema)
const sizeModel = mongoose.model("Size",SizeSchema)
module.exports ={
    userModel,
    adminModel,
    copiesModel,
    colorModel,
    pageModel,
    sizeModel
}