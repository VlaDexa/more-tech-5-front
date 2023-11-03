"use client";
import { AtmShow, ApiError } from "@/openapi";
import Znak from "@/public/znak.svg";
import Info from "@/public/info.svg";
import Image from "next/image";
import useSWR, {Fetcher} from 'swr'

export enum Type {
    Atm, Office
}

async function getInfo(id: string, type: Type): Promise<{ address: string, distance: number, loaded: boolean }> {
    switch (type) {
        case Type.Atm: {
            const req = await fetch(`https://api.lapki.vladexa.ru:8000/api/v1/atms/?id=${id}`, {
                cache: "force-cache",
                headers: {
                    'Cache-Control': 'max-age=3600',
                }
            });
            const point: AtmShow = await req.json();
            return {
                address: point.address,
                distance: 180,
                loaded: Math.random() > 0.5
            }
        }
        case Type.Office: {
            const req = await fetch(`https://api.lapki.vladexa.ru:8000/api/v1/salepoint/?id=${id}`, {
                cache: "force-cache",
                headers: {
                    'Cache-Control': 'max-age=3600',
                }
            });
            const point = await req.json();
            return {
                address: point.address,
                distance: point.distance,
                loaded: Math.random() > 0.5
            }
        }
    }
}

const Office = (props: { id: string, type: Type, distance: number }) => {
    const fetcher: Fetcher<Awaited<ReturnType<typeof getInfo>>, [string, Type]> = ([id, type]) => getInfo(id, type);
    const {data: info, error, isLoading: loading} = useSWR([props.id, props.type], fetcher);

    if (!info || error || loading) return <></>;

    const address = <address className="flex flex-row rounded-[10px] hover:bg-vtb-gray group px-[10px] py-[6px] gap-2">
        <Image src={Znak} alt="" />
        <div className="flex flex-col flex-grow">
            <span className="text-xl group-hover:font-bold">{info?.address}</span>
            {info?.loaded ? <></> : <span className="text-[#CA181F] flex flex-row">
                <Image src={Info} alt="Внимание" />
                Сильно загружен
            </span>}
        </div>
        <span className="text-xl text-vtb-blue">{props.distance === 0 ? Math.floor(Math.random() * 500) : props.distance} м</span>
    </address>;
    // console.log("info: ", info);
    return address;
}

export default Office;
