import { useEffect, useState } from "react"
import "./Congratulations.css"
import fireWorkCell from "../assets/ava.png";
import { fireWork1, fireWork2 } from "../affects/Firework";
import logojf from "../assets/text_csejobfair.png"
import { Student } from "../dtos_&_data/dtos";
import left_top from "../assets/cong-right-top.png"
import left_bottom from "../assets/cong-right-bottom.png"
import right_top from "../assets/background-right-top-component.png"
import right_bottom from "../assets/background-right-bottom-component.png"

const Congratulation = ({
    prizes,
    prize,
    setPrizes,
    setPrizesShow,
    onCloseWindow
} : {
    prizes: Student[],
    prize: number,
    setPrizes: (prizes: Student[]) => void;
    setPrizesShow: (prizes: Student[]) => void
    onCloseWindow: () => void
}) => {
    const [typeOfPrize, setTypeOfPrize] = useState<string>("")
    const [gift, setGift] = useState<string>("")

    useEffect(() => {
        if(prize === 2) {
            setTypeOfPrize("Giải nhất")
            setGift("Ổ cứng di động SSD Kingston XS1000 Gen 2 1TB Đen")
        }else if (prize === 1) {
            setTypeOfPrize("Giải nhì")
            setGift("Loa di động kháng nước IPX6 SOUNARC R2 Portable Speaker")
        } else {
            setTypeOfPrize("Giải ba")
            setGift("Bàn phím AULA F75 (Đen + Xanh đậm + Cam/ Grey Wood V3 Switch)")
        }


        const img = new Image();
        img.src = fireWorkCell;

        //Nếu không có ai nhận giải thì xóa người nhận
        let tmpPrizes = prizes
        tmpPrizes = tmpPrizes.filter(p => p.id !== prizes[prize].id)

        if(prize === 2) img.onload = () => fireWork2(img, onCloseWindow, () => setPrizes(tmpPrizes), () => setPrizesShow(tmpPrizes))
        else img.onload = () => fireWork1(img, onCloseWindow, () => setPrizes(tmpPrizes), () => setPrizesShow(tmpPrizes))

        return () => {
        };
    }, [])
    
    return(
        <div className="container-cong">
            <div className="bg-cong">
                <img src={right_top} className="cong-bg-right-top"/>
                <img src={right_bottom} className="cong-bg-right-bottom"/>
                <img src={left_top} className="cong-bg-left-top"/>
                <img src={left_bottom} className="cong-bg-left-bottom"/>
                <div className="logo">
                    <img src={logojf}/>
                </div>
                <h1 className="prize-rank">{typeOfPrize.toUpperCase()}</h1>

                <p className="cong-winner-name">{prizes[prize].name}</p>
                <p className="cong-winner-id">{prizes[prize].id}</p>
                <p className="cong-winner-faculty">{prizes[prize].faculty}</p>

                <p className="cong-gift">{gift}</p>
            </div>
        </div>
    )
}

export default Congratulation