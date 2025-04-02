import { Request, Response } from "express";
import * as XLSX from "xlsx"; 
import  support from "../services/support";
import { StudentDto } from "../dtos/student.dto";

class UserController{
    private sheet: XLSX.WorkSheet | null;

    constructor() {
        this.sheet = support.readFileXLSX()
    }

    public getTenStudents = async (req: Request, res: Response) => {
        const lst : string[] = req.body.lst;
        try {

            if(!this.sheet){
                return res.status(400).json({error: "Lỗi đọc file null"})
            }

            const jsonData : StudentDto[] = XLSX.utils.sheet_to_json(this.sheet);
            const randomStudentList : StudentDto[] = support.shuffleArray(jsonData)

            const tenRandomStudents = [];
            let indexStudent = 0;

            while(tenRandomStudents.length < 10){
                if(!lst.includes((randomStudentList[indexStudent].id).toString())){
                    tenRandomStudents.push(randomStudentList[indexStudent])
                }
                indexStudent += 1;
            }

            return res.status(200).json({data: tenRandomStudents})

        } catch (error) {
          return res.status(500).json({error})
        }
    }

    public getAllPresentStudents = (req: Request, res: Response) => {
        try {
            if(!this.sheet){
                return res.status(400).json({error: "Lỗi đọc file null"})
            }

            const jsonData : StudentDto[]  = XLSX.utils.sheet_to_json(this.sheet);

            return res.status(200).json({data: jsonData})
        } catch (error) {
            return res.status(500).json({error})
        }
    }
}

export default new UserController()