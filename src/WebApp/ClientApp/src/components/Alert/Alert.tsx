import { useEffect, useState } from "react";
import ModalBase from "../../components/ModalBase";
import requestHandler, {
  Dictionary,
} from "../RequestHandler/RequestHandler";
import myStyle from "./Alert.module.scss";
import { Button, TextareaAutosize, TextField } from "@mui/material";
import deleteImg from "./delete.png";
import saveImg from "./save.png";
import checkImg from "./check.png";
import warningImg from "./warning.png";
import { useRef } from "react";


let messageBoxRef: Dictionary = {  callback: null, alertLabel: null, alertMsg: null, image: null, confirm: null, cancel: null, detail:null, errorDetail: null };

export type AlertState = "Success" | "Fail" | "Save" | "Delete" | "Close";

export const AlertBox = (alertState: AlertState, errorMsg?: string) => {
  getRef("errorMsg").style["display"] = "none";

  switch(alertState){
    case "Success":
      getRef("alertMsg").innerHTML="처리되었습니다.";
      getRef("image").src=checkImg;
      getRef("confirm").style["display"]="none";
      getRef("alertconfirm").style["display"]="block";
      getRef("cancel").style["display"]="none";
      getRef("detail").style["display"]="none";
      getRef("container").style["display"] = "block";
      getRef("container").className=myStyle.bluemodal;
      break;
    case "Fail":
      getRef("alertMsg").innerHTML="에러가 발생하였습니다. 관리자에게 문의해주세요.";
      getRef("image").src=warningImg;
      getRef("confirm").style["display"]="none";
      getRef("alertconfirm").style["display"]="block";
      getRef("cancel").style["display"]="none";
      getRef("detail").style["display"]="block";
      getRef("container").style["display"] = "block";
      getRef("errorMsg").innerHTML=errorMsg;   
      getRef("container").className=myStyle.redmodal;
      break;
    default:
      break;
  }
}
export const ConfirmBox = (alertState: AlertState , callback?: (yn: boolean) => void, errorMsg?: string) => {
  getRef("errorMsg").style["display"] = "none";

  switch(alertState){
    case "Delete":
      getRef("alertMsg").innerHTML="삭제하시겠습니까?";
      getRef("image").src=deleteImg;
      getRef("confirm").style["display"]="block";
      getRef("alertconfirm").style["display"]="none";
      getRef("cancel").style["display"]="block";
      getRef("detail").style["display"]="none";
      getRef("container").style["display"] = "block";
      getRef("errorMsg").innerHTML=errorMsg;
      getRef("container").className=myStyle.greenmodal;
      break;
    case "Save":
      getRef("alertMsg").innerHTML="저장하시겠습니까?";
      getRef("image").src=saveImg;
      getRef("confirm").style["display"]="block";
      getRef("alertconfirm").style["display"]="none";
      getRef("cancel").style["display"]="block";
      getRef("detail").style["display"]="none";
      getRef("container").style["display"] = "block";
      getRef("container").className=myStyle.bluemodal;
      break;
    default:
      break;
  }
  messageBoxRef.callback = callback;
}

export const CustomMsgBox = (message: string  , callback?: (yn: boolean) => void) => {
  getRef("errorMsg").style["display"] = "none";

  getRef("alertMsg").innerHTML=message;
  getRef("image").src=checkImg;
  getRef("confirm").style["display"]="block";
  getRef("alertconfirm").style["display"]="none";
  getRef("cancel").style["display"]="block";
  getRef("detail").style["display"]="none";
  getRef("container").style["display"] = "block";
  getRef("container").className=myStyle.bluemodal;

  messageBoxRef.callback = callback;
}
export const CustomBox = (message: string ) => {
  getRef("errorMsg").style["display"] = "none";

  getRef("alertMsg").innerHTML=message;
  getRef("image").src=checkImg;
  getRef("confirm").style["display"]="none";
  getRef("alertconfirm").style["display"]="block";
  getRef("cancel").style["display"]="none";
  getRef("detail").style["display"]="none";
  getRef("container").style["display"] = "block";
  getRef("container").className=myStyle.bluemodal;

}

const getRef = (name: string) => {
  return messageBoxRef[name].current;
}

const close = () => {
  getRef("container").style["display"] = "none";
}

const detail = () => {
  getRef("errorMsg").style["display"] = getRef("errorMsg").style["display"] =="none"?"block":"none"
}

const Alert = (props: {
}) => {
  messageBoxRef = { 
    alertLabel: useRef(null), 
    alertMsg: useRef(null), 
    image: useRef(null),
    confirm: useRef(null),
    alertconfirm: useRef(null),
    cancel: useRef(null),
    detail: useRef(null),
    errorMsg: useRef(null),
    container: useRef(null)
  };

  return (
    <div ref={messageBoxRef.container} style={{ display: "none", zIndex: 110 }}>
    <ModalBase
      title={"메시지알림"}
      onCloseClick={() => {
        close();
      }}
    >
        <div className={myStyle.contents} style={{ 
        width: "400px",
        height: "150px"
        }}>
          <div className={myStyle.icon}>
            <img ref={messageBoxRef.image} />
          </div>
          <div ref={messageBoxRef.alertMsg} style={{
            fontSize: "18pt",
            fontWeight: "bold",
            lineHeight:"normal"
            }}>
          </div>
      </div>
        <div className={myStyle.selectcheckbtn}>
          <div ref={messageBoxRef.confirm}>
            <button style={{ width: "100px", height: "40px", fontSize:"18pt", fontWeight:"bold"}}
               onClick={() => {
                 close();
                 messageBoxRef.callback(true);
              }}
             >
              확인
            </button>
          </div>
          <div ref={messageBoxRef.cancel}>
            <button style={{ width: "100px", height: "40px", fontSize:"18pt", fontWeight:"bold"}}
              onClick={() => {
               close();
               messageBoxRef.callback(false);
              }}
             >
              취소
             </button>
          </div>
          <div ref={messageBoxRef.alertconfirm}>
            <button style={{ width: "100px", height: "40px", fontSize:"18pt", fontWeight:"bold"}}
               onClick={() => {
                 close();
              }}
             >
              확인
            </button>
          </div>
        </div>
        <div ref={messageBoxRef.detail} style={{ padding:"0", minHeight:"15px" }}>
            <button style={{  fontSize:"12pt", border:"none",textDecoration:"underline"}}
              onClick={() => {
                detail();
              }}
              >
                {/* &#171; */}
              &#60;&#60;자세히
            </button>
          </div>
        <div  ref={messageBoxRef.errorMsg} 
        style={{ maxWidth: "590px", fontSize:"10pt", wordBreak: "break-word", border: "1px solid", margin:"5px 5px 5px 5px", textAlign:"left", padding:"10px 10px", backgroundColor:"#eee", 
        overflowY: "auto", maxHeight: "350px",color:"#000"}}
        />
    </ModalBase>
  </div>
  );
};

export default Alert;
