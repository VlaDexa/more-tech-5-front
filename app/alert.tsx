"use client";

import { useCallback, useRef, useState } from "react";

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

    const opaque = { opacity: "0" };
    const shown = { opacity: "1" };
    const animTime: KeyframeAnimationOptions = {
        duration: 500,
        iterations: 1,
        fill: "forwards"
    };
    const timeShown = 5;

    window.addEventListener("more:dollar-alert", () => {
        setShown(true);
        renewTimer(setTimeout(() => {
            if (alert.current)
                alert.current.animate([shown, opaque], animTime).onfinish = () => setShown(false)
            else
                setShown(false);
        }, timeShown * 1000));
        if (!alert.current) return;
        alert.current.animate([
            opaque,
            shown,
        ], animTime);
    });

    return <div
        ref={alert}
        className={`border-2 rounded-[20px] border-[#CA181F] bg-white py-[30px] px-[18px] flex flex-col gap-5 ${show ? undefined : 'hidden'} ${props.className}`}
        aria-hidden={!show}
        aria-live="assertive"
    >
        <h1>К сожалению, фильтр сейчас недоступен.</h1>
        <p>Сейчас все операции с валютой приостановлены. Извините за предоставленные неудобства :(</p>
    </div>
}