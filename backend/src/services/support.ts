import { existsSync } from "fs"
import * as XLSX from 'xlsx';
import * as dotenv from 'dotenv'
import path from "path";

class Support{
    public readFileXLSX = () =>{
        dotenv.config()

        const filePath = path.resolve(__dirname, process.env.DATA_PATH || "");
    
        if(!existsSync(filePath)){
            console.log("Tệp không tồn tại vui lòng đặt tệp! Vui lòng đặt tệp của bạn vào folder src và thay đổi đường dẫn trong .env")
            return null
        }
    
        try {
            const file = XLSX.readFile(filePath)
    
            const sheetName = file.SheetNames[0];
            return file.Sheets[sheetName];
        } catch (error) {
            console.log(error)
            return null
        }
    }
    
    public shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
    
}

export default new Support()