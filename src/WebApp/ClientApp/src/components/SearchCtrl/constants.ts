export const fakeData = [
  {
    sequiperrortime: "2022-08-31",
    sequipkey: "Toyota",
    sequipdetail: "Celica",
    sequiperror: "이상내용",
    sequiperrortimeend: "2022-11-02",
    sequiprecoverytime: "02-01 12:10:22",
  },
  {
    sequiperrortime: "2022-09-03",
    sequipkey: "Ford",
    sequipdetail: "Mondeo",
    sequiperror: "이상내용",
    sequiperrortimeend: "2022-11-02",
    sequiprecoverytime: "02-01 12:10:22",
  },
  {
    sequiperrortime: "2022-08-11",
    sequipkey: "Porsche",
    sequipdetail: "Boxster",
    sequiperror: "이상내용",
    sequiperrortimeend: "2022-11-02",
    sequiprecoverytime: "02-01 12:10:22",
  },
  {
    sequiperrortime: "2022-08-12",
    sequipkey: "BMW",
    sequipdetail: "M50",
    sequiperror: "이상내용",
    sequiperrortimeend: "2022-11-02",
    sequiprecoverytime: "02-01 12:10:22",
  },
  {
    sequiperrortime: "2022-08-30",
    sequipkey: "Aston Martin",
    sequipdetail: "DBX",
    sequiperror: "이상내용",
    sequiperrortimeend: "2022-11-02",
    sequiprecoverytime: "02-01 12:10:22",
  },
];

export const columnDefs = [
  { headerName: "발생일자", field: "sequiperrortime", flex: 1 },
  { headerName: "설비타입", field: "sequipkey", flex: 1 },
  { headerName: "상세설비", field: "sequipdetail", flex: 1 },
  { headerName: "이상내용", field: "sequiperror", flex: 3 },
  { headerName: "해제시간", field: "sequiperrortimeend", flex: 3 },
  { headerName: "고장시간", field: "sequiprecoverytime", flex: 3 },
];

// export const defaultOption = options[0];
export const timeDropdown = [
  "00",  "01",  "02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",
  "10",  "11",  "12",  "13",  "14",  "15",  "16",  "17",  "18",  "19",
  "20",  "21",  "22",  "23",
];
export const minuteDropdown = [
  "00",  "01",  "02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",
  "10",  "11",  "12",  "13",  "14",  "15",  "16",  "17",  "18",  "19",
  "20",  "21",  "22",  "23",  "24",  "25",  "26",  "27",  "28",  "29",
  "30",  "31",  "32",  "33",  "34",  "35",  "36",  "37",  "38",  "39",
  "40",  "41",  "42",  "43",  "44",  "45",  "46",  "47",  "48",  "49",
  "50",  "51",  "52",  "53",  "54",  "55",  "56",  "57",  "58",  "59",
];

export const equipOptions = [
  "합성 공정",
  "조분쇄 공정",
  "미분쇄 공정",
  "코팅 공정",
  "유틸리티",
];
export const equipSelectOptions = [
  { label: "합성 공정", value: "합성 공정" },
  { label: "조분쇄 공정", value: "조분쇄 공정" },
  { label: "미분쇄 공정", value: "미분쇄 공정" },
  { label: "코팅 공정", value: "코팅 공정" },
  { label: "유틸리티", value: "유틸리티" },
];
export const dataOptions = [
  "데이터1",
  "데이터2",
  "데이터3",
  "데이터4",
  "데이터5",
  "데이터6",
];
