import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from './MainPages/Head';
import '../styles.css'
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import requestHandler, { Dictionary } from "../components/RequestHandler/RequestHandler";
import { AlertBox, ConfirmBox, CustomBox } from "../components/Alert/Alert";
import { AgGridDropDownIcon } from "../components/AgGridDropDownIcon/AgGridDropDownIcon";
import { v4 } from 'uuid'
import { BarChart } from '../components/BarChart/ErrorBarChart';

interface Props {
    // portfolio: protflioType[];
}

export type ModalState = "auth" | "add" | "edit" | "close" | "viewer";

const DetailBoard = ({ }: Props) => {
    const colorsA = [
        "#F15F5F",
        "#F29661",
        "#F2CB61",
        "#E5D85C",
        "#BCE55C",
        "#F361A6",
        "#F361DC",
        "#A566FF",
        "#6B66FF",
        "#6799FF",
    ];



    const [rowData, setRowData] = useState<any>([]);
    const [chartData, setChartData] = useState<any>([]);


    //조회
    const search = () => {
        requestHandler<any>("get", "/MainPage/guestbookList", {}).then((res: any) => {
            setRowData(res.data[0]);
            setChartData(res.data[1]);
        })
    };

    useEffect(() => {
        search();
    }, [])

    //추가
    const insertHandler = (row: Dictionary) => {
        requestHandler<any>("put", "/MainPage/guestbookInsert", row)
            .then((result) => {
                if (result) {
                    AlertBox("Success");
                    search();
                }
            })
            .catch((error) => {
                AlertBox("Fail", error.response.data);
            });
    };

    //수정
    const updateHandler = (row: Dictionary) => {
        requestHandler<any>("put", "/MainPage/guestbookUpdate", row)
            .then((result) => {
                if (result) {
                    AlertBox("Success");
                    search();
                }
            })
            .catch((error) => {
                AlertBox("Fail", error.response.data);
            });
    };

    //삭제
    const deleteHandler = (row: Dictionary) => {
        requestHandler<any>("put", "/MainPage/guestbookDelete", row).then((result) => {
            if (result) {
                AlertBox("Success");
                search();
            }
        })
            .catch((error) => {
                AlertBox("Fail", error.response.data);
            });
    };

    //region 그리드에 대한 설정
    const state = {
        columnDefs: [
            {
                headerName: "action",
                minWidth: 130,
                cellRenderer: actionCellRenderer,
                editable: false,
                colId: "action",
                field: "e"
            },
            {
                headerName: "작성자",
                field: "writer",
                editable: true,
                flex: 1.5
            },
            {
                headerName: "별점",
                field: "scope",
                cellRenderer: AgGridDropDownIcon,
                editable: true,
                flex: 0.7,
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: [1, 2, 3, 4, 5],
                },
            },
            {
                headerName: "한줄평",
                field: "hanjulpyeong",
                editable: true,
                flex: 5
            },
            {
                headerName: "암호",
                field: "passwdchk",
                flex: 1,
                editable: true,
            },
            {
                headerName: "원래암호",
                field: "passwd",
                editable: true,
                hide: true,
            },
            {
                headerName: "uuid",
                field: "uuid",
                editable: false,
                hide: true,
            }
        ],
        defaultColDef: {
            editable: true,
        },
    };

    const onCellClicked = (params: any) => {
        // Handle click event for action cells
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            if (action === "edit") {
                params.api.startEditingCell({
                    rowIndex: params.node.rowIndex,
                    colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                });
            }

            if (action === "delete") {
                params.api.stopEditing(false);

                if (params.node.data.passwdchk === undefined || params.node.data.passwdchk === "") {
                    params.api.startEditingCell({
                        rowIndex: params.node.rowIndex,
                        colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                    });
                    CustomBox("암호를 적어주셔야 합니다.");
                } else if (params.node.data.passwdchk === params.node.data.passwd) {
                    ConfirmBox("Delete", (yn: boolean) => {
                        if (!yn) { return; } else {
                            deleteHandler(params.node.data);

                        }
                    });

                } else {
                    params.api.startEditingCell({
                        rowIndex: params.node.rowIndex,
                        colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                    });
                    CustomBox("암호를 틀렸습니다.");
                }


            }

            if (action === "update") {

                params.api.stopEditing(false);
                if (params.node.data.passwd === 'new') {
                    if (params.node.data.passwdchk === undefined || params.node.data.passwdchk === "") {
                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                        });
                        CustomBox("암호를 적어주셔야 합니다.");
                    } else {

                        params.node.data.passwd = params.node.data.passwdchk;
                        ConfirmBox("Save", (yn: boolean) => {
                            if (!yn) { return; } else {
                                insertHandler(params.node.data);
                            }
                        });
                    }
                } else {



                    if (params.node.data.passwdchk === undefined || params.node.data.passwdchk === "") {
                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                        });
                        CustomBox("암호를 적어주셔야 합니다.");
                    } else if (params.node.data.passwdchk === params.node.data.passwd) {
                        ConfirmBox("Save", (yn: boolean) => {
                            if (!yn) { return; } else {
                                updateHandler(params.node.data);
                            }
                        });
                    } else {
                        params.api.startEditingCell({
                            rowIndex: params.node.rowIndex,
                            colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
                        });
                        CustomBox("암호를 틀렸습니다.");
                    }
                }
            }

            if (action === "cancel") {
                params.api.stopEditing(true);
                console.log(params.node.data);
            }
        }
    }
    const onRowEditingStarted = (params: any) => {
        params.api.refreshCells({
            columns: ["action"],
            rowNodes: [params.node],
            force: true,
        });
    }

    const onRowEditingStopped = (params: any) => {
        params.api.refreshCells({
            columns: ["action"],
            rowNodes: [params.node],
            force: true,
        });
    }
    //region end 그리드에 대한 설정

    const tests = () => {
        setRowData([{
            writer: "",
            scope: 5,
            hanjulpyeong: "",
            passwd: "new",
            passwdchk: "",
            uuid: v4()
        }, ...rowData])
        console.log(rowData);
    }
    return (
        <div>
            <Head />
            <body id="page-top" >
                <header className="detailMasthead bg-primary text-white text-center">
                    <div className="container d-flex align-items-center flex-column">
                        <div style={{ fontSize: "30pt" }}>방명록</div>
                    </div>
                </header>
                <section className="page-section portfolio" id="portfolio">
                    <div className="container">
                        <div>
                            <button className="btn" onClick={() => tests()}>
                                ✎글쓰기
                            </button>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: "50vh", width: "100%" }}>
                            <AgGridReact
                                onRowEditingStopped={onRowEditingStopped}
                                onRowEditingStarted={onRowEditingStarted}
                                onCellClicked={onCellClicked}
                                editType="fullRow"
                                suppressClickEdit={true}
                                columnDefs={state.columnDefs}
                                defaultColDef={state.defaultColDef}
                                enableRangeSelection={true}
                                rowHeight={50}
                                rowData={rowData}
                            />
                        </div>
                        <div className="timeStandard">
                            <div className="graphContainer">
                                <div className="barChart">
                                    <BarChart
                                        colors={colorsA}
                                        data={chartData}
                                        dataKeyBar={"count"}
                                        dataKeyLine={"Level"}
                                        word={"분"}
                                        width={"99%"}
                                        height={"99%"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
        </div>
    );
};

export default DetailBoard;

function actionCellRenderer(params: any) {
    const isCurrentRowEditing = params.api.getEditingCells().some((cell: any) => cell.rowIndex === params.node.rowIndex);

    if (isCurrentRowEditing) {
        return (
            <div>
                <button
                    className="action-button update"
                    data-action="update"
                    style={{ height: "90%", width: "35%", fontSize: "11pt" }}
                >
                    Save
                </button>
                <button
                    className="action-button delete"
                    data-action="delete"
                    style={{ height: "90%", width: "35%", fontSize: "11pt" }}
                >
                    Delete
                </button>
                <button
                    className="action-button cancel"
                    data-action="cancel"
                    style={{ height: "90%", width: "35%", fontSize: "11pt" }}
                >
                    Cancel
                </button>
            </div>
        );
    } else {
        return (
            <div>
                <button
                    className="action-button edit"
                    data-action="edit"
                    style={{ height: "90%", width: "40%", fontSize: "13pt" }}
                >
                    Edit
                </button>
            </div>
        );
    }
}
interface TestDataItem {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
}

const testData: TestDataItem[] = [
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
    },
];