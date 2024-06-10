import mongoose from "mongoose";

const VerifySchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: "Doctor",
        required: true,
      },
    qualifications: {
      type: Array,
    },

    experiences: {
      type: Array,
    },
  
    
  });
  
  export default mongoose.model("Verify", VerifySchema);