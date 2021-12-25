import mongoose from "mongoose";

const BookStudentSchema = new mongoose.Schema({
  book:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Book"
  },
  student:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days in seconds
  },
});

export default mongoose.model("BookStudent", BookStudentSchema);