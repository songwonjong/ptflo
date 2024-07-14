import { makeObservable, observable, action, runInAction } from "mobx";

type State = "Open" | "close";
export type ContentComponent =
  | "equipment"
  | "alarm"
  | "upperLower"
  | "trend"
  | null;

class ModalStateManage {
  modalState: State = "close";
  modalcontentcomponent: ContentComponent = null;

  modalControl = (value: State) => {
    if (value === "close") {
      this.modalcontentcomponent = null;
    }
    this.modalState = value;
  };
  setModalContentComponent = (value: ContentComponent) => {
    this.modalcontentcomponent = value;
  };

  constructor() {
    makeObservable(this, {
      modalState: observable,
      modalControl: action,
      modalcontentcomponent: observable,
      setModalContentComponent: action,
    });
  }
}

export const ModalManager = new ModalStateManage();
