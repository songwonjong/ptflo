import Button, { ButtonProps } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { theme } from "../../Styles/CustomStyles";
import insertImg from "../../Image/2/insert.png"
import updateImg from "../../Image/2/update.png"
import deleteImg from "../../Image/2/delete.png"
import searchImg from "../../Image/2/search.png"
import exceldownloadImg from "../../Image/2/exceldownload.png"



export type Color = "primary" | "success" | "error" | "warning" | "info";

export interface ImgCustomButtonProps {
  text?: string;
  img?: string;
  onClick: (e: any) => void;
  color: Color;
  type?: any;
  disabled?: any;
  fontsize?: any;
}

const ImgCustomButton = ({
  type,
  disabled,
  color,
  text,
  img,
  onClick,
  fontsize
}: ImgCustomButtonProps) => {
  var baseButtonImg = "";
  switch(text){
    case "조회":
      baseButtonImg = searchImg;
    break;
    case "추가":
      baseButtonImg = insertImg;
    break;
    case "수정":
      baseButtonImg = updateImg;
    break;
    case "삭제":
      baseButtonImg = deleteImg;
    break;
    case "엑셀다운로드":
      baseButtonImg = exceldownloadImg;
    break;
    default:
      baseButtonImg = searchImg;
    break;
    } 
  return (
    <ThemeProvider theme={theme}>
      <Button
        disabled={disabled}
        type={type}
        color={color}
        variant="contained"
        onClick={onClick}
        sx={{
          flex: 1,
          width: "100%",
          height:"inherit",
          fontSize: fontsize? fontsize:"large",
          backgroundColor:"#0064a3",
        }}
      >
        <img src={img??baseButtonImg} style={{height:"60%"}}></img>
        <div>&nbsp;{text}</div>
      </Button>
    </ThemeProvider>

    // <ThemeBtn variant="contained" onClick={onClick}>
    //   {text}
    // </ThemeBtn>
  );
};

export default ImgCustomButton;
