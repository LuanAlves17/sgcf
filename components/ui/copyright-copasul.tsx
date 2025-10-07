"use client"

import { Typography } from '@mui/material'
import Image from 'next/image';

import { colors } from '../../constants/colors';

const styles = {
    typographyCopyright: {
        display: 'flex',
        alignItems: 'center',
        color: colors.white,
        opacity: 0.7,
        mx: 2
    }
}

export default function CopyrightCopasul() {
    return (
        <Typography sx={styles.typographyCopyright}>Todos os direitos reservados &copy; <Image src={'/assets/png/LogoCopasul.png'} alt="logo da copasul" width={100} height={30}/></Typography>
    )
}