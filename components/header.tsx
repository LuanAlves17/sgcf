"use client"

import { useState } from "react"

import { Box, Button, Drawer, Grid, useMediaQuery  } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';

import DrawerMenu from "./ui/drawer"
import TimeLocal from "./ui/time-local"
import OrganizationDetected from "./ui/organization-detected"

import Image from "next/image"
import { colors } from "../constants/colors"


import { useUnidade } from "../hooks/useUnidade"
import { useLogin } from "../hooks/useLogin"


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        background: "#d6e1df",
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
        flex: '1',
        flexWrap: 'wrap'
    },
    imagesBox: {
        display: "flex",
        alignItems: "center",
        gap: 1
    },
    split: {
        width: '1.5px',
        height: 20,
        background: colors.second
    },
    items: {
        display: 'flex',
        gap: 1,
        alignItems: 'center'
    }
}


export default function Header() {
    const { unidade } = useUnidade();
    const { logout } = useLogin();

    const isResponsive = useMediaQuery('(max-width: 570px)');
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <Grid container sx={styles.container}>
            { unidade ? <OrganizationDetected organizationName={unidade} /> : null}

            <Grid container sx={styles.header} px={5} py={1}>
                <Box sx={styles.imagesBox} component={"a"} href="/dashboard">
                    <Image src='/assets/svg/Logo.svg' alt="Logo do qMonitor" width={170} height={45} />
                    {
                        !isResponsive && (
                            <>
                                <Box sx={styles.split}></Box>
                                <Image src='/assets/png/LogoCopasul.png' alt="Logo da Copasul" width={130} height={40}/>   
                            </>
                        )
                    }
                </Box>
                
                <Box sx={styles.items}>
                    { !isResponsive && <TimeLocal/> }
                    <Button onClick={toggleDrawer(true)} sx={{color: colors.white, background: colors.first, borderRadius: 50}}><MenuIcon/></Button>

                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        <DrawerMenu onClose={toggleDrawer(false)} onLogout={logout} user={"Luan"} />
                    </Drawer>
                </Box>

            </Grid>
        </Grid>
    )
}