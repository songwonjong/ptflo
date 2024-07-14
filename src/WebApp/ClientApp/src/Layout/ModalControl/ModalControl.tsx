import { IconButton, Modal, ThemeProvider } from "@mui/material";
import { ModalManager } from "../../stores/ModalStateManage";
import myStyle from "./ModalControl.module.scss";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import EquipmentMaster from "./ModalContents/EquipmentMaster";
import AlarmMaster from "./ModalContents/AlarmMaster";
import TrendMaster from "./ModalContents/TrendMaster";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../Styles/CustomStyles";

const ModalControl = observer(() => {
  const { modalState, modalcontentcomponent, modalControl } = ModalManager;

  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (modalcontentcomponent === "equipment") {
      setTitle("설비 마스터");
      setContent(<EquipmentMaster />);
    } else if (modalcontentcomponent === "alarm") {
      setTitle("알람 마스터");
      setContent(<AlarmMaster />);
    } else if (modalcontentcomponent === "trend") {
      setTitle("트렌드 마스터");
      setContent(<TrendMaster />);
    } else if (modalcontentcomponent === null) {
      setTitle("");
      setContent(null);
    }
  }, [modalcontentcomponent]);

  return (
    <Modal
      sx={{ display: `${modalState === "Open" ? "" : "none"}` }}
      keepMounted
      open={modalState === "Open"}
    >
      <div
        className={myStyle.container}
        aria-labelledby="transition-modal-title"
        aria-activedescendant="transition-modal-description"
      >
        <div className={myStyle.header}>
          <div className={myStyle.logo}>LogoInModal</div>
          <div className={myStyle.title}>{title}</div>
          <div
            style={{
              display: "flex",
              width: "120px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemeProvider theme={theme}>
              <IconButton onClick={() => modalControl("close")}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </ThemeProvider>
          </div>
        </div>
        <div className={myStyle.main}>
          <div className={myStyle.content}>{content}</div>
        </div>
      </div>
    </Modal>
  );
});

export default ModalControl;
