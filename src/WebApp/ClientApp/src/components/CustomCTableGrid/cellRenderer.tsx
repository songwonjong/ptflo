import React from 'react';

function PriorityCellRenderer(props:any) {
  return (
    <>
      <input
        type="checkbox" 
        onChange={(event: any) => {
          let checked = event.target.checked;
          let colId = props.column.colId;
          props.node.setDataValue(colId, checked);
        }}
        checked={props.value}
    />
    </>
  );
};

export default PriorityCellRenderer;