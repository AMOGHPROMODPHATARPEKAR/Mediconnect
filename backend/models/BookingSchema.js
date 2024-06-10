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

// Static method to remove appointments when booking is deleted
bookingSchema.statics.removeAppointments = async function (booking) {
  await DoctorSchema.findByIdAndUpdate(
    booking.doctor,
    { $pull: { appointments: booking._id } }
  );

  await UserSchema.findByIdAndUpdate(
    booking.user,
    { $pull: { appointments: booking._id } }
  );
};

bookingSchema.post("save",function(){
  this.constructor.updateAppointments(this);
})

// Middleware to remove appointments when booking is deleted
bookingSchema.pre('remove', function (next) {
  this.constructor.removeAppointments(this).then(() => next());
});

export default mongoose.model("Booking", bookingSchema);