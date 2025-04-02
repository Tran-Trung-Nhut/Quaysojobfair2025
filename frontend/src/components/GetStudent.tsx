import "./GetStudent.css"
import logojf from "../assets/text_csejobfair.png"
import right_top from "../assets/background-right-top-component.png"
import right_bottom from "../assets/background-right-bottom-component.png"
import { Student } from "../dtos_&_data/dtos"

const GetStudent = ({students} : {students: Student[]}) =>{
    return(
        <div className="container-stu">
            <div className="bg-stu">
                <img className="right-top" src={right_top}/>
                <img className="right-bottom" src={right_bottom}/>
                <div className="logo">
                    <img src={logojf}/>
                </div>
                <ul className="ul-stu">
                    {students.map((student, index) => (
                        <li className={`li-stu ${index % 2 === 0? "li-stu-text-strongblue" : ""}` } key={student.id}>{student.id}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default GetStudent