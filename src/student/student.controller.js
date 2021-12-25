import { Router } from "express";
import mongoose from "mongoose";
import libraryModel from "../library/library.model.js";
import libraryService from "../library/library.service.js";
import studentService from "./student.service.js";
const ObjectId = mongoose.Types.ObjectId;
const router = Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { name, surname, age } = req.body;
  const { libraryId } = req.params;
  const student = await studentService.createStudentInLibraryById(libraryId, name, surname, age)
  res.status(student.statusCode).send(student.responseBody)
});

router.get("/", async (req, res) => {
  const { libraryId } = req.params;
  const students = await studentService.getAllStudentByLibraryId(libraryId)
  res.status(students.statusCode).send(students.responseBody)
});

router.get("/:studentId", async (req, res) => {
  const { studentId, libraryId } = req.params;
  const studentResponse = await studentService.getStudentByIdFromLibraryById(studentId, libraryId);
  res.status(studentResponse.statusCode).send(studentResponse.responseBody);
});

router.delete("/:studentId", async (req, res) => {
  const { studentId, libraryId } = req.params;
  const resp = await studentService.deleteStudentByIdFromLibraryById(studentId, libraryId)
  res.status(resp.statusCode).send(resp.responseBody)
});

router.patch("/:studentId", async (req, res) => {
  const { studentId, libraryId } = req.params;
  const stud = await studentService.findByIdAndUpdateFromLibraryById(studentId, libraryId, req.body)
  res.status(stud.statusCode).send(stud.responseBody)
});

export default router;
