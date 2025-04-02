import { Router } from "express";
import studentController from "../controllers/student.controller";

const router = Router()

router.post('/ten-students', studentController.getTenStudents as any);
router.get('/all-students', studentController.getAllPresentStudents as any)

export default router