import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "./CustomAgGrid.scss";
import { ColDef, CellClickedEvent } from "ag-grid-community";
import PriorityCellRenderer from './cellRenderer'

interface Props {
  rowData: { [key: string]: any }[];
  columnDefs: ColDef[];
  onCellClicked?: (data: CellClickedEvent) => void;
  rowSelection?: string;
}
// function PriorityCellRenderer(props:any) {
//   return (
//     <>
//       <input
//         type="checkbox" 
//         defaultChecked ={false}
//         checked={props.data.chkbox}
//     />
//     </>
//   );
// };
const CustomAgGrid = ({
  rowData,
  columnDefs,
  onCellClicked,
  rowSelection,
}: Props) => {
  const frameworkComponents = {
    checkboxRenderer: PriorityCellRenderer,
  };

  // onModelUpdated={selectFirstRow}
  const selectFirstRow = (e : any) => {
    const { api } = e;
    if(rowData.length>0) {
      api.selectNode(api.getDisplayedRowAtIndex(0));
    }
  }
  
  const selectNode = (event : any) => {
    event.api.sizeColumnsToFit();
    event.api.forEachNode((node : any) => {
      node.rowIndex === 0 ? node.setSelected(true) : node.setSelected(false)
    });
    setTimeout(() => {
      
    }, 1000);
  }

  return (
    <div className="ag-theme-alpine6" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={rowSelection}
        suppressMovableColumns={true}
        onCellClicked={onCellClicked}
        frameworkComponents={frameworkComponents}
        onGridReady={(e) => selectNode(e)}
        defaultColDef={{
          suppressMenu:true
        }}
        // onModelUpdated={selectFirstRow}
      />
    </div>
  );
};
export default CustomAgGrid;

