import { OutlinedInput, TextField, ThemeProvider } from "@mui/material";
import React from "react";
import { theme } from "../../Styles/CustomStyles";
import myStyle from "./CustomTextField.module.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type Regular = "notNull" | "onlyNumber";

interface Props {
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: Regular;
  setIcon?: any;
}
const CustomTextField = ({ value, onChange, required, setIcon }: Props) => {
  const Required = (): boolean => {
    switch (required) {
      case "notNull":
        return value === "" ? true : false;
      case "onlyNumber":
        const num = /^[0-9]*$/;
        return value !== "" && num.test(value) ? false : true; //빈값이 아니고 숫자이면 에러를 발생 시키지않는다.
      default:
        return false;
    }
  };

  return (
    <div className={myStyle.container}>
      <ThemeProvider theme={theme}>
        {/* <TextField
          variant="outlined"
          size="small"
          error={Required()}
          placeholder={Required() ? "(필수 입력)" : ""}
          value={value}
          onChange={onChange}
        /> */}
        <OutlinedInput
          size="small"
          error={Required()}
          placeholder={Required() ? "(필수 입력)" : ""}
          value={value}
          onChange={onChange}
          endAdornment={
            setIcon ? (
              !Required() ? (
                <CheckCircleOutlineIcon color="success" />
              ) : (
                <ErrorOutlineIcon color="error" />
              )
            ) : null
          }
        />
      </ThemeProvider>
    </div>
  );
};

export default CustomTextField;
