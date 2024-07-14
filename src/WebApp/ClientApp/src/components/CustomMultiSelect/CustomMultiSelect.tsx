import myStyle from "./CustomMultiSelect.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useRef, useState } from "react";
import { Dictionary } from "../RequestHandler/RequestHandler";
import { EquipManage } from "../../stores/EquipStateManage";
import { checkIfStateModificationsAreAllowed } from "mobx/dist/internal";

interface Props {
  children?: any;
  selectList: any[];
  text?: string;
  onchange: (checkedData: Dictionary) => void;
  selected?:any;
  clear?: boolean;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomMultiSelect = ({ selectList, text, onchange, clear, selected }: Props) => {
  const [checkedData, setCheckedData] = useState<Dictionary>([]);
  const { selectedData } = EquipManage;
  const handleChange = (event: SelectChangeEvent<typeof checkedData>) => {
    
    const {
      target: { value },
    } = event;
    setCheckedData(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    
    if(selected && selected.length>0){
      selected.map((el : any) => {
        const selectElement = document.querySelector(`.MuiMenuItem-root[data-value="${el.data_name}"]`);
      })
    }

  }, [selected])

  useEffect(() => {
    var checkDataSet: string[] = [];
    selectedData.map((x) => {
      if (selectList.length > 0) {
        var temp = selectList.find((y) => x == y);
        if (temp) checkDataSet.push(temp);
      }
    });
    setCheckedData(checkDataSet);
  }, [selectedData]);

  useEffect(() => {
    onchange(checkedData);
  }, [checkedData]);
  useEffect(() => {
    setCheckedData([]);
  }, [clear]);

  const refdata = useRef(null);
  useEffect(() => {
  }, [])
  return (
    <div className={myStyle.customName}>
      {text ? text : "데이터"}
      <FormControl sx={{ m: 1, width: 250 }}>
        {/* <InputLabel id="demo-multiple-checkbox-label"></InputLabel> */}
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={checkedData}
          onChange={handleChange}
          ref={refdata}
          input={<OutlinedInput />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {selectList.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={checkedData.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomMultiSelect;
