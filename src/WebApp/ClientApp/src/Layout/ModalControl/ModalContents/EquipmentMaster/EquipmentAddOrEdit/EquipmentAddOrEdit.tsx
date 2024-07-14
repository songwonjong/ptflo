import React from "react";
import CustomArticle from "../../../../../components/CustomArticle";
import CustomTextField from "../../../../../components/CustomTextField";
import { EquipmentMasterData } from "../EquipmentMaster";
import myStyle from "./EquipmentAddOrEdit.module.scss";

interface Props {
  selectedData: EquipmentMasterData;
  setSelectedData: (e: any) => void;
}

const EquipmentAddOrEdit = ({ selectedData, setSelectedData }: Props) => {
  const onSetData = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedData({
      ...selectedData,
      [key]: e.currentTarget.value,
    });
  };
  return (
    <div className={myStyle.container}>
      <div className={myStyle.textinput}>
        <CustomArticle title="설비타입" titlePosition="topLeft">
          <CustomTextField
            required="notNull"
            value={selectedData.equipType}
            onChange={(e) => onSetData("equipType", e)}
          />
        </CustomArticle>
      </div>
      <div className={myStyle.textinput}>
        <CustomArticle title="설비코드" titlePosition="topLeft">
          <CustomTextField
            setIcon
            required="notNull"
            value={selectedData.equipCode}
            onChange={(e) => onSetData("equipCode", e)}
          />
        </CustomArticle>
      </div>
      <div className={myStyle.textinput}>
        <CustomArticle title="설비이름" titlePosition="topLeft">
          <CustomTextField
            required="onlyNumber"
            value={selectedData.equipName}
            onChange={(e) => onSetData("equipName", e)}
          />
        </CustomArticle>
      </div>
      <div className={myStyle.textinput}>
        <CustomArticle title="설비위치" titlePosition="topLeft">
          <CustomTextField
            value={selectedData.equipLocation}
            onChange={(e) => onSetData("equipLocation", e)}
          />
        </CustomArticle>
      </div>
    </div>
  );
};
export default EquipmentAddOrEdit;
