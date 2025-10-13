"use client";

import React, { MouseEvent, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { items } from "../../constants/menu-items";
import { getSession, signOut } from "next-auth/react";

import { clearStorage } from "../../functions/storage/clearLocalStorage";

interface MenuItemData {
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function AvatarMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session?.user?.name || "?");
    };
    fetchSession();
  }, []);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (href: string) => {
    window.location.replace(href);
    handleMenuClose();
  };

  const handleLogout = async () => {
    handleMenuClose();
    clearStorage();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Box display="flex" alignItems="center" textAlign="center">
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {user ? user[0].toUpperCase() : "?"}
        </Avatar>
      </IconButton>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {items.map((item: MenuItemData, index: number) => {
          const Icon = item.icon;
          return (
            <MenuItem key={index} onClick={() => handleItemClick(item.href)}>
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              {item.label}
            </MenuItem>
          );
        })}

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
