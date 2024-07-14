import React, { useState } from "react";
import CustomTextField from "../../../../../components/CustomTextField";
import { SelectStyle, SelectTheme } from "../../../../../Styles/CustomStyles";
import { AlarmMasterData } from "../AlarmMaster";
import myStyle from "./AlarmAddOrEdit.module.scss";
import Selelct, { Options } from "react-select";
import CustomArticle from "../../../../../components/CustomArticle";
import { EquipDatas } from "../../../../../stores/TestData";

interface Props {
  selectedData: AlarmMasterData;
  setSelectedData: (e: any) => void;
}

const AlarmAddOrEdit = ({ selectedData, setSelectedData }: Props) => {
  const onSetData = (key: string, e: any) => {
    setSelectedData({
      ...selectedData,
      [key]: e.currentTarget.value,
    });
  };
  const test = [
    { value: "require", label: "필수 선택" },
    { value: "HS001", label: "합성#1" },
    { value: "HS002", label: "합성#2" },
    { value: "HS003", label: "합성#3" },
  ];

  const EquipmentSet = (e: any) => {
    const vv = EquipDatas.filter((i: any) => i.equipCode === e.value)[0];
    setSelectedData({
      ...selectedData,
      on1: vv?.equipCode,
      on2: vv?.equipName,
      on3: vv?.equipType,
    });
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className={myStyle.container}>
      <div className={myStyle.inner}>
        <div>{`${selectedData.on1},${selectedData.on2},${selectedData.on3}`}</div>
        <div className={myStyle.textinput}>
          <CustomArticle require title="설비명" titlePosition="topLeft">
            <Selelct
              value={test.filter((i: any) => i.value === selectedData.on1)[0]}
              onInputChange={(e) => setLoading(e ? true : false)}
              isLoading={loading}
              onChange={EquipmentSet}
              defaultValue={test[0]}
              options={test}
              theme={SelectTheme}
              styles={SelectStyle}
            />
          </CustomArticle>
        </div>
        <div className={myStyle.textinput}>
          <CustomArticle require title="데이터코드" titlePosition="topLeft">
            <CustomTextField
              setIcon
              required="notNull"
              value={selectedData.on4}
              onChange={(e) => onSetData("on4", e)}
            />
          </CustomArticle>
        </div>
        <div className={myStyle.textinput}>
          <CustomArticle require title="데이터내용" titlePosition="topLeft">
            <CustomTextField
              setIcon
              required="onlyNumber"
              value={selectedData.on5}
              onChange={(e) => onSetData("on5", e)}
            />
          </CustomArticle>
        </div>
        <div className={myStyle.textinput}>
          <CustomArticle title="트렌트여부" titlePosition="topLeft">
            <CustomTextField
              value={selectedData.on6}
              onChange={(e) => onSetData("on6", e)}
            />
          </CustomArticle>
        </div>
      </div>
      <div className={myStyle.inner}></div>
    </div>
  );
};
export default AlarmAddOrEdit;
