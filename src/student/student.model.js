import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
  },
  surname: {
    type: String,
    required: [true, "Surname is a required field"],
  },
  age: {
    type: Number,
    required: [true, "Age is a required field"],
  },
  library: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Library",
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Student", UserSchema);
