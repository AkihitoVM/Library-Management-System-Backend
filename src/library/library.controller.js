import { Router } from "express";
import mongoose from "mongoose";
import libraryService from "./library.service.js";
import studentController from "../student/student.controller.js";
import bookController from "../book/book.controller.js";

const router = Router({ mergeParams: true });

router.use("/:libraryId/student", studentController);
router.use("/:libraryId/book", bookController);
router.use("/:libraryId/student/:studentId/book", bookController);

router.post("/", async (req, res, next) => {
  const { name, address } = req.body;
  const response = await libraryService.createLibrary(name, address);
  res.status(response.statusCode).send(response.responseBody);
});

router.get("/", async (req, res, next) => {
  const libs = await libraryService.getAllLibraries();
  res.send(libs);
});

router.get("/:libraryId", async (req, res) => {
  const { libraryId } = req.params;
  const lib = await libraryService.getLibraryById(libraryId);
  res.status(lib.statusCode).send(lib.responseBody);
});

router.patch("/:libraryId", async (req, res) => {
  const { libraryId } = req.params;
  const lib = await libraryService.findByIdAndUpdate(libraryId, req.body);
  res.status(lib.statusCode).send(lib.responseBody);
});

router.delete("/:libraryId", async (req, res) => {
  const { libraryId } = req.params;
  const lib = await libraryService.deleteLibrary(libraryId)
  res.status(lib.statusCode).send(lib.responseBody)
});

export default router;
