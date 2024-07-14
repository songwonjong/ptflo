import Button, { ButtonProps } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { theme } from "../../Styles/CustomStyles";

export type Color = "primary" | "success" | "error" | "warning" | "info";

export interface CustomButtonProps {
  text?: string;
  onClick: (e: any) => void;
  color: Color;
  type?: any;
  disabled?: any;
  fontsize?: any;
}

const CustomButton = ({
  type,
  disabled,
  color,
  text,
  onClick,
  fontsize
}: CustomButtonProps) => {
  const ThemeBtn = styled(Button)<ButtonProps>((props) => ({
    ...props,
    color: "white",
    fontSize: "large",
    flex: 1,
    backgroundColor: "#4e616d",
    "&:hover": {
      backgroundColor: "#069A8E",
    },
  }));

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
          fontSize: fontsize? fontsize:"large",
          // ":hover": {
          //   backgroundColor: "#069A8E",
          // },
        }}
      > 
        <div style={text=="LogIn"||text=="LogOut"? {paddingLeft: "117px"}:{}}>{text}</div>
      </Button>
    </ThemeProvider>

    // <ThemeBtn variant="contained" onClick={onClick}>
    //   {text}
    // </ThemeBtn>
  );
};

export default CustomButton;
