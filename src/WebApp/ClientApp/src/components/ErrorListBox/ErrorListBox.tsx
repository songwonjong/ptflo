import { IconButton, ThemeProvider } from "@mui/material";
import { observer } from "mobx-react";
import { ErrorControl, ErrorType } from "../../stores/ErrorManagerStore";
import { theme } from "../../Styles/CustomStyles";
import myStyle from "./ErrorListBox.module.scss";
import CloseIcon from "@mui/icons-material/Close";

const ErrorListBox = observer(() => {
  const { addpopUpError, existingErrors, errorListOpenControl } = ErrorControl;

  return (
    <div className={myStyle.container}>
      <div className={myStyle.title}>
        에러 발생 알람 리스트
        <div style={{ position: "absolute", top: 30, right: 30 }}>
          <ThemeProvider theme={theme}>
            <IconButton onClick={() => errorListOpenControl(false)}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </ThemeProvider>
        </div>
      </div>
      <div className={myStyle.main}>
        <div className={myStyle.body}>
          {existingErrors.map((i: ErrorType, idx: number) => (
            <div
              key={idx}
              onClick={() => addpopUpError(i)}
              className={myStyle.bodyItem}
            >
              {i.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ErrorListBox;
