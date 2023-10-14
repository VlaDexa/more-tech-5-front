"use client";

import { Circle, Placemark, Map as YMap } from "@pbe/react-yandex-maps";
import { useEffect, useRef, useState } from "react";
import ymaps from "yandex-maps";

export default function Map() {
    const mapRef = useRef<ymaps.Map | undefined>(undefined);
    const [position, setPosition] = useState([55.76, 37.64]);
    const [zoom, setZoom] = useState(9);

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
    }, [position]);

    // const ymap = useMemo(() => <YMap state={{ center: position, zoom: 9 }} width={mapRef.current?.clientWidth} height={mapRef.current?.clientHeight}></YMap>, [position, mapRef.current?.clientWidth, mapRef.current?.clientHeight]);

    mapRef.current?.events.add("wheel", (_) => {
        setZoom((old) => {
            return mapRef.current?.getZoom() ?? old
        })
    });

    return <YMap state={{ center: position, zoom }} className="w-full h-full p-4" instanceRef={mapRef}>
        <Circle geometry={[position, 2**(zoom)]} options={{
            draggable: false,
            fillOpacity: 1,
            strokeOpacity: 1,
            strokeColor: "#FFFFFF",
            fillColor: "#4789EB",
            strokeWidth: 2,
        }}></Circle>
        <Circle geometry={[position, zoom * 600]} options={{
            draggable: false,
            fillOpacity: 0.5,
            fillColor: "#FFFFFF",
            strokeColor: "#FFFFFF",
            zIndex: 100
        }}></Circle>
    </YMap>;
}