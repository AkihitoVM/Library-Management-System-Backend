import { Router } from "express";
import bookService from "./book.service.js";
const router = Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { libraryId } = req.params;
  const { title, author, pageCount } = req.body;
  const bookResponse = await bookService.createBookInLibraryById(libraryId,title, author, pageCount)
  res.status(bookResponse.statusCode).send(bookResponse.responseBody)
});

router.get("/", async (req, res) => {
  const { libraryId } = req.params;
  const books = await bookService.getAllBooksByLibraryId(libraryId)
  res.status(books.statusCode).send(books.responseBody)
});

router.get("/:bookId", async (req, res) => {
  const { bookId, libraryId } = req.params;
  const book = await bookService.getBookByIdFromLibraryById(bookId, libraryId)
  res.status(book.statusCode).send(book.responseBody);
});

router.delete("/:bookId", async (req, res) => {
  const { libraryId, bookId } = req.params;
  const book = await bookService.deleteBookByIdFromLibraryById(bookId, libraryId)
  res.status(book.statusCode).send(book.responseBody)
});

router.patch("/", async(req, res)=>{
  const { libraryId, bookId, studentId} = req.params;
  const bookResponse = await bookService.assignBookByIdToStudentById(bookId, libraryId, studentId)
  res.status(bookResponse.statusCode).send(bookResponse.responseBody)
})

export default router;
