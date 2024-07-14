import { ICellEditorComp, ICellEditorParams } from "ag-grid-community";

export class AgGridNumberEditor implements ICellEditorComp {
  
  focusAfterAttached:any;
  value: any;
  input!: HTMLInputElement;

  init(params: ICellEditorParams) {

    this.focusAfterAttached = params.cellStartedEdit;
    this.value = params.value;

    this.input = document.createElement("input");
    this.input.classList.add("doubling-input");
    this.input.id = "input";
    this.input.type = "number";
    this.input.value = this.value;
    this.input.onkeydown = (event) => {
      return event.keyCode == 69 ? false : true;
    };

    this.input.addEventListener("input", (event: any) => {
      this.value = event.target.value;
    });

  }
  

  /* Component Editor Lifecycle methods */
  // gets called once when grid ready to insert the element
  getGui() {
    return this.input;
  }
  

  // the final value to send to the grid, on completion of editing
  getValue() {
    // this simple editor doubles any value entered into the input
    return this.value;
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart() {
    return false;
  }

  // Gets called once when editing is finished (eg if Enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd() {
    // our editor will reject any value greater than 1000
    return false;
  }

  // after this component has been created and inserted into the grid
  afterGuiAttached() {
    // this.input.focus();
    if (this.focusAfterAttached) {
      this.input.focus();
      this.input.select();
    }
  }
  focusIn() {
    var eInput = this.getGui();
    eInput.focus();
    eInput.select();
  }
}
