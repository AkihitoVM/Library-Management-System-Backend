import mongoose from "mongoose";
import Response from "../utils/Response.js";
import studentModel from "./student.model.js";
import libraryService from "../library/library.service.js";
import libraryModel from "../library/library.model.js";
const ObjectId = mongoose.Types.ObjectId;

const createStudent = async (name, surname, age, library) => {
  try {
    const student = new studentModel({ name, surname, age, library });
    await student.save();
    return new Response(200, student);
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

const createStudentInLibraryById = async (libraryId, name, surname, age) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryService.getLibraryById(libraryId);
    if (lib.statusCode === 200) {
      const student = await createStudent(name, surname, age, libraryId);
      if (student.statusCode !== 200) {
        return student;
      }
      await libraryService.addStudentToTheLibrary(
        libraryId,
        student.responseBody._id
      );
      return new Response(200, student);
    } else {
      return new Response(404, "Library not found");
    }
  } else {
    return new Response(400, "Library not valid");
  }
};

const getAllStudent = async () => {
  const students = await studentModel.find({}).select("name surname");
  return students;
};

const getAllStudentByLibraryId = async (libraryId) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryModel.findById(libraryId);
    if (!lib) {
      return new Response(404, "Library not found");
    }

    const students = await lib.populate("students", "name surname");

    return new Response(200, students.students);
  } else {
    return new Response(500, "Library Id not valid");
  }
};

const getStudentById = async (studentId) => {
  if (ObjectId.isValid(studentId)) {
    const student = await studentModel.findById(studentId);
    if (!student) {
      return new Response(404, "Student not found");
    }
    return new Response(200, student);
  } else {
    return new Response(500, "Student Id not valid");
  }
};

const getStudentByIdFromLibraryById = async (studentId, libraryId) => {
  if (!ObjectId.isValid(studentId) || !ObjectId.isValid(libraryId)) {
    return new Response(500, "studentId OR libraryId is NOT VALID");
  }
  const student = await getStudentById(studentId);

  if (student) {
    if (student.library.toString() === libraryId) {
      return new Response(200, student);
    } else {
      return new Response(
        500,
        `library with Id=${libraryId} doesn't contain student with Id=${studentId}`
      );
    }
  } else {
    return new Response(500, "Incorrect studentId OR libraryId");
  }
};

const deleteStudentByIdFromLibraryById = async (studentId, libraryId) => {
  const student = await getStudentById(studentId);
  if (student.statusCode === 200) {
    await student.responseBody.remove();
  } else {
    return student;
  }
  const lib = await libraryModel.findByIdAndUpdate(
    { _id: libraryId },
    {
      $pull: {
        students: student.responseBody._id,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  return new Response(200, lib);
};

const deleteStudentsFromLibrary = async (libraryId) => {
  await studentModel.deleteMany({
    library: libraryId,
  });
};

const findByIdAndUpdateFromLibraryById = async (studentId, libraryId, body) => {
  if (!ObjectId.isValid(studentId) || !ObjectId.isValid(libraryId)) {
    return new Response(500, "studentId OR libraryId is NOT VALID");
  }
  const student = await getStudentById(studentId);
  const library = await libraryService.getLibraryById(libraryId);
  if (student.statusCode === 200 && library.statusCode === 200) {
    if (student.responseBody.library.toString() === libraryId) {
      const objectArray = Object.entries(body);

      objectArray.forEach(([key, value]) => {
        if (student.responseBody.toObject().hasOwnProperty(key)) {
          student.responseBody[key] = value;
        }
      });

      const stud = await student.responseBody.save();

      return new Response(200, stud);
    } else {
      return new Response(
        500,
        `library with Id=${libraryId} dont\'t contain student with Id=${studentId}`
      );
    }
  } else {
    return new Response(500, "incorrect studentId OR libraryId");
  }
};

export default {
  createStudentInLibraryById,
  createStudent,
  getAllStudent,
  getStudentById,
  deleteStudentsFromLibrary,
  getAllStudentByLibraryId,
  getStudentByIdFromLibraryById,
  deleteStudentByIdFromLibraryById,
  findByIdAndUpdateFromLibraryById,
};
