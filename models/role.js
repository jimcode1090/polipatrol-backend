import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "ceopol", "basic"],
    required: true,
  },
});

export const Role = mongoose.model("Role", RoleSchema);
