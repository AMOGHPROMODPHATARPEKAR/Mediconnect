import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";
import UserSchema from "./UserSchema.js";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ticketPrice: { type: String, required: true },
    
    
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/,function(next){
 this.populate('user').populate({
  path:'doctor',
  select:'name'
 })

 next();
})

bookingSchema.statics.updateAppointments = async function(Booking){
  await DoctorSchema.findByIdAndUpdate(
    Booking.doctor,
    {
      $push:{"appointments":Booking._id}
    }
  );


  await UserSchema.findByIdAndUpdate(
    Booking.user,
    {
      $push:{"appointments":Booking._id}
    }
  )

}

bookingSchema.post("save",function(){
  this.constructor.updateAppointments(this);
})

export default mongoose.model("Booking", bookingSchema);