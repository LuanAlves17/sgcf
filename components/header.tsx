"use client"

import { Box,  Grid } from "@mui/material"
import Image from "next/image"

import React, { useEffect, useState } from "react"
import TimeLocal from "./ui/time-local"
import OrganizationDetected from "./ui/organization-detected"
import { colors } from "../constants/colors"
import { getLocalStorageByKey } from "../functions/storage/getLocalStorage"
import { IOrganization } from "../interfaces/IOrganization"

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
    }
}

export default function Header(props: IOrganization) {
    return (
        <Grid container sx={styles.container}>
            { props.organizationName ? <OrganizationDetected organizationName={props.organizationName} /> : null}

            <Grid container sx={styles.header} px={5} py={1}>
                <Box sx={styles.imagesBox}>
                    <Image src='/assets/svg/Logo.svg' alt="Logo do qMonitor" width={170} height={45} />
                    <Box sx={styles.split}></Box>
                    <Image src='/assets/png/LogoCopasul.png' alt="Logo da Copasul" width={130} height={40}/>
                </Box>
                
                <TimeLocal/>

            </Grid>
        </Grid>
    )
}