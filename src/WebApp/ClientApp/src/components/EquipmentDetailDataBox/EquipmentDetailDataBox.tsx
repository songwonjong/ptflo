import Button, { ButtonProps } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Style } from "util";
import { theme } from "../../Styles/CustomStyles";
import myStyle from "./EquipmentDetailDataBox.module.scss";

export type Color = "primary" | "success" | "error" | "warning" | "info";

export interface EquipmentDetailDataBoxProps {
  title: string;
  value:string;
  unit:string;
  onClick?: (e: any) => void;
  children?:any;
  color?: Color;
  type?: any;
  disabled?: any;
  fontsize?: any;
}

const EquipmentDetailDataBox = ({
  type,
  color,
  title,
  value,
  unit,
  onClick,
  fontsize,
}: EquipmentDetailDataBoxProps) => {

  return (
    <div className={myStyle.eqpbutton}>
      <div className={myStyle.boxDataTitle}>
       {title}
      </div>
      <div className={myStyle.boxDataMap}>
        <span className={myStyle.boxData}>
          {value}
        </span>
        <span className={myStyle.boxDataUnit}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export default EquipmentDetailDataBox;
