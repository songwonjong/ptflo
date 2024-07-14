import { ko } from "date-fns/locale";
import DatePicker from 'react-datepicker';
import myStyle from "./CustomTimePicker.module.scss";
import "react-datepicker/dist/react-datepicker.css";


interface Props {
  children?:any;
  startDate: Date;
  setStartDate: (e: Date) => void;
  endDate: Date;
  setEndDate: (e: Date) => void;
  radioReset?:any;
  disable?:boolean;
}

const CustomTimePicker = ({ disable, startDate, setStartDate, endDate, setEndDate, radioReset}: Props) => {
  const { dataPicker, datePickerInput } = myStyle;

  return (
    <div className={dataPicker}>
      일자 
      <DatePicker
        locale={ko}
        selected={startDate}
        dateFormat="yyyy.MM.dd (eee)"
        disabled={disable?disable:false}
        onChange={(date: any) => {
          setStartDate(date);
          radioReset();
        }}
        customInput={
          <input
            className={datePickerInput}
            onKeyPress={(e) => e.preventDefault()}
          />
        }
      />
      ~
      <DatePicker
        locale={ko}
        selected={endDate}
        dateFormat="yyyy.MM.dd (eee)"
        disabled={disable?disable:false}
        onChange={(date: any) => {
          setEndDate(date);
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

export default CustomTimePicker;
