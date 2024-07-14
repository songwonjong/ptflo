import myStyle from "./MenuButton.module.scss";
import {
  ContentComponent,
  ModalManager,
} from "../../../stores/ModalStateManage";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import CustomMenu from "../../../components/CustomMenu";

type MenuItemType = {
  name: string;
  componentN: ContentComponent | null;
};
const MenuButton = () => {
  const { modalControl, setModalContentComponent } = ModalManager;

  const navigate = useNavigate();

  const MenuItmes: MenuItemType[] = [
    { name: "알람 마스터", componentN: "alarm" },
    { name: "설비 마스터", componentN: "equipment" },
    { name: "알람 이력 조회", componentN: null },
    { name: "트랜트 팝업", componentN: "trend" },
  ];

  const onMenuClick = (value: ContentComponent | null) => {
    if (value) {
      navigate("/");
      modalControl("Open");
      setModalContentComponent(value);
    } else {
      navigate("/alarmhistoylist");
    }
  };

  return (
    <div className={myStyle.container}>
      <div
        style={{
          width: "97%",
        }}
      >
        <CustomMenu
          text="메뉴"
          menuItem={MenuItmes.map((i: MenuItemType) => i.name)}
          menuItemClick={(value) => {
            let filterValue = MenuItmes.filter(
              (item: MenuItemType) => item.name === value
            );
            onMenuClick(filterValue[0].componentN);
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        />
      </div>
    </div>
  );
};

export default MenuButton;
