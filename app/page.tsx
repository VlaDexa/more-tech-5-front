"use client";
import { YMaps } from '@pbe/react-yandex-maps';
import Map from "./Map";

export default function Home(props: {panel: React.ReactHTML}) {
    return <main className='relative w-full h-full'>
        <YMaps>
            <Map></Map>
        </YMaps>
    </main>;
}