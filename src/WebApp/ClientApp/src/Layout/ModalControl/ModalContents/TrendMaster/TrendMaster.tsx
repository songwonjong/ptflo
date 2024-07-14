import CustomAgGrid from "../../../../components/CustomAgGrid";
import CustomLineChart from "../../../../components/CustomLineChart";
import myStyle from "./TrendMaster.module.scss";
import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { monthFristDay, TimeFormat } from "../../../../utils/getTimes";
import CustomArticle from "../../../../components/CustomArticle";
import { SelectStyle, SelectTheme } from "../../../../Styles/CustomStyles";
import CustomTimePicker from "../../../../components/CustomTimePicker";
import CustomButton from "../../../../components/CustomButton";
import {
  EquipManage,
  EquipStateManageType,
} from "../../../../stores/EquipStateManage";
import { observer } from "mobx-react";
import { toJS } from "mobx";

type Data = {
  date: string;
  upperValue: number;
  nowValue: number;
  lowerValue: number;
};

export type InputValue = {
  inputSelect: {
    label: string;
    value: string;
  };
  CalFrom: string;
  CalTo: string;
};

const TrendMaster = 
(() => {
  const { detailData, setDetailData } = EquipManage;
  setDetailData("HS#1");
  const { control, handleSubmit, setValue } = useForm<InputValue>({
    defaultValues: {
      CalFrom: monthFristDay(),
      CalTo: TimeFormat(new Date()),
      inputSelect: {
        value: "total",
        label: "전체",
      },
    },
  });

  const options = [
    { value: "total", label: "전체" },
    { value: "HS001", label: "합성#1" },
    { value: "HS002", label: "합성#2" },
    { value: "HS003", label: "합성#3" },
  ];

  const onSubmit: SubmitHandler<InputValue> = (e) => {
  };
  return (
    <div className={myStyle.container}>
      <div className={myStyle.search}>
        <div className={myStyle.inputBox}>
          <form onSubmit={handleSubmit(onSubmit)} className={myStyle.cusForm}>
            <div style={{ margin: "0px 20px" }}>
              <CustomArticle title="설비" titlePosition="top">
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
              <CustomArticle title="일시" titlePosition="top">
                <>
                  {/* <Controller
                    control={control}
                    name="CalFrom"
                    render={({ field: { value } }) => (
                      <CustomTimePicker
                        value={value}
                        onChange={(e) =>
                          e && setValue("CalFrom", TimeFormat(e))
                        }
                      />
                    )}
                  />
                  ~
                  <Controller
                    control={control}
                    name="CalTo"
                    render={({ field: { value } }) => (
                      <CustomTimePicker
                        value={value}
                        onChange={(e) => e && setValue("CalTo", TimeFormat(e))}
                      />
                    )}
                  /> */}
                </>
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
        </div>
        <div className={myStyle.buttonBox}>
          <div
            className={myStyle.btn}
            style={{
              width: "180px",
            }}
          >
            <CustomButton
              text="보고서다운로드"
              onClick={() => console.log("보고서다운로드")}
              color={"primary"}
            />
          </div>
        </div>
      </div>
      <div className={myStyle.main}>
        {
          toJS(detailData)?.length > 0 && toJS(detailData)?.map(
            (i: EquipStateManageType, idx: number) =>
              i.checked && (
                <div key={idx} className={myStyle.session}>
                  {/* <div>데이터{idx}의 트렌드</div> */}
                  <div className={myStyle.charts}>
                    <CustomLineChart
                      data={i.datas}
                      xName="time"
                      valueKey="nowData"
                      upperValue={i.datas[0].uData}
                      lowerValue={i.datas[0].dData}
                    />
                  </div>
                  <div className={myStyle.grid}>
                    <CustomAgGrid
                      rowData={i.datas}
                      columnDefs={[
                        {
                          field: "time",
                          headerName: "시간",
                          flex: 1,
                        },
                        {
                          field: "uData",
                          headerName: "상한값",
                          flex: 1,
                        },
                        {
                          field: "nowData",
                          headerName: "현재값",
                          flex: 1,
                        },
                        {
                          field: "dData",
                          headerName: "하한값",
                          flex: 1,
                        },
                      ]}
                    />
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  );
});
export default TrendMaster;
