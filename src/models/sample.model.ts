import mongoose from "mongoose";

export const SampleSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
});

export const Sample = mongoose.model("Sample", SampleSchema);
