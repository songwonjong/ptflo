import { makeObservable, observable, action, computed ,toJS } from "mobx";

export type DetailDataType = {
  time: string;
  uData: number;
  dData: number;
  nowData: number;
};
export type EquipStateManageType = {
  id: string;
  checked: boolean;
  datas: DetailDataType[];
};
export type CheckedDataType = {
  eqpdata: string;
  checkBox: boolean;
};

class EquipStateManage {

  clickedEquipCode:any = "RT012";

  // clickedEquipCode:any = { data : { equip_code: 'RT012'}};

  get getClickedEquipCode () {
    return this.clickedEquipCode;
  }
  setClickedEquipCode = (value:any) => {
    this.clickedEquipCode = value;
  }

  clickedEquipCodeA:any = {data : {equip_type : "RT012"}};

  // clickedEquipCodeA:any = { data : { equip_code: 'RT012'}};

  get getclickedEquipCodeA () {
    return {data : {equip_type : this.clickedEquipCode}};
  }
  setclickedEquipCodeA = (value:any) => {
    this.clickedEquipCodeA = value;
  }


  clickedProcess:any = {data: '합성 공정'};

  get getClickedProcess () {
    return this.clickedProcess;
  }

  setClickedProcess = (value:any) => {
    this.clickedProcess = value;
  }

 

  detailData: EquipStateManageType[] = [];
  selectedData:any[]=[];



  trendListData:any[] = [];


  setTrendListData = (value:any[]) => {
    this.trendListData = value;
  }

  get getTrendListData () {

    return this.trendListData;
  }


  trendListDataAction:any = false;


  setTrendListDataAction = (value:any) => {
    this.trendListDataAction = value;
  }

  get getTrendListDataAction () {
    return this.trendListDataAction;
  }


  setDetailData = (value: string) => {
    if (value === "HS#1") {
      this.detailData = [
        {
          id: "1",
          checked: true,
          datas: [
            {
              time: "2022-06-15 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 100,
            },
            {
              time: "2022-06-16 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-17 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-18 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 250,
            },
            {
              time: "2022-06-19 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 10,
            },
            {
              time: "2022-06-20 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 600,
            },
            {
              time: "2022-06-21 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 333,
            },
            {
              time: "2022-06-22 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 416,
            },
            {
              time: "2022-06-23 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 841,
            },
            {
              time: "2022-06-24 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 0,
            },
            {
              time: "2022-06-25 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 100,
            },
            {
              time: "2022-06-26 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 250,
            },
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-28 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 400,
            },
            {
              time: "2022-06-29 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-30 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 650,
            },
          ],
        },
        {
          id: "2",
          checked: true,
          datas: [
            {
              time: "2022-06-27 12:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-28 14:20:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-29 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 600,
            },
          ],
        },
        {
          id: "3",
          checked: false,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "4",
          checked: false,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "5",
          checked: false,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "6",
          checked: true,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "7",
          checked: true,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "8",
          checked: true,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
      ];
    } else if (value === "HS#2") {
      this.detailData = [
        {
          id: "1",
          checked: true,
          datas: [
            {
              time: "2022-06-15 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 100,
            },
            {
              time: "2022-06-16 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-17 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-18 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 250,
            },
            {
              time: "2022-06-19 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 10,
            },
            {
              time: "2022-06-20 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 600,
            },
            {
              time: "2022-06-21 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 333,
            },
            {
              time: "2022-06-22 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 416,
            },
            {
              time: "2022-06-23 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 841,
            },
            {
              time: "2022-06-24 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 0,
            },
            {
              time: "2022-06-25 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 100,
            },
            {
              time: "2022-06-26 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 250,
            },
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-28 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 400,
            },
            {
              time: "2022-06-29 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-30 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 650,
            },
          ],
        },
        {
          id: "2",
          checked: true,
          datas: [
            {
              time: "2022-06-27 12:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
            {
              time: "2022-06-28 14:20:00",
              uData: 700,
              dData: 200,
              nowData: 300,
            },
            {
              time: "2022-06-29 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 600,
            },
          ],
        },
        {
          id: "3",
          checked: false,
          datas: [
            {
              time: "2022-06-10 11:15:00",
              uData: 500,
              dData: 200,
              nowData: 100,
            },
            {
              time: "2022-06-11 12:15:00",
              uData: 500,
              dData: 200,
              nowData: 350,
            },
            {
              time: "2022-06-12 13:15:00",
              uData: 500,
              dData: 200,
              nowData: 450,
            },
            {
              time: "2022-06-13 14:15:00",
              uData: 500,
              dData: 200,
              nowData: 330,
            },
            {
              time: "2022-06-14 15:15:00",
              uData: 500,
              dData: 200,
              nowData: 200,
            },
          ],
        },
        {
          id: "4",
          checked: false,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "5",
          checked: false,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
        {
          id: "6",
          checked: true,
          datas: [
            {
              time: "2022-06-27 15:15:00",
              uData: 700,
              dData: 200,
              nowData: 500,
            },
          ],
        },
      ];
    } else if (value === "reset") {
      this.detailData = [];
    }
  };

  setCheckState = (i: EquipStateManageType) => {
    const newArr = this.detailData.map((prev: EquipStateManageType) => {
      if (prev.id === i.id) {
        return {
          ...prev,
          checked: !prev.checked,
        };
      } else {
        return prev;
      }
    });
    this.detailData = newArr;
  };

  setSelectedData = (selectedData: CheckedDataType[])=>{
    this.selectedData=[];
    selectedData.map(x=>{
      if(x.checkBox){
        this.selectedData.push(x.eqpdata);
      }
    })
  }
  constructor() {
    makeObservable(this, {
      detailData: observable,
      selectedData: observable,

      setDetailData: action,
      setCheckState: action,


      //공정, '합성 공정'
      clickedProcess:observable,
      setClickedProcess:action,
      getClickedProcess: computed,
      
      //설비  {data : equip_code}
      clickedEquipCode:observable,
      setClickedEquipCode:action,
      getClickedEquipCode: computed,



      clickedEquipCodeA:observable,
      setclickedEquipCodeA:action,
      getclickedEquipCodeA: computed,
      
      
      trendListData :   observable,
      setTrendListData :  action,
      getTrendListData :  computed,

      trendListDataAction :   observable,
      setTrendListDataAction :  action,
      getTrendListDataAction :  computed,
     }
    );
  }
}

export const EquipManage = new EquipStateManage();
