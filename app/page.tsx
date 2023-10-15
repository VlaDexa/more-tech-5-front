"use client";
import { YMaps } from '@pbe/react-yandex-maps';
import Map from "./Map";
import { OpenAPI } from '@/openapi';

export default function Home(props: {panel: React.ReactHTML}) {
    OpenAPI.BASE = "https://api.lapki.vladexa.ru:8000"

    return <main className='relative w-full h-full'>
        <YMaps>
            <Map></Map>
        </YMaps>
    </main>;
}