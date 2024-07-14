import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";

export type ErrorType = {
  id: any;
  location: string;
  message: any;
};

class ErrorControlClass {
  popUpErrors: ErrorType[] = [];
  existingErrors: ErrorType[] = [
    { id: "HS#1", location: "A동 B1층", message: "이상1" },
    { id: "HS#2", location: "A동 1F층", message: "이상2" },
    { id: "HS#2", location: "A동 1F층", message: "이상3" },
    { id: "HS#2", location: "A동 1F층", message: "이상4" },
  ];
  middleListOpen: boolean = false;

  setErrorMake = async (err: string) => {
    try {
      setInterval(() => {
        const rand = Math.random();
        const rand_0_10 = Math.floor(rand * 11);
        if (!this.existingErrors.map((i) => i.message).includes(rand_0_10)) {
          if (rand_0_10 > 5) {
            runInAction(() => {
              this.existingErrors.push({
                id: rand_0_10,
                message: rand_0_10,
                location: "HGJ#1",
              });
              this.addpopUpError({
                id: rand_0_10,
                message: rand_0_10,
                location: "HGJ#1",
              });
            });
          } else {
            runInAction(() => {
              this.existingErrors.push({
                id: rand_0_10,
                message: rand_0_10,
                location: "HGJ#1",
              });
            });
          }
        }
      }, 5000);
    } catch (error) {}
  };
  realTimeDBConnect = () => {
    try {
      //처음 디비에서 에러를 existingErrors에 저장을 하고 1초간 계속 비교를 해서 새로운 에러가 생기면 newError에 저장을 한다.
      // setInterval(async () => {
      //   const data = await axios.get({});
      //   if(data){
      //   }
      // }, 5000);
    } catch (error) {
      console.log("DB연결 에러");
    }
  };
  addpopUpError = (value: ErrorType) => {
    if (!this.popUpErrors.includes(value)) {
      this.popUpErrors.push(value);
    }
  };
  closeFnc = (value: any) => {
    this.popUpErrors = this.popUpErrors.filter(
      (i: ErrorType) => i.id !== value
    );
  };

  errorListOpenControl = (value: boolean) => {
    this.middleListOpen = value;
  };

  constructor() {
    makeObservable(this, {
      popUpErrors: observable,
      existingErrors: observable,
      middleListOpen: observable,
      
      errorListOpenControl: action,
      setErrorMake: action,
      realTimeDBConnect: action,
      addpopUpError: action,
      closeFnc: action,
    });
  }
}

export const ErrorControl = new ErrorControlClass();
