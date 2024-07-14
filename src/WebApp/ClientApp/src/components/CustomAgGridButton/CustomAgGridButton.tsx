import { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class CustomAgGridButton implements ICellRendererComp {
  eGui!: HTMLSpanElement;

  init(params: ICellRendererParams) {
    const data = params.value === undefined ? "" : params.value;
    this.eGui = document.createElement('div');
    // this.eGui.style.width = "inherit";
    // this.eGui.style.display = "flex";
    // this.eGui.style.justifyContent = "space-between";
    // this.eGui.innerHTML = `<div>${data}</div> <div style="font-size:50px;">▾</div>`;
    this.eGui.innerHTML = `
    <button 
      class="action-button edit"  
      data-action="edit">
         edit 
      </button>
    <button 
      class="action-button delete"
      data-action="delete">
         delete
    </button>
    `;
  }

  getGui() {
    return this.eGui;
  }
  getValueToDisplay(params: any) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex;
    });
    if (isCurrentRowEditing) {
      this.eGui.innerHTML = `
          <button  
            class="action-button update"
            data-action="update">
                 update  
          </button>
          <button  
            class="action-button cancel"
            data-action="cancel">
                 cancel
          </button>
          `;
    } else {
      this.eGui.innerHTML = `
          <button 
            class="action-button edit"  
            data-action="edit">
               edit 
            </button>
          <button 
            class="action-button delete"
            data-action="delete">
               delete
          </button>
          `;
    }
    return false;
  }
}