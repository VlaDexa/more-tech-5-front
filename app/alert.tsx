"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Alert(props: { className?: string }) {
    const [show, setShown] = useState(false);
    const [_, setTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    const alert = useRef<HTMLDivElement>(null);

    const renewTimer = useCallback((newTimer: ReturnType<typeof setTimeout>) => {
        setTimer(old => {
            old && clearTimeout(old);
            return newTimer;
        })
    }, []);

    const opaque = useMemo(() => ({ opacity: "0" }), []);
    const shown = useMemo(() => ({ opacity: "1" }), []);
    const animTime: KeyframeAnimationOptions = useMemo(() => ({
        duration: 500,
        iterations: 1,
        fill: "forwards"
    }),[]);
    const timeShown = 20;

    useEffect(() => {
        window.addEventListener("more:dollar-alert", () => {
            renewTimer(setTimeout(() => {
                if (alert.current)
                    alert.current.animate([shown, opaque], animTime).onfinish = () => setShown(false)
                else
                    setShown(false);
            }, timeShown * 1000));
            setShown(old => {
                if (!alert.current || old) return true;
                alert.current.animate([
                    opaque,
                    shown,
                ], animTime);
                return true;
            })
        });
    }, [animTime, opaque, renewTimer, show, shown])

    return <div
        ref={alert}
        className={`border-2 rounded-[20px] border-[#CA181F] bg-white py-[30px] px-[18px] flex flex-col gap-5 ${show ? undefined : 'hidden'} ${props.className}`}
        aria-hidden={!show}
        aria-live="assertive"
    >
        <h1 className="text-[#2B2B2B] text-xl">К сожалению, фильтр сейчас недоступен.</h1>
        <p className="text-[#6C6C6C] text-base">Сейчас все операции с валютой приостановлены. Извините за предоставленные неудобства :(</p>
    </div>
}