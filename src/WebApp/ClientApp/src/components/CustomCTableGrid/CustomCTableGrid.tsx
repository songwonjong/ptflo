import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "./CustomCTableGrid.scss"
import { AgGridReact } from "ag-grid-react";
import React from "react";

interface Props {
  open: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
}


const CustomCTableGrid = (props:Props) => {
  const { open, close, title, children } = props;


  return (
    <div className={ open ? 'openModal modal3' : 'modal'}>
      {open ? (
        <section>
          <header className={"interlock"}>
            {title}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
              {children}
          </main>
        </section>
       
        ) : null}
      </div>
  );
};

export default CustomCTableGrid;

const columnDefs = [
  { headerName: "설비명",field: "id", flex: 1 ,
  rowSpan: function(params: any) {
    return params.data.rowspan;
  },
  cellClassRules: {
    'cell-span': "data.rowspan !== 1",
  },
  },
  { headerName: "데이터", field: "data", flex: 1 ,resizable: true, },
  { headerName: "온도", field: "temper", flex: 1 ,resizable: true,},
  { headerName: "분당뭐", field: "min", flex: 1 ,resizable: true,}
];

const defaultColDef={
  width: 170,
  resizable: true,
};
const testData =[
  {id:"11111111",data:"qw",temper:"12",min:"1231",rowspan:4},
  {id:"2",data:"asd",temper:"12",min:"3",rowspan:1},
  {id:"3",data:"asdf",temper:"32",min:"432",rowspan:1},
  {id:"4",data:"a",temper:"231",min:"42",rowspan:1},
  {id:"5555555",data:"ss",temper:"21",min:"212",rowspan:2},
  {id:"6",data:"dfd",temper:"12",min:"123",rowspan:1},
  {id:"7777777",data:"ssasdf",temper:"12",min:"123",rowspan:3},
  {id:"8",data:"a",temper:"453",min:"123",rowspan:1},
  {id:"9",data:"a",temper:"121",min:"12",rowspan:1},

]