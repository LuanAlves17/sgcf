"use client"

import { Box, Typography } from "@mui/material";
import { colors } from "../../constants/colors";
import { IOrganization } from "../../interfaces/IOrganization";

const styles = {
    organizationDetectedBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
        background: colors.first,
        color: colors.white
    }
}

export default function OrganizationDetected(props: IOrganization) {
    return (
        <Box sx={styles.organizationDetectedBox}>
            <Typography>Unidade Sincronizada: {props.organizationName}</Typography>
        </Box>
    )
}