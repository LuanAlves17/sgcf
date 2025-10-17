"use client"

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

import Image from "next/image";
import { Avatar, Tooltip } from "@mui/material";
import { MenuItems } from "../../constants/menu-items";

export default function DrawerMenu({ onClose, onLogout, user }: { onClose: () => void; onLogout: () => void, user: string | null}) {
    const items = MenuItems();
    const inicial: string | null = user ? user[0] : null;
    
    return (
        <Box sx={{ width: 300, display: "flex", flexDirection: "column", height: "100%" }} role="presentation">
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: "1px solid #ddd",
            }}
            >
            <Image src='/assets/svg/Logo.svg' alt="Logo do qMonitor" width={170} height={45} />
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
            </Box>

            <List>
            {items.map((item, index) => (
                <ListItem key={index} disablePadding>
                <ListItemButton href={item.href}>
                    <ListItemIcon>
                    <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>

            <Divider sx={{ mt: "auto" }} />

            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
            }}
            >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 15 }}>{inicial || '?'}</Avatar>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user || 'N/a'}
                </Typography>
            </Box>

            <Tooltip title="Logout">
                <IconButton onClick={onLogout} size="small" color="error">
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
            </Box>
        </Box>
    );

}