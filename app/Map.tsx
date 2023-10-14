"use client";

import { Map as YMap } from "@pbe/react-yandex-maps";
import { useEffect, useRef, useState } from "react";
import ymaps from "yandex-maps";

export default function Map() {
    const mapRef = useRef<ymaps.Map | undefined>(undefined);
    const [position, setPosition] = useState([55.76, 37.64]);

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Ваш браузер не поддерживает геолокацию")
        } else {
            navigator.geolocation.getCurrentPosition((position) => { setPosition([position.coords.latitude, position.coords.longitude]) }, (error) => { console.error(error) });
        }
    }, []);

    useEffect(() => {
        console.log("Position ", position)
        if (!mapRef.current) { return; }
        console.log("Got map")
        mapRef.current.panTo(position, {
            safe: true,
            flying: false
        });
    }, [position])
    // const ymap = useMemo(() => <YMap state={{ center: position, zoom: 9 }} width={mapRef.current?.clientWidth} height={mapRef.current?.clientHeight}></YMap>, [position, mapRef.current?.clientWidth, mapRef.current?.clientHeight]);

    return <YMap state={{ center: position, zoom: 9 }} className="w-full h-full p-4" instanceRef={mapRef}></YMap>;
}