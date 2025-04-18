
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String , default: "https://res.cloudinary.com/dupiobvsv/image/upload/v1739006251/user_empty_iohnke.jpg"},
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  allergies:{
    type:Array
  },
  records:{
    type:Array
  },
  encryptionKey:{
    type:Buffer,
    default:null
}

});

export default mongoose.model("User", UserSchema);
