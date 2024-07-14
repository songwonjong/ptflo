import { useEffect, useRef, useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import CustomAgGrid from "../../../../components/CustomAgGrid";
import CustomArticle from "../../../../components/CustomArticle";
import myStyle from "./AlarmMaster.module.scss";
import Select from "react-select";
import {
  SelectStyle,
  SelectTheme,
  theme,
} from "../../../../Styles/CustomStyles";
import { TextField, ThemeProvider } from "@mui/material";
import CustomButton from "../../../../components/CustomButton";
import AlarmNewOrEdit from "./AlarmAddOrEdit";

export type AlarmMasterData = {
  on1: string;
  on2: string;
  on3: string;
  on4: string;
  on5: string;
  on6: string;
  on7: string;
  on8: string;
  on9: string;
  on10: string;
  on11: string;
  on12: string;
  on13: string;
  on14: string;
  on15: string;
  on16: string;
};
type AddOrEditType = "add" | "edit" | "finish" | "cancel";

export type InputValue = {
  inputText: string;
  inputSelect: {
    label: string;
    value: string;
  };
};

const AlarmMaster = () => {
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
    on1: "",
    on2: "",
    on3: "",
    on4: "",
    on5: "Y",
    on6: "",
    on7: "",
    on8: "",
    on9: "",
    on10: "",
    on11: "",
    on12: "",
    on13: "",
    on14: "",
    on15: "",
    on16: "Y",
  };

  const title = useRef<string>("");
  const [addOrEdit, setAddOrEdit] = useState(false);
  const [selectedData, setSelectedData] = useState<AlarmMasterData>(initData);

  const AddOrEdit = (value: AddOrEditType) => {
    switch (value) {
      case "add":
        title.current = "추가";
        setAddOrEdit(true);
        setSelectedData(initData);
        break;
      case "edit":
        title.current = "수정";
        if (selectedData.on1) {
          setAddOrEdit(true);
          setSelectedData(selectedData);
        } else {
          alert("수정할 데이터 선택");
        }
        break;
      case "finish":
        title.current = "";
        if (selectedData.on1 && selectedData.on2) {

          if (selectedData.on1 === "test") {
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
        title.current = "";
        setAddOrEdit(false);
        setSelectedData(initData);
        break;
    }
  };

  return (
    <div className={myStyle.container}>
      <div className={myStyle.total}>
        <div className={myStyle.search}>
          <div className={myStyle.inputBox}>
            {addOrEdit ? (
              <p
                style={{ fontSize: 30, fontWeight: "bold", marginLeft: 530 }}
              >{`알람 ${title.current}`}</p>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={myStyle.cusForm}
              >
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
                  <CustomArticle title="알람코드" titlePosition="top">
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
          <AlarmNewOrEdit
            selectedData={selectedData}
            setSelectedData={setSelectedData}
          />
        ) : (
          <div className={myStyle.grid}>
            <CustomAgGrid
              onCellClicked={(e) => setSelectedData(e.data)}
              rowSelection="single"
              rowData={[
                {
                  on1: "HS001",
                  on2: "합성#1",
                  on3: "합성",
                  on4: "1",
                  on5: "1",
                  on6: "Y",
                  on7: "750",
                  on8: "700",
                  on9: "200",
                  on10: "250",
                  on11: "1",
                  on12: "1",
                  on13: "1",
                  on14: "1",
                },
                {
                  on1: "HS002",
                  on2: "합성#2",
                  on3: "합성",
                  on4: "2",
                  on5: "2",
                  on6: "N",
                  on7: "850",
                  on8: "700",
                  on9: "100",
                  on10: "150",
                  on11: "2",
                  on12: "2",
                  on13: "2",
                  on14: "2",
                },
                {
                  on1: "HS#003",
                  on2: "합성#3",
                  on3: "합성",
                  on4: "3",
                  on5: "3",
                  on6: "N",
                  on7: "850",
                  on8: "700",
                  on9: "100",
                  on10: "150",
                  on11: "3",
                  on12: "3",
                  on13: "3",
                  on14: "3",
                },
              ]}
              columnDefs={[
                { field: "on1", headerName: "설비코드" },
                { field: "on2", headerName: "설비명" },
                { field: "on3", headerName: "설비타입" },
                { field: "on4", headerName: "데이터코드" },
                { field: "on5", headerName: "데이터내용", width: 260 },
                {
                  field: "on6",
                  headerComponentParams: {
                    template: `
                <div class="ag-cell-label-container" role="presentation">
                  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                  <div class="ag-header-cell-label" role="presentation">
                    <div class="ag-header-cell-text" role="columnheader">
                      <div>
                        트렌드
                      </div>
                      <div>
                        표현여부
                      </div>
                    </div>
                  </div>
                </div>
                `,
                  },
                  width: 100,
                },
                {
                  field: "on7",
                  headerComponentParams: {
                    template: `
                  <div class="ag-cell-label-container" role="presentation">
                    <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                    <div class="ag-header-cell-label" role="presentation">
                      <div class="ag-header-cell-text" role="columnheader">
                        <div>
                          상한치
                        </div>
                        <div>
                           (위험)
                        </div>
                      </div>
                    </div>
                  </div>
                  `,
                  },
                  width: 100,
                },
                {
                  field: "on8",
                  headerComponentParams: {
                    template: `
                <div class="ag-cell-label-container" role="presentation">
                  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                  <div class="ag-header-cell-label" role="presentation">
                    <div class="ag-header-cell-text" role="columnheader">
                      <div>
                        상한치
                      </div>
                      <div>
                         (경고)
                      </div>
                    </div>
                  </div>
                </div>
                `,
                  },
                  width: 100,
                },
                {
                  field: "on9",
                  headerComponentParams: {
                    template: `
                <div class="ag-cell-label-container" role="presentation">
                  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                  <div class="ag-header-cell-label" role="presentation">
                    <div class="ag-header-cell-text" role="columnheader">
                      <div>
                        하한치
                      </div>
                      <div>
                         (위험)
                      </div>
                    </div>
                  </div>
                </div>
                `,
                  },
                  width: 100,
                },
                {
                  field: "on10",
                  headerComponentParams: {
                    template: `
                <div class="ag-cell-label-container" role="presentation">
                  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                  <div class="ag-header-cell-label" role="presentation">
                    <div class="ag-header-cell-text" role="columnheader">
                      <div>
                        하한치
                      </div>
                      <div>
                         (경고)
                      </div>
                    </div>
                  </div>
                </div>
                `,
                  },
                  width: 100,
                },
                { field: "on11", headerName: "등록자" },
                { field: "on12", headerName: "등록시간" },
                { field: "on13", headerName: "수정자" },
                { field: "on14", headerName: "수정시간" },

                // { field: "on14", headerName: "알람내용", width: 260 },
                // {
                //   field: "on5",
                //   headerComponentParams: {
                //     template: `
                // <div class="ag-cell-label-container" role="presentation">
                //   <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                //   <div class="ag-header-cell-label" role="presentation">
                //     <div class="ag-header-cell-text" role="columnheader">
                //       <div>
                //         중요도
                //       </div>
                //       <div>
                //          (팝업여부)
                //       </div>
                //     </div>
                //   </div>
                // </div>
                // `,
                //   },
                // },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default AlarmMaster;
