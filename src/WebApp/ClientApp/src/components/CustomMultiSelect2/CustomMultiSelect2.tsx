import myStyle from "./CustomMultiSelect2.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useRef, useState } from "react";
import requestHandler, { Dictionary } from "../RequestHandler/RequestHandler";
import { EquipManage } from "../../stores/EquipStateManage";
import { toJS } from "mobx";

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

const CustomMultiSelect2 = ({ selectList, text, onchange, clear, selected }: Props) => {
  const {selectedData,setTrendListData ,setTrendListDataAction, getTrendListData ,getTrendListDataAction, setCheckState, setSelectedData, getClickedEquipCode ,getClickedProcess, getclickedEquipCodeA, setClickedProcess} = EquipManage;
  const [checkedData, setCheckedData] = useState<any[]>([]);
  const [checkList, setcheckList] = useState<any[]>([]);
  const handleChange = (event: any) => {

    const {target: { value,key },} = event;
    setCheckedData(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") :value
      // typeof value === "" ? value[0] : value
    );
  };
  
  const searchParam = useRef<any>();

  const EquipDetailTrendVisibleUpdate = (event:any)=>{   
    if(text==="데이터"){
      searchParam.current= {
        // trendVisible : event.data.checkBox?"true":"false",
        trendVisible:checkedData.includes(event.name)?"false":"true",
        dataCode : event.code
      };
      requestHandler<any>("post", "/Monitoring/EquipDetailTrendVisibleUpdate", searchParam.current)
      .then((result) => {
        
      })
      .catch((error) => {
        console.error(error);
      });
      
    }else{
      return;
    }
  }
  useEffect(() => {
    
    if(selected && selected.length>0){
      const dataList : string[] = [] ;
      selected.map((el : any) => {
        dataList.push(el.data_name);
        
        handleChange({target : el.data_name})
        // var options = document.getElementById(`event2_${el.data_name}`);
        
        // select && select.value="optionValue";
        // select && select.dispatchEvent(new Event('change'));
      })
      setcheckList(dataList);
      asdf(selected)
      
    }

    setTimeout(() => {
      asdf(selected)
    }, 500);
  }, [selected])

  const asdf = (selected : any) =>{
    
    const cData : any = [];
    selected.map((el : any) => {
      cData.push(`${el.data_name}`)
      // select && select.value="optionValue";
      // select && select.dispatchEvent(new Event('change'));
    })
    setCheckedData(cData);
    
  }

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
          input={<OutlinedInput />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {selectList.map((info) => (
            <MenuItem key={info.name} value={info.name} onClick={()=>EquipDetailTrendVisibleUpdate(info)} id={`event2_${info.name}`}>
              {/* <Checkbox checked={checkedData.indexOf(name) > -1} id={`event_${name}`}/> */}
              <Checkbox checked={checkedData.includes(info.name)} />
              <ListItemText primary={info.name} id={`event1_${info.name}`}/>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomMultiSelect2;
