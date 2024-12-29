import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";
import UserSchema from "./UserSchema.js";
import { deleteAppointmentEmail } from '../Controllers/emailContoller.js';

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
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
    },
    date: {
      type: String,
      required: true
    },
    remarks:{
      type:String,
    },
    reportUrl:{
      type:String
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Create a TTL index that will trigger our completion check
bookingSchema.index({ expiresAt: 1 });

// Add pre-save middleware to check and update status
bookingSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date() && this.status !== 'cancelled') {
    this.status = 'completed';
  }
  next();
});

// Add a scheduled task to update expired appointments
bookingSchema.statics.updateExpiredAppointments = async function() {
  const now = new Date();
  await this.updateMany(
    {
      expiresAt: { $lt: now },
      status: { $nin: ['completed', 'cancelled'] }
    },
    {
      $set: { status: 'completed' }
    }
  );
};

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'doctor',
    select: 'name'
  });
  next();
});

bookingSchema.statics.updateAppointments = async function(Booking) {
  await DoctorSchema.findByIdAndUpdate(
    Booking.doctor,
    {
      $push: { "appointments": Booking._id }
    }
  );

  await UserSchema.findByIdAndUpdate(
    Booking.user,
    {
      $push: { "appointments": Booking._id }
    }
  );
};

bookingSchema.statics.removeAppointments = async function(booking) {
  await DoctorSchema.findByIdAndUpdate(
    booking.doctor,
    { $pull: { appointments: booking._id } }
  );

  await UserSchema.findByIdAndUpdate(
    booking.user,
    { $pull: { appointments: booking._id } }
  );

  await deleteAppointmentEmail({
    email: booking.user.email,
    username: booking.user.name,
    doctorName: booking.doctor.name,
    date: booking.date,
  });
};

bookingSchema.post("save", function() {
  this.constructor.updateAppointments(this);
});

bookingSchema.pre('remove', function(next) {
  this.constructor.removeAppointments(this).then(() => next());
});

export default mongoose.model("Booking", bookingSchema);