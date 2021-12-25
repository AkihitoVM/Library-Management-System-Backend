import mongoose from "mongoose";
import Response from "../utils/Response.js";
import libraryModel from "./library.model.js";
const ObjectId = mongoose.Types.ObjectId;

const createLibrary = async (name, address) => {
  try {
    const lib = new libraryModel({ name, address });
    await lib.save();
    return new Response(200, lib);
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return new Response(404, errors);
    }

    return new Response(500, "Something went wrong");
  }
};

const getAllLibraries = async () => {
  const libs = await libraryModel.find({}).select("_id name address");
  return libs;
};

const getLibraryById = async (libraryId) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryModel.findById(libraryId);
    if (!lib) {
      return new Response(404, "Library not found");
    }

    return new Response(200, lib);
  }

  return new Response(500, "Library Id not valid");
};

const addStudentToTheLibrary = async (libraryId, studentId) => {
  await libraryModel.findByIdAndUpdate(
    libraryId,
    {
      $push: {
        students: studentId,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
};

const addBookToTheLibrary = async (libraryId, bookId) => {
  await libraryModel.findByIdAndUpdate(
    libraryId,
    {
      $push: {
        books: bookId,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
};

const findByIdAndUpdate = async (libraryId, body) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryModel.findByIdAndUpdate(libraryId, body, {
      new: true,
    });
    return new Response(200, lib);
  } else {
    return new Response(500, "Library Id not valid");
  }
};

const findByIdAndDelete = async (libraryId) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryModel.findByIdAndDelete(libraryId);
    return new Response(200, lib);
  }

  return new Response(500, "Library Id not valid");
};

const deleteLibrary = async (libraryId) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryService.findByIdAndDelete(libraryId);
    await studentService.deleteStudentsFromLibrary(libraryId);
    return new Response(lib.statusCode, lib.responseBody);
  } else {
    return new Response(500, "Library Id not valid");
  }
};

export default {
  createLibrary,
  getAllLibraries,
  getLibraryById,
  addStudentToTheLibrary,
  addBookToTheLibrary,
  findByIdAndUpdate,
  findByIdAndDelete,
  deleteLibrary,
};
