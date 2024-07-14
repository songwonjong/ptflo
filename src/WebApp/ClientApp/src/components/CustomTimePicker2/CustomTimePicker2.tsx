import { ko } from "date-fns/locale";
import DatePicker from 'react-datepicker';
import myStyle from "./CustomTimePicker.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import { DateTimePicker } from "@mui/x-date-pickers";


interface Props {
  children?:any;
  selectDate: Date;
  setDate: (e: Date) => void;
  radioReset?:any;
  title?:string;
}

const CustomTimePicker2 = ({   selectDate, setDate, radioReset, title}: Props) => {
  const { dataPicker, datePickerInput } = myStyle;

  return (
    <div className={dataPicker}>
      {title?title:""}
      <DatePicker
        locale={ko}
        selected={selectDate}
        dateFormat="yyyy.MM.dd (eee)"
        onChange={(date: any) => {
          setDate(date);
          radioReset();
        }}
        customInput={
          <input
            className={datePickerInput}
            onKeyPress={(e) => e.preventDefault()}
          />
        }
      />
    </div>
  );
};

export default CustomTimePicker2;
