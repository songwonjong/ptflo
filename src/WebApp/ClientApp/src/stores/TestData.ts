export const Buildings = {
  A: {
    B1: ["합성#1", "후공정#1", "환경#2", "기타#1"],
    "1F": ["합성#2", "합성#3", "후공정#2", "환경#1", "기타#2"],
    "2F": [],
    "3F": [],
  },
  B: {
    B1: ["합성#4", "후공정#3", "환경#3", "기타#2", "기타#3"],
    "1F": ["합성#5", "후공정#4", "환경#4", "기타#4"],
    "2F": ["기타#5", "기타#6", "기타#7"],
    "3F": [],
    "4F": [],
  },
  C: {
    B1: ["후공정#5", "후공정#6", "환경#5", "기타#8", "기타#9", "기타#10"],
    "1F": [],
    "2F": [],
    "3F": [],
    "4F": [],
    "5F": [],
    "6F": [],
  },
  D: { B1: ["환경#6", "환경#7"], "1F": [], "2F": [], "3F": [], "4F": [] },
  E: { B1: [], "1F": [], "2F": [], "3F": [], "4F": [], "5F": [] },
};

export const Mechines = {
  HS: {
    label: "합성",
    data: ["합성#1", "합성#2", "합성#3", "합성#4", "합성#5"],
  },
  HGJ: {
    label: "후공정",
    data: [
      "후공정#1",
      "후공정#2",
      "후공정#3",
      "후공정#4",
      "후공정#5",
      "후공정#6",
    ],
  },
  HG: {
    label: "환경",
    data: [
      "환경#1",
      "환경#2",
      "환경#3",
      "환경#4",
      "환경#5",
      "환경#6",
      "환경#7",
    ],
  },
  GT: {
    label: "기타",
    data: [
      "기타#1",
      "기타#2",
      "기타#3",
      "기타#4",
      "기타#5",
      "기타#6",
      "기타#7",
      "기타#8",
      "기타#9",
      "기타#10",
    ],
  },
};

export const equipModalTestRowData = [
  {
    equipType: "HS",
    equipName: "합성#001",
    equipCode: "HS#001",
    equipLocation: "A동 1층",
    ipAddress: "111.111.111.001",
    content: "1111",
  },
  {
    equipType: "HGJ",
    equipName: "후공정#002",
    equipCode: "HGJ#002",
    equipLocation: "B동 2층",
    ipAddress: "222.222.222.002",
    content: "222222",
  },
  {
    equipType: "HS",
    equipName: "합성#002",
    equipCode: "HS#001",
    equipLocation: "A동 1층",
    ipAddress: "111.111.111.001",
    content: "1111",
  },
  {
    equipType: "HGJ",
    equipName: "후공정#001",
    equipCode: "HGJ#002",
    equipLocation: "B동 2층",
    ipAddress: "222.222.222.002",
    content: "222222",
  },
  {
    equipType: "HG",
    equipName: "환경#001",
    equipCode: "HS#001",
    equipLocation: "A동 1층",
    ipAddress: "111.111.111.001",
    content: "1111",
  },
  {
    equipType: "HG",
    equipName: "환경#002",
    equipCode: "HGJ#002",
    equipLocation: "B동 2층",
    ipAddress: "222.222.222.002",
    content: "222222",
  },
];

export const EquipDatas = [
  {
    equipType: "HS",
    equipName: "합성#1",
    equipCode: "HS001",
    equipLocation: "A동 B1층",
    ipAddress: "111.111.111.1",
    content: "테스트1",
  },
  {
    equipType: "HS",
    equipName: "합성#2",
    equipCode: "HS002",
    equipLocation: "A동 1F층",
    ipAddress: "222.222.222.2",
    content: "테스트2",
  },
  {
    equipType: "HS",
    equipName: "합성#3",
    equipCode: "HS003",
    equipLocation: "",
    ipAddress: "",
    content: "테스트3",
  },
];
