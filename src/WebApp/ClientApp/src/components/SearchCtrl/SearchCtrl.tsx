import React, { useEffect, useRef, useState } from "react";
import requestHandler, { Dictionary } from "../RequestHandler/RequestHandler";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CustomTimePicker from "../../components/CustomTimePicker";
import { equipOptions, equipSelectOptions, dataOptions, timeDropdown, minuteDropdown } from "./constants";
import Dropdown from "react-dropdown";
import Select from "react-select";
import DropDown from "../DropDown";
import searchImg from "../../Image/2/search.png"
import ReactDropdown from "react-dropdown";
// import { options } from "../../Pages/AlarmMaster/constants";
import { ExcelExport } from "../ExcelExport/ExcelExport";
import { EquipManage } from "../../stores/EquipStateManage";
import CustomTimePicker2 from "../CustomTimePicker2/CustomTimePicker2";
import myStyle from "./SearchCtrl.module.scss";
import moment from "moment";
import CustomMultiSelect2 from "../../components/CustomMultiSelect2";
import { toJS } from "mobx";

type InputBoxType = {
  dropDownMultiBox: string;
};

interface Props {
  children?: any;
  customSelect?: boolean;
  processSelect?: boolean;
  customSelectEquip?: boolean;
  customMultiSelect?: boolean;
  customMultiSelectJangbi?: boolean;
  equipSelect?:boolean;
  customMultiSelectName?: string;
  customMultiSelectOption?: string;
  customTextField?: boolean;
  customTextFieldName?: string;
  customTimePicker?: boolean;
  customTimePicker2?:boolean;
  customRadioBtn?: boolean;
  noRadioBtn? : boolean;
  onSearch: (params: Dictionary) => void;
  setMenus?:(params:any) => void;
  excelSearchData?:any;
}
export type searchCtrlItem =
  | "searchBtn"
  | "CustomTimePicker"
  | "CustomTextField"
  | "CustomMultiSelect";

const SearchCtrl = ({
  processSelect,
  customSelect,
  customMultiSelect,
  customSelectEquip,
  equipSelect,
  customMultiSelectName,
  customMultiSelectJangbi,
  customMultiSelectOption,
  customTextField,
  customTextFieldName,
  customTimePicker,
  customRadioBtn,
  excelSearchData,
  customTimePicker2,
  noRadioBtn,
  setMenus,
  onSearch,
}: Props) => {

  const {selectedData,setTrendListData ,setTrendListDataAction, getTrendListData ,getTrendListDataAction, setCheckState, setSelectedData, getClickedEquipCode ,getClickedProcess, getclickedEquipCodeA, setClickedProcess} = EquipManage;

  const [inputWeek, setInputWeek] = useState(false);
  const radioBtnHandlerWeek = () => {
    setInputWeek(!inputWeek);
    var startDate = new Date();
    var endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    setStartDate(startDate);
    setEndDate(endDate);
    setInputMon(false);
  };
  const [inputMon, setInputMon] = useState(false);
  const radioBtnHandlerMon = () => {
    setInputMon(!inputMon);
    setInputWeek(false);
    var startDate = new Date();
    var endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const radioReset = () => {
    setInputMon(false);
    setInputWeek(false);
  }
  
  const [customRadioBtnCtrl, setCustomRadioBtnCtrl] = useState<any>('1');

  const beforeDays = new Date();
  beforeDays.setDate(beforeDays.getDate() - 3);
  const [startDate, setStartDate] = useState(beforeDays);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    // if(inputWeek === true && inputMon === false){
    //   radioReset();
    // }else if(inputWeek === false && inputMon === true){
    //   radioReset();
    // }
    
  }, [startDate,endDate]);

  const [dropDownMultiBox, setDropDownMultiBox] = useState<InputBoxType>({
    dropDownMultiBox: "",
  });

  const inputDropDownMultiValue = (e: any) => {
    
    setDropDownMultiBox({
      ...dropDownMultiBox,
      ["dropDownMultiBox"]: "'" + e.join("','") + "'",
    });
  };

  const [textBox, setTextBox] = useState<Dictionary>();
  const inputTextBoxValue = (e: any) => {
    const { name, value } = e.target;
    setTextBox({
      ...textBox,
      [name]: value,
    });
  };

  const [dropDownBox, setDropDownBox] = useState<Dictionary>({
    ["dropDownBox"]: equipOptions[0],
  });

  const inputDropDownValue = (e: any) => {
    setDropDownBox({
      ...dropDownBox,
      ["dropDownBox"]: e.value,
    });
  };

  const [dropDownBoxEquip, setDropDownBoxEquip] = useState<Dictionary>({
    ["dropDownBox"]: equipOptions[0],
  });

  const inputDropDownValueEquip = (e: any) => {
    setDropDownBoxEquip({
      ...dropDownBoxEquip,
      ["dropDownBoxEquip"]: e.value,
    });
  };

  const [timeFrom, setTimeFrom] = useState<Dictionary>({
    ["timeFrom"]: timeDropdown[+moment(new Date()).format("HH").toString()],
  });

  const inputTimeFromValueEquip = (e: any) => {
    setTimeFrom({
      ...timeFrom,
      ["timeFrom"]: e.value,
    });
  };

  const [minuteFrom, setMinuteFrom] = useState<Dictionary>({
    ["minuteFrom"]: minuteDropdown[0],
  });

  const inputMinuteFromValueEquip = (e: any) => {
    setMinuteFrom({
      ...minuteFrom,
      ["minuteFrom"]: e.value,
    });
  };
  
  const [timeTo, setTimeTo] = useState<Dictionary>({
    ["timeTo"]: timeDropdown[+moment(new Date()).format("HH").toString()],
  });

  
  
  const inputTimeToValueEquip = (e: any) => {
    setTimeTo({
      ...timeTo,
      ["timeTo"]: e.value,
    });
  };

  const [minuteTo, setminuteTo] = useState<Dictionary>({
    ["minuteTo"]: minuteDropdown[0],
  });

  const inputMinuteToValueEquip = (e: any) => {
    setminuteTo({
      ...minuteTo,
      ["minuteTo"]: e.value,
    });
  };



  const searchParam = useRef<Dictionary>();
  const search = () => {
    searchParam.current = {
      ...textBox,
      ...dropDownMultiBox,
      ...dropDownBox,
      endDate: endDate,
      startDate: startDate,
      ...dropDownBoxEquip,
      ...timeFrom,
      ...timeTo,
      ...minuteFrom,
      ...minuteTo,
    };
    onSearch(searchParam.current);
  };

  function optionSelect(options?: string): string[] {
    options = options ? options : "options";
    switch (options) {
      case "equip":
        return equipOptions;
      case "data":
        return dataOptions;
      default:
        return [];
    }
  }
  
  const [eqpSelCombo, setEqpSelCombo] = useState([
    { value: "합성 공정", label: "합성 공정" },
    { value: "조분쇄 공정", label: "조분쇄 공정" },
    { value: "미분쇄 공정", label: "미분쇄 공정" },
    { value: "코팅 공정", label: "코팅 공정" },
    { value: "유틸리티", label: "유틸리티" },
  ]);

  
  //전체 목록

  //공정
  const [processList, setProcessList] = useState<any[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<any>({});



  //설비
  const [searchData, setSearchData] = useState<any[]>([]);
  const [equipDropdown, setEquipDropdown] = useState<string[]>([]);

  
  const [selectedEquip, setSelectedEquip] = useState<any>("");
  //트렌드조회용
  const [trendEquipDropdown, setTrendEquipDropdown] = useState<string[]>([]);

  const [trendForSearch, setTrendForSearch] = useState<any>({});
  const [trendSearchData, setTrendSearchData] = useState<any>("");

  //데이터 트렌드 - 설비
  const [selectedEquipTrend, setSelectedEquipTrend] = useState<any>();

  useEffect(() => {
    // setSelectedEquipTrend(trendEquipDropdown[0]);
    if(trendEquipDropdown.length>0){
      setTimeout(() => {
        setSelectedEquipTrend(trendEquipDropdown[0]);
        inputDropDownValueEquip(trendEquipDropdown[0]);
      }, 200)
    }
    
  }, [trendEquipDropdown])


  const [clearEquipList, setClearEquipList] = useState<boolean>(false);

  const [jangbiList, setJangbiList] = useState<any>();
  const [jangbiDropDown, setJangbiDropdown] = useState<any[]>([]);
  const [jangbiDropDownSelected, setJangbiDropdownSelected] = useState<any[]>([]);
  
  

  const setMenu = () => {
    requestHandler<any>("get", "/Optimizer/MenuSetting", "").then((result) => {
      
      const newProcessList: any[] = [];
      result.data.table.map((el: any) => {
        const processValue: any = {};
        processValue.label = el.description;
        processValue.value = el.equip_type;
        newProcessList.push(processValue);
      });
      setProcessList([...newProcessList]);
      setSearchData(result.data.table1);
      setJangbiList(result.data.table2);

    });
  };
  useEffect(() => {
    if(processList.length>0) {
      inputDropDownValue({label: "합성 공정", value:"reactor"})
      setSelectedProcess({label: "합성 공정", value:"reactor"})

      if(toJS(getTrendListDataAction)){

        inputDropDownValue({label: toJS(getClickedProcess).data, value:toJS(getClickedProcess).data})
        setSelectedProcess({label: toJS(getClickedProcess).data, value:toJS(getClickedProcess).data})


      }
      // setTrendListDataAction(false)
    };
  }, [processList]);

  useEffect(() => {
    
    setClearEquipList(!clearEquipList);
    if(jangbiList && jangbiList.length>0){
      const filtered = jangbiList.filter((el : any) => {
        return el.equip_code === selectedEquipTrend.value;
      })
      const dropdownSelected = filtered.filter((el : any) => {
        return el.checkBox===1;
      });
      
      setJangbiDropdownSelected(dropdownSelected);

      
      const data : any[] = [];
      const data1 : any = {};
      const jangbiData = filtered.map((el : any) => {
        data.push({"name":el.data_name,"code":el.data_code});
        // data.push(el.data_name);
        data1[el.data_name] = el.data_code;
      })
      setJangbiDropdown([''])
      setJangbiDropdown([...data])
      // setJangbiDropdownSelected([...data])
    }else{

    }

    
  }, [selectedEquipTrend]);


  useEffect(() => {
    if(customRadioBtn){
      setCustomRadioBtnCtrl(true)
    }

    setMenu();

    
  }, []);

  
  useEffect(() => {
    
    sulbisetting();
  }, [selectedProcess]);
  const sulbisetting = () => {
    setClearEquipList(!clearEquipList);
    const filtered = searchData.filter((el) => {
      if(selectedProcess.value === 'reactor' || selectedProcess.label === '합성 공정'){
        return el.description === "합성 공정"
      }
      else if(selectedProcess.value === 'crusher' || selectedProcess.label === '조분쇄 공정'){
        return el.description === "조분쇄 공정"
      }
      else if(selectedProcess.value === 'jetmill' || selectedProcess.label === '미분쇄 공정'){
        return el.description === "미분쇄 공정"
      }else if(selectedProcess.value === 'coating' || selectedProcess.label === '코팅 공정'){
        return el.description === "코팅 공정"
      }else{
        return el.description === '유틸리티';
      }
    });
    const data: string[] = [];
    
    const equipData : any[] = [];
    

    filtered.map((el) => {
      if(toJS(getTrendListDataAction) && el.equip_code === toJS(getClickedEquipCode)){
        data.unshift(el.equip_name);
  
        const label = el.equip_name;
        const value = el.equip_code;
  
        equipData.unshift({
          label : label,
          value : value,
        })
      }else{
        data.push(el.equip_name);
  
        const label = el.equip_name;
        const value = el.equip_code;
  
        equipData.push({
          label : label,
          value : value,
        })
      }
    });

    
    setTrendEquipDropdown(equipData)
    setEquipDropdown(data);
    setTimeout(() => {
      setTrendListDataAction(false);
    }, 2000)
  }


  // const inputDropDownMultiValue = (e: any) => {
  //   setDropDownMultiBox({
  //     ...dropDownMultiBox,
  //     ["dropDownMultiBox"]: "'" + e.join("','") + "'",
  //   });
  // };
  

  



  const setJangbiDropDownMultiValue = (e : any[]) => {
    
    const searchParamList : any[] = [];
    const dataIter = e.map((el) => {
      
      searchParamList.push(trendForSearch[el]);
      // const filtered = trendForSearch.filter((i) => {
      //   return i.label === el;
      // })
      // searchParamList.push(filtered[0].value)
    })
    inputDropDownMultiValue(searchParamList);

  }

  const updateSelectedData = (e : any) => {

  }


  return (
    <>
      <div className="upperDiv">
        {processSelect ? (
          <>
            공정 &nbsp;
            <ReactDropdown 
            options={processList}
            value={
              selectedProcess? 
              selectedProcess.label
              :
              processList[0]
              ? 
                "합성 공정"
                : 
                equipSelectOptions[0].value
            }
            onChange={(e) => {
              inputDropDownValue(e);
              setSelectedProcess(e);
            }} />
            {/* <Select options={equipSelectOptions} onChange={(e)=>{inputDropDownValue(e)}} defaultValue={equipOptions[0]}/> */}
            {/* <DropDown
              title="공정"
              value={
                processList[0]
                  ? processList[0].value
                  : equipSelectOptions[0].value
              }
              setValue={(e) => {
                inputDropDownValue(e);
                setSelectedProcess(e);
              }}
              options={processList}
            /> */}
            &emsp;
          </>
        ) : (
          <></>
        )}
        {equipSelect ? (
          <>
            설비 &nbsp;
            <ReactDropdown 
            options={trendEquipDropdown}
            value={
              selectedEquipTrend
              ?
              selectedEquipTrend
              :
              trendEquipDropdown[0]}
            onChange={(e) => {
              setSelectedEquipTrend(e);
              inputDropDownValueEquip(e);
              // setSelectedEquip(e)
            }} />
            {/* <Select options={equipSelectOptions} onChange={(e)=>{inputDropDownValue(e)}} defaultValue={equipOptions[0]}/> */}
            {/* <DropDown
              title="공정"
              value={
                processList[0]
                  ? processList[0].value
                  : equipSelectOptions[0].value
              }
              setValue={(e) => {
                inputDropDownValue(e);
                setSelectedProcess(e);
              }}
              options={processList}
            /> */}
            &emsp;
          </>
        ) : (
          <></>
        )}
        {customSelect ? (
          <>
            설비 &nbsp;
            {/* <Select options={equipSelectOptions} onChange={(e)=>{inputDropDownValue(e)}} defaultValue={equipOptions[0]}/> */}
            <DropDown
              title="설비"
              value={
                equipSelectOptions[0].value
              }
              setValue={(e) => {
                inputDropDownValue(e);
              }}
              options={equipSelectOptions}
            />
            &emsp;
          </>
        ) : (
          <></>
        )}

        {customMultiSelect ? (<>
          <CustomMultiSelect
            selectList={equipDropdown}
            text={customMultiSelectName ? customMultiSelectName : "설비"}
            onchange={(e) => {
              inputDropDownMultiValue(e);
            }}
            clear={clearEquipList}
            />
            &emsp;
            </>
        ) : (
          <></>
        )}

        {/* 데이터 트렌드 조회 전용 */}
        {customMultiSelectJangbi ? (<>
          <CustomMultiSelect2
            selectList={jangbiDropDown}
            selected={jangbiDropDownSelected}
            text={"데이터"}
            onchange={(e : any) => {
              // setSelectedData();
              inputDropDownMultiValue(e);
              // updateSelectedData(e)
              // setJangbiDropDownMultiValue(e);
              // inputDropDownMultiValue(e);
            }}
            
            clear={clearEquipList}
            />
            &emsp;
            </>
        ) : (
          <></>
        )}
        
        {customTimePicker ? (
          <CustomTimePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            radioReset={() => radioReset()}
          />
        ) : (
          <></>
        )}

        {/* 데이터 트렌드 조회 전용 */}
        {customTimePicker2 ? (
          <>
            <CustomTimePicker2
              selectDate={startDate}
              setDate={setStartDate}
              radioReset={() => radioReset()}
              />
              <span className={myStyle.timepicker}>
                <ReactDropdown 
                  options={timeDropdown}
                  value={timeDropdown[+moment(new Date()).format("HH").toString()]}
                  onChange={(e) => {
                    inputTimeFromValueEquip(e);
                    // setSelectedEquip(e)
                  }} />
              </span>
              시&nbsp;
              <span className={myStyle.timepicker}>
                <ReactDropdown 
                  options={minuteDropdown}
                  value={minuteDropdown[0]}
                  onChange={(e) => {
                    inputMinuteFromValueEquip(e);
                    // setSelectedEquip(e)
                  }} />
              </span>
              분 &nbsp; ~ &nbsp;
              <CustomTimePicker2
              selectDate={endDate}
              setDate={setEndDate}
              radioReset={() => radioReset()}
              />
              <span className={myStyle.timepicker}>
                <ReactDropdown 
                  options={timeDropdown}
                  value={timeDropdown[+moment(new Date()).format("HH").toString()]}
                  onChange={(e) => {
                    inputTimeToValueEquip(e);
                    // setSelectedEquip(e)
                }} />
              </span>
              시&nbsp;
              <span className={myStyle.timepicker}>
                <ReactDropdown 
                  options={minuteDropdown}
                  value={minuteDropdown[0]}
                  onChange={(e) => {
                    inputMinuteToValueEquip(e);
                    // setSelectedEquip(e)
                }} />
              </span>
              분
          </>
        ) : (
          <></>
        )}
        
        {noRadioBtn === undefined && customRadioBtnCtrl ? (
          <>
            &emsp;&emsp;일주일
            <input
              type="radio"
              id="week"
              style={{ marginLeft: "5px", marginRight: "15px" }}
              checked={inputWeek}
              onClick={radioBtnHandlerWeek}
            />
            한달
            <input
              type="radio"
              id="month"
              style={{ marginLeft: "5px", marginRight: "15px" }}
              checked={inputMon}
              onClick={radioBtnHandlerMon}
            />
          </>
        ) : (
          <></>
        )}
        {customTextField ? (
          <>
            &emsp;
            {customTextFieldName ? customTextFieldName : "텍스트"}
            <input
              className="inputText"
              // value={loginValue.id}
              name="text"
              onChange={(e) => {
                inputTextBoxValue(e);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="upperDiv">
        <button className="btn" onClick={() => search()}>
        <img src={searchImg} style={{height:"60%", marginBottom: "-5px",marginRight:"6px"}}/>
          &emsp;조회
        </button>
        {excelSearchData?(
          <>
            <ExcelExport
              from={excelSearchData.from}
              to={excelSearchData.to}
              eqp={excelSearchData.eqp}
            />
          </>
        ): null}
        {/* {excelSearchData?(
          <>
            <ExcelExport
              from={excelSearchData.from}
              to={excelSearchData.to}
              eqp={excelSearchData.eqp}
            />
          </>
        ): null} */}
      </div>
    </>
  );
};
export default SearchCtrl;
