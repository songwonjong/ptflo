import { ILinkInfo } from "../components/MenuLink/MenuLink";

export const ViewerList = [
  {
    menuName: "공장 현황 모니터링",
    where: "viewer",
    args1: "faccurmonitoring",
    args2: "",
    viewyn: true,
  },
  {menuName : "설비 상세 모니터링", where : "equipment", args1 : "HS", args2 : "Detail", viewyn:true},
  // {menuName : "설비 상세 모니터링", detailMenu : true},
]
export const OptimizerList=[
  // {menuName : "데이터 트렌드 조회", where : "optimizer", args1 : "datatrend", args2 : "", viewyn:true},
  {menuName : "데이터 트렌드 조회", where : "optimizer", args1 : "datatrendmulti", args2 : "", viewyn:true},
  {menuName : "알람 통계", where : "optimizer", args1 : "alarmstatistics", args2 : "", viewyn:true},
  {menuName : "사용자 로깅 조회", where : "optimizer", args1 : "userlogging", args2 : "", viewyn:true},
]
export const AdminList=[
  {menuName : "기준 상/하한값 관리", where : "admin", args1 : "stdlimitmanagement", args2 : "", viewyn:true},
  {menuName : "알람 마스터 관리", where : "admin", args1 : "alarmmaster", args2 : "", viewyn:true},
  {menuName : "사용자 계정 관리", where : "admin", args1 : "useraccoutmanagement", args2 : "", viewyn:true},
]
export const EquipmentList=[
  {menuName : "합성 공정", where : "equipment", args1 : "HS", args2 : "Detail", viewyn:true},
  {menuName : "조분쇄 공정", where : "equipment", args1 : "SBS", args2 : "Detail", viewyn:true},
  {menuName : "미분쇄 공정", where : "equipment", args1 : "MB", args2 : "Detail", viewyn:true},
  {menuName : "코팅 공정", where : "equipment", args1 : "CT", args2 : "Detail", viewyn:true},
  {menuName : "후공정", where : "equipment", args1 : "MX", args2 : "Detail", viewyn:true},
  {menuName : "유틸리티", where : "equipment", args1 : "UT", args2 : "Detail", viewyn:true},
]

export const viewerListM: ILinkInfo[] = [
  {
    category: "Viewer",
    label: "전체 모니터링",
    url: "/viewer/totalmonitoring",
  },
  {
    category: "Viewer",
    label: "설비 상세 모니터링",
    url: "/equipment/HS/Detail",
  },
];
export const viewerList: ILinkInfo[] = [
  {
    category: "Viewer",
    label: "합성 공정",
    url: "/equipment/MB/Detail",
  },
  {
    category: "Viewer",
    label: "조분쇄 공정",
    url: "/equipment/SBS/Detail",
  },
  {
    category: "Viewer",
    label: "미분쇄 공정",
    url: "/equipment/SBS/Detail",
  },
  {
    category: "Viewer",
    label: "코팅 공정",
    url: "/equipment/CT/Detail",
  },
  {
    category: "Viewer",
    label: "후공정",
    url: "/equipment/MX/Detail",
  },
  {
    category: "Viewer",
    label: "유틸리티",
    url: "/equipment/UT/Detail",
  },
];
export const optimizerList: ILinkInfo[] = [
  // {
  //   category: "Optimizer",
  //   label: "데이터 트렌드 조회",
  //   url: "/optimizer/datatrend",
  // },
  {
    category: "Optimizer",
    label: "데이터 트렌드 조회",
    url: "/optimizer/datatrendmulti",
  },
  {
    category: "Optimizer",
    label: "알람 통계 조회",
    url: "/optimizer/alarmstatistics",
  },
  {
    category: "Optimizer",
    label: "알람 이력 조회",
    url: "/optimizer/alarmhistory",
  },
  {
    category: "Optimizer",
    label: "사용자 로깅 조회",
    url: "/optimizer/userlogging",
  },
];
export const adminList: ILinkInfo[] = [
  {
    category: "관리자",
    label: "기준 상/하한값 관리",
    url: "/admin/stdlimitmanagement",
  },
  {
    category: "관리자",
    label: "알람 마스터 관리",
    url: "/admin/alarmmaster",
  },
  {
    category: "관리자",
    label: "사용자 계정 관리",
    url: "/admin/useraccoutmanagement",
  },
];
