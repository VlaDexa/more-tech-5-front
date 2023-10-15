"use client";

import { Circle, Clusterer, Placemark, Map as YMap } from "@pbe/react-yandex-maps";
import { useEffect, useRef, useState } from "react";
import ymaps from "yandex-maps";
import Panel, { Filters } from "./@panel/page";
import Alert from "./alert";
import { AtmShow, SalepointShow } from "@/openapi";

export default function Map() {
    const mapRef = useRef<ymaps.Map | undefined>(undefined);
    const [position, setPosition] = useState([55.76, 37.64]);
    const [zoom, setZoom] = useState(9);
    const [filters, setFilters] = useState<Filters>({ type: "Отделения", consultation: false, creditCard: false, debitCard: false, issuing: false, });

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Ваш браузер не поддерживает геолокацию")
        } else {
            navigator.geolocation.getCurrentPosition((position) => { setPosition([position.coords.latitude, position.coords.longitude]) }, (error) => { console.error(error) });
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) { return; }
        mapRef.current.panTo(position, {
            safe: true,
            flying: false
        });
    }, [position]);

    // const ymap = useMemo(() => <YMap state={{ center: position, zoom: 9 }} width={mapRef.current?.clientWidth} height={mapRef.current?.clientHeight}></YMap>, [position, mapRef.current?.clientWidth, mapRef.current?.clientHeight]);

    mapRef.current?.events.add("wheel", (_) => {
        setZoom((old) => {
            return mapRef.current?.getZoom() ?? old
        })
    });

    const [offices, setOffices] = useState<(SalepointShow | AtmShow)[] | undefined>(undefined);
    const deps: boolean[] = [
        filters.type === "Отделения" && filters.consultation,
        filters.type === "Отделения" && filters.creditCard,
        filters.type === "Отделения" && filters.debitCard,
        filters.type === "Отделения" && filters.issuing,
        filters.type === "Банкоматы" && filters.allDay,
        filters.type === "Банкоматы" && filters.blind,
        filters.type === "Банкоматы" && filters.nfcForBankCards,
        filters.type === "Банкоматы" && filters.qrRead,
        filters.type === "Банкоматы" && filters.supportsChargeRub,
        filters.type === "Банкоматы" && filters.supportsEur,
        filters.type === "Банкоматы" && filters.supportsRub,
        filters.type === "Банкоматы" && filters.supportsUsd,
        filters.type === "Банкоматы" && filters.wheelchair
    ];
    useEffect(() => {
        async function work() {
            if (filters.type === "Отделения") {
                const req = await fetch("http://api.lapki.vladexa.ru:8000/api/v1/salepoint/filters", {
                    "headers": {
                        "accept": "application/json",
                        "content-type": "application/json",
                    },
                    "body": JSON.stringify({
                        offset: 0,
                        limit: 300,
                        credit_card: filters.creditCard,
                        debit_card: filters.debitCard,
                        consultation: filters.consultation,
                        issuing: filters.issuing
                    }),
                    "method": "POST",
                });
                const offices: SalepointShow[] = await req.json();
                setOffices(offices)
            } else {
                const req = await fetch("http://api.lapki.vladexa.ru:8000/api/v1/atms/filters", {
                    "headers": {
                        "accept": "application/json",
                        "content-type": "application/json",
                    },
                    "body": JSON.stringify({
                        offset: 0,
                        limit: 300,
                        allDay: filters.allDay,
                        blind: filters.blind,
                        nfcForBankCards: filters.nfcForBankCards,
                        qrRead: filters.qrRead,
                        supportsChargeRub: filters.supportsChargeRub,
                        supportsEur: filters.supportsEur,
                        supportsRub: filters.supportsRub,
                        supportsUsd: filters.supportsUsd,
                        wheelchair: filters.wheelchair
                    }),
                    "method": "POST",
                });
                const atms = await req.json();
                setOffices(atms);
            }
        }
        work()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, filters.type])

    return <YMap state={{ center: position, zoom }} className="relative w-full h-full" instanceRef={mapRef}>
        <Panel onChange={(filter) => setFilters(filter)}></Panel>
        <Alert className="block absolute top-[21rem] w-1/4 left-[39%] z-[200]" />
        <Placemark defaultGeometry={position} defaultOptions={{
            preset: "islands#circleDotIcon"
        }} />
        <Clusterer>
            {offices ? offices.map(el => <Placemark key={el.id} defaultGeometry={[el.latitude, el.longitude]}></Placemark>) : <></>}
        </Clusterer>
    </YMap>;
}