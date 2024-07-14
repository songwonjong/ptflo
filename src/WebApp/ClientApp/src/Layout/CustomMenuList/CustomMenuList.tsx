import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import requestHandler, { Dictionary } from "../../components/RequestHandler/RequestHandler";
// import {ViewerList, OptimizerList, AdminList, EquipmentList} from "../../Routers/menuConstants"
import admin from "./adminwhite.png";
import optimizer from "./optimizerwhite.png";
import viewer from "./viewerwhite.png";


const MenuItem = (props: {
  children?: any;
  menuName: string;
  clickHandler?: () => void;
  detailMenu?: boolean;
  data: Dictionary;
}) => {
  const selectedMenu = props.data.where + props.data.args1 + props.data.args2
  return (
    <>
      {props.data.viewyn ? (
        <ListItemButton sx={{ pl: 4 }} onClick={props.clickHandler} selected={selectedMenu === window.location.pathname.replaceAll("/", "")}>
          <ListItemIcon>
            <LaunchOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={props.menuName}
            primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>) : (<></>)}
    </>
  )
}

const DetailItem = (props: {
  children?: any;
  menuName: string;
  clickHandler?: () => void;
  detailMenu?: boolean;
  data: Dictionary;
}) => {
  const selectedMenu = props.data.where + props.data.args1 + props.data.args2
  return (
    <ListItemButton sx={{ pl: 6, height: 30 }} onClick={props.clickHandler} selected={selectedMenu === window.location.pathname.replaceAll("/", "")}>
      <ListItemText primary={" - " + props.menuName} />
    </ListItemButton>
  )
}

const CustomMenuList = () => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const menuClick = (
    where: string,
    args1: string,
    args2?: string
  ) => {
    switch (where) {
      case "floor":
        return navigate(`/floor/${args1}/${args2}`);
      case "equipment":
        return navigate(`/equipment/${args1}/${args2}`);
      case "optimizer":
        return navigate(`/optimizer/${args1}`);
      case "admin":
        return navigate(`/admin/${args1}`);
      case "viewer":
        return navigate(`/viewer/${args1}`);
      default:
        return;
    }
  };
  var optCount = 0;
  var admCount = 0;
  // if(localStorage.getItem("user-auth")){
  //   OptimizerList.map((x:Dictionary)=>{
  //     x.viewyn = JSON.parse(localStorage.getItem("user-auth")!).find((y:Dictionary)=>y.menuId == x.args1).searchyn == "N" ? false : true ;
  //     if(x.viewyn) optCount++
  //   })
  //   AdminList.map((x:Dictionary)=>{
  //     x.viewyn = JSON.parse(localStorage.getItem("user-auth")!).find((y:Dictionary)=>y.menuId == x.args1).searchyn == "N" ? false : true ;
  //     if(x.viewyn) admCount++
  //   })

  // }else{
  //   optCount++;
  //   admCount++;
  // }

  return (
    <List
      sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper', borderRight: '2px solid black' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListSubheader component="div" id="nested-list-subheader" sx={{ fontSize: 35 }}>
        <img src={viewer} style={{ height: "50px" }} />
        {/* <InboxIcon sx={{ fontSize: 35, verticalAlign: 'middle' }}/> */}
        &nbsp;Viewer
      </ListSubheader>
      {/* {ViewerList.map((x)=>(
        <MenuItem
          menuName={x.menuName}
          clickHandler={()=>menuClick(
            x.where, 
            x.args1, 
            x.args2
          )}
          data={x}
        />
      ))} */}
      <ListItemButton sx={{ pl: 4 }} onClick={handleClick}>
        <ListItemIcon>
          <LaunchOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="설비 상세 모니터링"
          primaryTypographyProps={{ fontWeight: 'bold' }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* {EquipmentList.map((x)=>(
            <DetailItem
              menuName={x.menuName}
              clickHandler={()=>menuClick(
                x.where, 
                x.args1, 
                x.args2
              )}
              data={x}
            />
          ))} */}
        </List>
      </Collapse>
      <ListSubheader component="div" id="nested-list-subheader" sx={optCount > 0 ? { fontSize: 35, marginTop: 4 } : { display: "none" }}>
        <img src={optimizer} style={{ height: "50px" }} />
        {/* <InboxIcon sx={{ fontSize: 35, verticalAlign: 'middle' }}/> */}
        &nbsp;Optimizer
      </ListSubheader>
      {/* {OptimizerList.map((x)=>(
        <MenuItem
          menuName={x.menuName}
          clickHandler={()=>menuClick(
            x.where, 
            x.args1, 
            x.args2
          )}
          data={x}
        />
      ))} */}

      <ListSubheader component="div" id="nested-list-subheader" sx={admCount > 0 ? { fontSize: 35, marginTop: 4 } : { display: "none" }}>
        <img src={admin} style={{ height: "50px" }} />
        {/* <InboxIcon sx={{ fontSize: 35, verticalAlign: 'middle' }}/> */}
        &nbsp;Admin
      </ListSubheader>
      {/* {AdminList.map((x)=>(
        <MenuItem
          menuName={x.menuName}
          clickHandler={()=>menuClick(
            x.where, 
            x.args1, 
            x.args2
          )}
          data={x}
        />
      ))} */}

    </List>
  );
}

export default CustomMenuList;