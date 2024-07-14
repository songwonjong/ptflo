import CurrentTime from "../../components/CurrentTime";
import myStyle from "./CustomFooter.module.scss";
import MenuButton from "./MenuButton";
import FooterLeft from "./FooterLeft";
import {
  Button,
  ButtonProps,
  styled,
  TextField,
  InputBaseProps,
  InputBase,
  TextFieldProps,
  OutlinedTextFieldProps,
} from "@mui/material";
import { ErrorControl } from "../../stores/ErrorManagerStore";
import { observer } from "mobx-react";
import { TimeFormat } from "../../utils/getTimes";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomFooter = observer(() => {
  const { setErrorMake } = ErrorControl;

  const navigate = useNavigate();

  const ColorButton = styled(Button)<ButtonProps>((e) => ({
    backgroundColor: "#95CD41",
    color: "#F6D860",
    borderRadius: "0px 25px 0 25px",
    "&:hover": {
      boxShadow: "6px 7px 10px 4px rgba(149,205,65,0.41)",
      backgroundColor: "white",
      color: "#95CD41",
    },
  }));

  const CustomTF = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid rgba(149,205,65,0.41)",
      },
      "&:hover fieldset": {
        border: "1px solid rgba(149,205,65,0.41)",
        boxShadow: "6px 7px 10px 4px rgba(149,205,65,0.41)",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid white",
        boxShadow: "6px 7px 10px 4px rgba(149,205,65,0.41)",
      },
    },
  });

  return (
    <div className={myStyle.container}>
      <div className={myStyle.left}>
        <div className={myStyle.leftInner}>
          <FooterLeft />
        </div>
      </div>
      <div className={myStyle.right}>
        <div className={myStyle.bookmark}>
          <Button
            variant="outlined"
            onClick={() => setErrorMake(TimeFormat(new Date()))}
            //onClick={() => setErrorMake("합성#1")}
          >
            에러
          </Button>
        </div>
        <div className={myStyle.timeAndmenu}>
          <div className={myStyle.inner}>
            <CurrentTime />
            <MenuButton />
          </div>
        </div>
      </div>
    </div>
  );
});
export default CustomFooter;
