import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomAgGrid from "../../../../components/CustomAgGrid";
import CustomArticle from "../../../../components/CustomArticle";
import myStyle from "./EquipmentMaster.module.scss";
import Select from "react-select";
import {
  SelectStyle,
  SelectTheme,
  theme,
} from "../../../../Styles/CustomStyles";
import { TextField, ThemeProvider } from "@mui/material";
import CustomButton from "../../../../components/CustomButton";
import EquipmentAddOrEdit from "./EquipmentAddOrEdit";
import { EquipDatas } from "../../../../stores/TestData";

export type EquipmentMasterData = {
  equipType: string;
  equipName: string;
  equipCode: string;
  equipLocation: string;
  ipAddress: string;
  content: string;
};
type AddOrEditType = "add" | "edit" | "finish" | "cancel";

export type InputValue = {
  inputText: string;
  inputSelect: {
    label: string;
    value: string;
  };
};

const EquipmentMaster = () => {
  const { control, handleSubmit } = useForm<InputValue>({
    defaultValues: {
      inputText: "",
      inputSelect: {
        value: "total",
        label: "전체",
      },
    },
  });

  const onSubmit: SubmitHandler<InputValue> = (e) => {
  };

  const options = [
    { value: "total", label: "전체" },
    { value: "HS", label: "합성" },
    { value: "HGJ", label: "후공정" },
    { value: "HG", label: "환경" },
  ];

  const initData = {
    equipType: "",
    equipName: "",
    equipCode: "",
    equipLocation: "",
    ipAddress: "",
    content: "",
  };

  const [rowData, setRowData] = useState<EquipmentMasterData[]>([]);
  const [addOrEdit, setAddOrEdit] = useState(false);
  const [selectedData, setSelectedData] =
    useState<EquipmentMasterData>(initData);

  useEffect(() => {
    setRowData(EquipDatas);
  }, []);
  // useEffect(() => {
  //   if (value !== "total" && inputText) {
  //     const notTotalList = toJS(totalRowData).filter(
  //       (item: any) =>
  //         item.equipType === value && item.equipName.includes(inputText)
  //     );
  //     setRowData(notTotalList);
  //   } else if (value === "total" && inputText) {
  //     const textIncludes = toJS(totalRowData).filter((item: any) =>
  //       item.equipName.includes(inputText)
  //     );
  //     setRowData(textIncludes);
  //   } else if (value !== "total" && !inputText) {
  //     const valueIncludes = toJS(totalRowData).filter(
  //       (item: any) => item.equipType === value
  //     );
  //     setRowData(valueIncludes);
  //   } else {
  //     setRowData(totalRowData);
  //   }
  //   return () => {
  //     setSelectedData({
  //       equipType: "",
  //       equipName: "",
  //       equipCode: "",
  //       equipLocation: "",
  //       ipAddress: "",
  //       content: "",
  //     });
  //   };
  // }, [totalRowData, searchValue]);

  const AddOrEdit = (value: AddOrEditType) => {
    switch (value) {
      case "add":
        setAddOrEdit(true);
        setSelectedData(initData);
        break;
      case "edit":
        if (selectedData.equipCode) {
          setAddOrEdit(true);
          setSelectedData(selectedData);
        } else {
          alert("수정할 데이터 선택");
        }
        break;
      case "finish":
        if (selectedData.equipCode && selectedData.equipType) {
          if (selectedData.equipCode === "test") {
            setSelectedData(initData);
            setAddOrEdit(false);
          } else {
            alert("에러");
          }
        } else {
          alert("필수");
        }
        break;
      case "cancel":
        setAddOrEdit(false);
        setSelectedData(initData);
        break;
    }
  };
  return (
    <div className={myStyle.container}>
      <div className={myStyle.search}>
        <div className={myStyle.inputBox}>
          {!addOrEdit && (
            <form onSubmit={handleSubmit(onSubmit)} className={myStyle.cusForm}>
              <div style={{ margin: "0px 20px" }}>
                <CustomArticle title="설비타입" titlePosition="top">
                  <Controller
                    control={control}
                    name="inputSelect"
                    render={({ field }) => (
                      <Select
                        {...field}
                        theme={SelectTheme}
                        styles={SelectStyle}
                        options={options}
                      />
                    )}
                  />
                </CustomArticle>
              </div>
              <div style={{ margin: "0px 20px" }}>
                <CustomArticle title="설비코드" titlePosition="top">
                  <Controller
                    control={control}
                    name="inputText"
                    render={({ field }) => (
                      <ThemeProvider theme={theme}>
                        <TextField size="small" {...field} />
                      </ThemeProvider>
                    )}
                  />
                </CustomArticle>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "120px",
                }}
              >
                <CustomButton
                  type="submit"
                  text="조회"
                  onClick={handleSubmit(onSubmit)}
                  color={"primary"}
                />
              </div>
            </form>
          )}
        </div>
        {addOrEdit ? (
          <div className={myStyle.buttonBox}>
            <div className={myStyle.btn}>
              <CustomButton
                text="완료"
                onClick={() => AddOrEdit("finish")}
                color={"primary"}
              />
            </div>
            <div className={myStyle.btn}>
              <CustomButton
                text="취소"
                onClick={() => AddOrEdit("cancel")}
                color={"primary"}
              />
            </div>
          </div>
        ) : (
          <div className={myStyle.buttonBox}>
            <div className={myStyle.btn}>
              <CustomButton
                text="추가"
                onClick={() => AddOrEdit("add")}
                color={"primary"}
              />
            </div>
            <div className={myStyle.btn}>
              <CustomButton
                text="수정"
                onClick={() => AddOrEdit("edit")}
                color={"primary"}
              />
            </div>
          </div>
        )}
      </div>
      {addOrEdit ? (
        <EquipmentAddOrEdit
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      ) : (
        <div className={myStyle.main}>
          <div className={myStyle.grid}>
            <CustomAgGrid
              rowSelection="single"
              rowData={rowData}
              columnDefs={[
                {
                  field: "equipCode",
                  headerName: "설비코드",
                  flex: 1,
                },
                { field: "equipName", headerName: "설비명", flex: 1 },
              ]}
              onCellClicked={(e) => setSelectedData(e.data)}
            />
          </div>
          <div className={myStyle.content}>
            <div className={myStyle.inner}>
              <div className={myStyle.box}>
                <CustomArticle titlePosition="left" title="설비코드">
                  <div className={myStyle.valueBorder}>
                    {selectedData?.equipCode}
                  </div>
                </CustomArticle>
                <CustomArticle titlePosition="left" title="설비명">
                  <div className={myStyle.valueBorder}>
                    {selectedData?.equipName}
                  </div>
                </CustomArticle>
              </div>
              <div className={myStyle.box}>
                <CustomArticle titlePosition="left" title="설비타입">
                  <div className={myStyle.valueBorder}>
                    {selectedData?.equipType}
                  </div>
                </CustomArticle>
                <CustomArticle titlePosition="left" title="설비위치">
                  <div className={myStyle.valueBorder}>
                    {selectedData?.equipLocation}
                  </div>
                </CustomArticle>
              </div>
              <div className={myStyle.box}>
                <CustomArticle titlePosition="left" title="IP주소">
                  <div className={myStyle.valueBorder}>
                    {selectedData?.ipAddress}
                  </div>
                </CustomArticle>
                <div
                  style={{ display: "flex", padding: "0px 2rem", flex: 1 }}
                ></div>
              </div>
              <div className={myStyle.box}>
                <CustomArticle titlePosition="left" title="비교">
                  <div className={myStyle.area}>{selectedData?.content}</div>
                </CustomArticle>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentMaster;
