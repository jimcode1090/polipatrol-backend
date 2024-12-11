import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  rank: String,
  first_name: String,
  last_name: String,
  number_cip: String,
  phone: String,
  avatar: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  active: {
    type: Boolean,
    default: false,
  }
});

export const User = mongoose.model("User", UserSchema);
