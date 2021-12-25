import mongoose from "mongoose";
import libraryModel from "../library/library.model.js";
import libraryService from "../library/library.service.js";
import studentService from "../student/student.service.js";
import bookStudentModel from './book-student.model.js'
import Response from "../utils/Response.js";
import bookModel from "./book.model.js";
const ObjectId = mongoose.Types.ObjectId;

const createBook = async (libraryId, title, author, pageCount) => {
  try {
    const book = new bookModel({
      title,
      author,
      pageCount,
      library: libraryId,
    });
    await book.save();
    return new Response(200, book);
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

const createBookInLibraryById = async (libraryId, title, author, pageCount) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryService.getLibraryById(libraryId);
    if (lib.statusCode === 200) {
      const book = await createBook(libraryId, title, author, pageCount);

      if (book.statusCode !== 200) {
        return book;
      }
      await libraryService.addBookToTheLibrary(
        libraryId,
        book.responseBody._id
      );

      return new Response(200, book);
    } else {
      return new Response(404, "Library not found");
    }
  } else {
    return new Response(400, "Library not valid");
  }
};

const getAllBooksByLibraryId = async (libraryId) => {
  if (ObjectId.isValid(libraryId)) {
    const lib = await libraryModel.findById(libraryId);
    if (!lib) {
      return new Response(404, "Library not found");
    }

    const books = await lib.populate("books", "title author pageCount");
    return new Response(200, books.books);
  } else {
    return new Response(500, "Library Id not valid");
  }
};

const getBookByIdFromLibraryById = async (bookId, libraryId) => {
  if (!ObjectId.isValid(bookId) || !ObjectId.isValid(libraryId)) {
    return new Response(500, "bookId OR libraryId is NOT VALID");
  }
  const book = await getBookById(bookId);

  if (
    book.statusCode === 200 &&
    book.responseBody.library.toString() === libraryId
  ) {
    return new Response(200, book);
  } else {
    return new Response(
      500,
      `library with Id=${libraryId} doesn't contain book with Id=${bookId}`
    );
  }
};

const deleteBookByIdFromLibraryById = async (bookId, libraryId) => {
  const book = await getBookById(bookId);
  if (
    book.statusCode === 200 &&
    book.responseBody.library.toString() === libraryId
  ) {
    await book.responseBody.remove();
    const lib = await libraryModel.findByIdAndUpdate(
      { _id: libraryId },
      {
        $pull: {
          books: book.responseBody._id,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    return new Response(200, lib);
  } else {
    return new Response(404, "Library or book was not found");
  }
};

const getBookById = async (bookId) => {
  if (ObjectId.isValid(bookId)) {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return new Response(404, "Student not found");
    }
    return new Response(200, book);
  } else {
    return new Response(500, "Book Id not valid");
  }
};

const assignBookByIdToStudentById = async(bookId, libraryId, studentId)=>{
  if (!ObjectId.isValid(bookId) || !ObjectId.isValid(libraryId)) {
    return new Response(500, "bookId OR libraryId is NOT VALID");
  }
  const book = await getBookById(bookId);
  if (book.responseBody.student) {
    return new Response(400, "This book is already in use")
  }
  const library = await libraryService.getLibraryById(libraryId);
  const student = await studentService.getStudentById(studentId);

  if (book.statusCode === 200 && library.statusCode === 200 && student.statusCode === 200) {
    if (book.responseBody.library.toString() === libraryId) {

      book.responseBody.student = studentId;
      student.responseBody.books.push(bookId)
      
      await student.responseBody.save()
      const book = await book.responseBody.save();

      // for book-student model which will be in database only 30 days
      const bookStudent = new bookStudentModel({book: bookId, student: studentId})
      await bookStudent.save()

      return new Response(200, book);
    } else {
      return new Response(
        500,
        `library with Id=${libraryId} dont\'t contain student with Id=${bookId}`
      );
    }
  } else {
    return new Response(500, "incorrect bookId OR libraryId");
  }
}

export default {
  createBook,
  createBookInLibraryById,
  getAllBooksByLibraryId,
  getBookByIdFromLibraryById,
  deleteBookByIdFromLibraryById,
  assignBookByIdToStudentById,
  getBookById,
};
