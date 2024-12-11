
import mongoose from "mongoose";

const AlertSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
    },
    latitude: String,
    longitude: String,
    status: {
        type: String,    
        enum: ["READ", "UNREAD"],
        default: "UNREAD",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user_attend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
        default: null
    },
});

export const Alert = mongoose.model("Alert", AlertSchema);  
