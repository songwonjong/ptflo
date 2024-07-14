import { useEffect, useState } from "react";
import Select from "react-select";
import myStyle from "./DropDown.module.scss";

const DropDown = (props: {
  title?: string;
  value?: string;
  setValue: (e: any) => void;
  options: any[];
  minWidth?: any;
}) => {
  const [result, setResult] = useState("");
  const [options, setOptions] = useState<any[]>();

  useEffect(() => {}, []);

  // const onChange = (e: SelectChangeEvent) => {
  //   setResult(e.target.value);
  // };

  return (
    <>
      <div className={myStyle.rows}>
        <Select
          options={props.options}
          onChange={(e: any) => {
            props.setValue(e.value);
          }}
          className={myStyle.options}
          placeholder={props.title}
          // defaultValue={props.options[0]}
          // menuIsOpen={true}
        />
      </div>
    </>
  );
};
export default DropDown;
