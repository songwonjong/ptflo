import { Menu, MenuItem, PopoverOrigin, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../Styles/CustomStyles";
import CustomButton from "../CustomButton/CustomButton";
import myStyle from "./CustomMenu.module.scss";

interface Props {
  text: string;
  menuItem: any[];
  menuItemClick: (value: any) => void;
  anchorOrigin: PopoverOrigin; //https://mui.com/material-ui/react-popover/
  transformOrigin: PopoverOrigin;
}

const CustomMenu = ({
  text,
  menuItem,
  menuItemClick,
  anchorOrigin,
  transformOrigin,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={myStyle.container}>
      <CustomButton color="primary" text={text} onClick={handleClick} />
      <ThemeProvider theme={theme}>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 350,
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        >
          {menuItem?.map((i: any, idx: number) => (
            <MenuItem
              key={idx}
              divider
              onClick={() => {
                handleClose();
                menuItemClick(i);
              }}
            >
              {i}
            </MenuItem>
          ))}
        </Menu>
      </ThemeProvider>
    </div>
  );
};

export default CustomMenu;
