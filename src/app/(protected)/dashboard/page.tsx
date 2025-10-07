"use client"

import { useEffect, useState } from "react";

import Header from "../../../../components/header";
import { getLocalStorageByKey } from "../../../../functions/storage/getLocalStorage";

export default function Dashboard() {
    const [unidade, setUnidade] = useState<string>();
    
    useEffect(() => {
        const unidadeEncontrada: string | null = getLocalStorageByKey<string>("unidade");
    
        if(unidadeEncontrada) setUnidade(unidadeEncontrada)
    }, []);

    return (
        <>
            <Header organizationName={unidade}/>
        </>
    )
}