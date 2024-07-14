import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ErrorControl, ErrorType } from "../../stores/ErrorManagerStore";
import CustomButton from "../CustomButton";
import myStyle from "./ErrorBox.module.scss";

interface Props {
  value: ErrorType;
  where: "errorInMain" | "errorInHeader";
}
const ErrorBox = ({ value, where }: Props) => {
  const { closeFnc, addpopUpError,errorListOpenControl } = ErrorControl;
  const navigate = useNavigate();
  switch (where) {
    case "errorInMain":
      return (
        <div className={myStyle.errorInMain}>
          <div className={myStyle.title}>이상 발생 알림</div>
          <div className={myStyle.content}>
            <div className={myStyle.contentDetail}>1내용</div>
            <div className={myStyle.contentDetail}>2내용</div>
            <div className={myStyle.contentDetail}>{value.message}</div>
          </div>
          <div className={myStyle.buttons}>
            <div style={{ width: 120 }}>
              <CustomButton
                text="바로가기"
                color="warning"
                onClick={() => {
                  closeFnc(value.id);
                  errorListOpenControl(false);
                  navigate(
                    `/equipment/${value.id.split("#")[0]}/${
                      value.id.split("#")[1]
                    }`
                  );
                }}
              />
            </div>
            <div style={{ width: 120 }}>
              <CustomButton
                text="부져정지"
                color="warning"
                onClick={() => console.log("부져정지")}
              />
            </div>
            <div style={{ width: 120 }}>
              <CustomButton
                text="리셋"
                color="warning"
                onClick={() => console.log("리셋")}
              />
            </div>
            <div style={{ width: 120 }}>
              <CustomButton
                text="닫기"
                color="warning"
                onClick={() => closeFnc(value.id)}
              />
            </div>
          </div>
        </div>
      );
    case "errorInHeader":
      return (
        <div
          className={myStyle.errorInHeader}
          onClick={() =>{
              // errorListOpenControl(true)
              addpopUpError(value);
              // navigate(
              //   `/equipment/${value.id.split("#")[0]}/${
              //     value.id.split("#")[1]
              //   }`
              // )
            }
          }
        >
          <div className={myStyle.title}>이상 발생</div>
          <div className={myStyle.content}>
            <div>{value.message}</div>
          </div>
        </div>
      );
  }
  // return (
  //   <div className={myStyle.container}>
  //     {value}
  //     <div>
  //       <Button variant="outlined">닫기</Button>
  //     </div>
  //   </div>
  // );
};

export default ErrorBox;
