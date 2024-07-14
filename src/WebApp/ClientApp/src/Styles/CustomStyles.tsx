import { createTheme } from "@mui/material";
import { StylesConfig, ThemeConfig, Theme } from "react-select";

export const mainColor = "#4e616d";
export const bgColor = "#f1f8fd";
export const borderColor = mainColor;

export const chartMainColor = "#f5f5f5";
export const upRefColor = "#FF4273";

export const upRefColorWarn = "#FF82B3";
export const lwRefColor = "#185ADB";
export const lwRefColorWarn = "#3C7EFF";

export const theme = createTheme({
  palette: {
    primary: {
      main: mainColor,
    },
    success: {
      main: "#65C18C",
    },
    error: {
      contrastText: "black",
      main: "#ea5e5e",
    },
    warning: {
      main: "#FFEE63",
    },
    info: {
      main: "#2e2e2e",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: bgColor,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 20,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&:hover": {
            color: "white",
            backgroundColor: "#4e616d80",
          },
        },
      },
    },
  },
});

export const SelectTheme: ThemeConfig = (theme: Theme) => {
  return {
    ...theme,
    borderRadius: 3,
    colors: {
      ...theme.colors,
      primary: mainColor,
      primary25: "#4e616d80",
      primary50: "#d4ebd0", //isDisabled && active
      neutral0: bgColor,
    },
  };
};
export const SelectStyle: StylesConfig<{ value: string; label: string }> = {
  control: (styles, props) => ({
    ...styles,
    width: "223px",
    height: "40px",
  }),

  //   control: (styles, props) => ({
  //     ...styles,
  //     width: "223px",
  //     height: "40px",
  //     borderColor: props.isFocused ? "red" : "blue",
  //     "&:hover": {
  //       borderColor: borderColor,
  //     },
  //   }),
  //   menu: (styles, props) => ({
  //     ...styles,
  //     width: "223px",
  //   }),
  //   menuList: (styles, props) => ({
  //     ...styles,
  //   }),
  //   option: (styles, props) => ({
  //     ...styles,
  //     backgroundColor: props.isDisabled
  //       ? undefined
  //       : props.isSelected
  //       ? mainColor
  //       : props.isFocused
  //       ? "#4e616d80"
  //       : undefined,
  //     color: props.isDisabled
  //       ? undefined
  //       : props.isSelected
  //       ? "white"
  //       : props.isFocused
  //       ? "white"
  //       : undefined,
  //   }),
};
