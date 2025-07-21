"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

const menuItems = [
  { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { name: "Ventas", path: "/ventas", icon: <PointOfSaleIcon /> },
  { name: "Productos", path: "/productos", icon: <InventoryIcon /> },
  { name: "Clientes", path: "/clientes", icon: <PeopleIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#000",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Sistema Ventas
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#333",
                    color: "#4caf50",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "#444",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
