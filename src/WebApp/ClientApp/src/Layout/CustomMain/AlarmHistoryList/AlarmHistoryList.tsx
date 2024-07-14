import { TextField, ThemeProvider } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomArticle from "../../../components/CustomArticle";
import CustomButton from "../../../components/CustomButton/CustomButton";
import myStyle from "./AlarmHistoryList.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  cur_befTime,
  monthFristDay,
  TimeFormat,
} from "../../../utils/getTimes";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import CustomAgGrid from "../../../components/CustomAgGrid";
import Select from "react-select";
import { SelectStyle, SelectTheme, theme } from "../../../Styles/CustomStyles";
import CustomTimePicker from "../../../components/CustomTimePicker";

type FormValues = {
  InputSelect: {
    label: string;
    value: string;
  };
  InputText: string;
  CalFrom: string;
  CalTo: string;
  SearchText: string;
};

const AlarmHistoryList = () => {
  const { control, handleSubmit, setValue } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (e) => {
    // api 호출
  };

  const navigate = useNavigate();

  const options = [
    { value: "total", label: "전체" },
    { value: "HS", label: "합성" },
    { value: "HGJ", label: "후공정" },
    { value: "HG", label: "환경" },
  ];
  return (
    <div className={myStyle.container}>
      <form className={myStyle.search} onSubmit={handleSubmit(onSubmit)}>
        <CustomArticle title="설비타입" titlePosition="top">
          <Controller
            control={control}
            name="InputSelect"
            defaultValue={options[0]}
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
        <CustomArticle title="상세설비" titlePosition="top">
          <Controller
            control={control}
            name="InputText"
            defaultValue=""
            render={({ field }) => (
              <ThemeProvider theme={theme}>
                <TextField size="small" {...field} />
              </ThemeProvider>
            )}
          />
        </CustomArticle>
        <CustomArticle title="일시" titlePosition="top">
          <>
            {/* <Controller
              control={control}
              name="CalFrom"
              defaultValue={cur_befTime(3, "day")}
              render={({ field: { value } }) => (
                <CustomTimePicker
                  value={value}
                  onChange={(e) => e && setValue("CalFrom", TimeFormat(e))}
                />
              )}
            />
            ~
            <Controller
              control={control}
              name="CalTo"
              defaultValue={TimeFormat(new Date())}
              render={({ field: { value } }) => (
                <CustomTimePicker
                  value={value}
                  onChange={(e) => e && setValue("CalTo", TimeFormat(e))}
                />
              )}
            /> */}
          </>
        </CustomArticle>
        <CustomArticle title="내용" titlePosition="top">
          <Controller
            control={control}
            name="SearchText"
            defaultValue=""
            render={({ field }) => (
              <ThemeProvider theme={theme}>
                <TextField {...field} size="small" sx={{ width: "100%" }} />
              </ThemeProvider>
            )}
          />
        </CustomArticle>
        <CustomArticle title="" titlePosition="top">
          <>
            <div style={{ margin: "0px 10px" }}>
              <CustomButton
                type="submit"
                text="조회"
                onClick={() => handleSubmit(onSubmit)}
                color={"primary"}
              />
            </div>
            <div style={{ margin: "0px 10px" }}>
              <CustomButton
                text="홈으로"
                onClick={() => navigate("/")}
                color={"primary"}
              />
            </div>
          </>
        </CustomArticle>
      </form>
      <div className={myStyle.content}>
        <div className={myStyle.grid}>
          <CustomAgGrid
            rowSelection="single"
            rowData={[
              {
                date1: "2022-06-15",
                date2: "HS",
                date3: "합성#001",
                date4: "합성#001 이상내용",
                date5: "2022-06-15",
                date6: "2022-06-15",
              },
              {
                date1: "date1",
                date2: "date2",
                date3: "date3",
                date4: "date4",
                date5: "date5",
                date6: "date6",
              },
            ]}
            columnDefs={[
              { field: "date1", headerName: "발생일자", flex: 1 },
              { field: "date2", headerName: "설비타입", flex: 0.5 },
              { field: "date3", headerName: "상세설비", flex: 0.7 },
              { field: "date4", headerName: "이상내용", flex: 1.5 },
              { field: "date5", headerName: "해제시간", flex: 1 },
              { field: "date6", headerName: "고장시간", flex: 1 },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AlarmHistoryList;
