import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is a required field"],
  },
  author: {
    type: String,
    required: [true, "Author is a required field"],
  },
  pageCount:{
    type: Number,
    required: [true, "PageCount is a required field"],
  },
  library:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Library"
  },
  student:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Book", BookSchema);