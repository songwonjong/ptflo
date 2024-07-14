import { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class AgGridDropDownIcon implements ICellRendererComp {
  eGui!: HTMLSpanElement;

  init(params: ICellRendererParams) {
    const data = params.value === undefined ? "" : params.value;
    this.eGui = document.createElement('div');
    this.eGui.style.width = "inherit";
    this.eGui.style.display = "flex";
    this.eGui.style.justifyContent = "space-between";
    this.eGui.innerHTML = ` <div>${data}</div>`;

  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}