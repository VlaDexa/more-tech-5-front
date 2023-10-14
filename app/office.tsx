"use client";
import { AtmsService, SalepointService } from "@/openapi";
import { useEffect, useState } from "react";
import Znak from "@/public/znak.svg";
import Info from "@/public/info.svg";
import Image from "next/image";

export enum Type {
    Atm, Office
}

async function getInfo(id: string, type: Type): Promise<{ address: string, distance: number, loaded: boolean }> {
    switch (type) {
        case Type.Atm: {
            const req = await SalepointService.getSalePointApiV1SalepointGet(id)
            return {
                address: req.address,
                distance: req.distance,
                loaded: Math.random() > 0.5
            }
        }
        case Type.Office: {
            const req = await AtmsService.getAtmApiV1AtmsGet(id);
            return {
                address: req.address,
                distance: 180,
                loaded: Math.random() > 0.5
            }
        }
    }
}

export default function Office(props: { id: string, type: Type }) {
    const [info, setInfo] = useState<Awaited<ReturnType<typeof getInfo>> | undefined>(undefined);
    useEffect(() => { getInfo(props.id, props.type).then(info => setInfo(info)) }, [props.id, props.type])
    return info ? <address>
        <Image src={Znak} alt="" />
        <div className="flex flex-col">
            <span className="text-xl">{info.address}</span>
            {info.loaded ? <></> : <span className="text-[#CA181F] flex flex-row">
                <Image src={Info} alt="Внимание"/>
                Сильно загружен
            </span>}
        </div>
        <span className="text-xl text-vtb-blue">{info.distance}</span>
    </address> : <></>
}