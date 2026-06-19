import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    refreshToken:String,
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    followers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, {
    timestamps:true
});

const User = mongoose.model("User",userSchema);

export default User;