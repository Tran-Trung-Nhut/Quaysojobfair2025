import axios from 'axios';
import {useEffect, useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import "./App.css"
import Congratulation from './components/Congratulations';
import GetStudent from './components/GetStudent';
import fireWorkCell from "./assets/ava.png"
import { fireWork1, fireWork2 } from './affects/Firework';
import right_top from "./assets/background-right-top-component.png"
import right_botton from "./assets/background-right-bottom-component.png"
import left_top from "./assets/background-left-top-component.png"
import pointer from "./assets/pointer.png"
import first_prize from "./assets/first-prize.png"
import second_prize from "./assets/seconde-prize.png"
import third_prize from "./assets/third-prize.png"
import textjf from "./assets/text_csejobfair.png"
import { Student } from './dtos_&_data/dtos';
import { defaultDataWheel, mssvDoanHoi } from './dtos_&_data/defaultData';


const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [typePrize, setTypePrize] = useState<number>(-1)
  const [students, setStudents] = useState<Student[]>([])
  const [dataWheel, setDataWheel] = useState<WheelData[]>(defaultDataWheel)
  const [invokedStudent, setInvokedStudent] = useState<string[]>([])
  const [isShowWinner, setIsShowWinner] = useState<boolean>(false)
  const [isGetStudents, setIsGetStudents] = useState<boolean>(false)
  const [prizes, setPrizes] = useState<Student[]>([])
  const [prizesShow, setPrizesShow] = useState<Student[]>([])

  const isDeletePressRef = useRef(false);


  const handleSpinClick = () => {
    const newPrizeIndex = Math.floor(Math.random() * dataWheel.length);
    setPrizeIndex(newPrizeIndex);
    let type = 0
    for(; type < 3; type++){
        if(prizes[type] === undefined){
            break;
        }
    }
    setTypePrize(type)
    setInvokedStudent([...invokedStudent, dataWheel[newPrizeIndex].option || ""]);
    setPrizes([...prizes, students[newPrizeIndex]])
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    if(dataWheel[prizeIndex].option === undefined){
      setMustSpin(false)
      return
    }
    setMustSpin(false);
    setIsShowWinner(true)
    setPrizesShow(prizes)
    
    localStorage.setItem("prizes", JSON.stringify(prizes))
    localStorage.setItem("invokedStudent", JSON.stringify(invokedStudent))

    setDataWheel(dataWheel.filter(data => data.option !== dataWheel[prizeIndex].option))
    setStudents(students.filter(student => student.id !== students[prizeIndex].id))
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.post("http://localhost:10000/students/ten-students", {
        lst: invokedStudent,
      });
      console.log(invokedStudent)
  
      const fetchedStudents = response.data.data; 
      setStudents(fetchedStudents);
  
      const updatedDataWheel = defaultDataWheel.map((data, index) => ({
        ...data,
        option: fetchedStudents[index]?.id,  
      }));
  
      setDataWheel(updatedDataWheel);  
      setIsGetStudents(true);

      document.documentElement.style.setProperty("--animation-state", "none")
  
      setTimeout(() => setIsGetStudents(false), 13000); 
    } catch (error) {
      setDataWheel(defaultDataWheel); 
    }
  };
  
  useEffect(() => {
    const storedPrizes = localStorage.getItem("prizes")
    if(storedPrizes){
      setPrizes(JSON.parse(storedPrizes))
      setPrizesShow(JSON.parse(storedPrizes))
    }

    const storeInvokedStudent = localStorage.getItem("invokedStudent")
    if(storeInvokedStudent){
      setInvokedStudent(JSON.parse(storeInvokedStudent))
    }else{
      setInvokedStudent(mssvDoanHoi)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const img = new Image();
      img.src = fireWorkCell;
      if(event.key === "1"){
        img.onload = () => fireWork1(img, () => {}, () => {}, () => {})
      }

      if (event.key === "2"){
        img.onload = () => fireWork2(img, () => {}, () => {}, () => {})
      }

      if (event.key === "Delete"){
        isDeletePressRef.current = true
      }

      if (event.key === "p" && isDeletePressRef.current) {
        setPrizesShow(prev => {
          if (prev.length === 0) return prev;
          const updatedPrizes = prev.slice(0, -1);
          setPrizes(updatedPrizes);
          localStorage.setItem("prizes", JSON.stringify(updatedPrizes));
          return updatedPrizes;
        });
      }

      if (event.key === "s" && isDeletePressRef.current) {
        setInvokedStudent(mssvDoanHoi)
        localStorage.setItem("invokedStudent", JSON.stringify(mssvDoanHoi))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if(event.key === "Delete"){
        isDeletePressRef.current = false
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [])

  return (
     <div className='container'>
        <img className='bg-right-top-component' src={right_top}/>
        <img className='bg-right-bottom-component' src={right_botton}/>
        <img className='bg-left-top-component' src={left_top}/>
        <img className='textjf' src={textjf}/>
        {isShowWinner && (
          <Congratulation 
          prize={typePrize} 
          prizes={prizes}
          onCloseWindow={() => setIsShowWinner(false)}
          setPrizes={setPrizes}
          setPrizesShow={setPrizesShow}
          />)}
        {isGetStudents && (<GetStudent students={students}/>)}
        <div className='minigame'>
          <p>MINI<span>GAME</span></p>
        </div>
        <div>
          <div className='wheel-button-container'>
            <div className='board-container'>
              <div className='prizes-board'>
                <p>Giải thưởng</p>
                <div>
                  <p style={{color: "white", fontSize: "18px", fontWeight: "bold"}}>Giải nhất</p>
                    <div className='prize-container'>
                      <div className='prize-img-container'>
                        <img src={first_prize}  style={{width: "100%"}}/>
                      </div>
                      <p style={{color: "white"}}>
                        {prizesShow[2] === undefined? "Ổ cứng di động SSD Kingston XS1000 Gen 2 1TB Đen" : (
                          <p>
                            <span style={{color: "#FFC850", fontWeight: "bold"}}>{prizesShow[2].name}</span><br/>
                            <span style={{fontStyle: "italic"}}>{prizesShow[2].id}</span><br/>
                            <span>{prizesShow[2].faculty}</span>
                        </p>
                        )}
                      </p>
                    </div>
                </div>
                <div >
                  <p style={{color: "white", fontSize: "18px", fontWeight: "bold"}}>Giải nhì</p>
                    <div className='prize-container'>
                      <div className='prize-img-container'>
                        <img src={second_prize}  style={{width: "100%"}}/>
                      </div>
                      <p style={{color: "white"}}>
                        {prizesShow[1] === undefined? "Loa di động kháng nước IPX6 SOUNARC R2 Portable Speaker" : (
                          <p>
                            <span style={{color: "#FFC850", fontWeight: "bold"}}>{prizesShow[1].name}</span><br/>
                            <span style={{fontStyle: "italic"}}>{prizesShow[1].id}</span><br/>
                            <span>{prizesShow[1].faculty}</span>
                        </p>
                        )}
                      </p>
                    </div>
                </div>
                <div>
                  <p style={{color: "white", fontSize: "18px", fontWeight: "bold"}}>Giải ba</p>
                    <div className='prize-container'>
                      <div className='prize-img-container'>
                        <img src={third_prize} style={{width: "100%"}}/>
                      </div>
                      <p style={{color: "white"}}>
                        {prizesShow[0] === undefined? "Bàn phím AULA F75 (Đen + Xanh đậm + Cam/ Grey Wood V3 Switch)" : (
                          <p>
                            <span style={{color: "#FFC850", fontWeight: "bold"}}>{prizesShow[0].name}</span><br/>
                            <span style={{fontStyle: "italic"}}>{prizesShow[0].id}</span><br/>
                            <span>{prizesShow[0].faculty}</span>
                          </p>
                        )}
                      </p>
                    </div>
                </div>
              </div>
            </div>
            <div  className='wheel-container'>
              <button onClick={() => handleSpinClick()}>
                <img src={pointer}/>
              </button>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeIndex}
                data={dataWheel}
                backgroundColors={['#3e3e3e', '#df3428']}
                fontSize={22}
                fontWeight={900}
                outerBorderWidth={0}
                innerBorderWidth={0}
                outerBorderColor={'#000'}
                radiusLineWidth={0}
                innerRadius={1}
                spinDuration={2}
                onStopSpinning={() => handleStopSpinning()}
              />
              <div className='new-turn'>
                <button type='button' onClick={() => fetchStudents()}>Lượt quay mới</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default App;
