"use client";
import { HTMLAttributes, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image";
import Pin from "../../public/pin.svg";
import Search from "../../public/search.svg";
import Dots from "../../public/dots.svg";
import Switch from "../../public/switch.svg";
import Button, { Type } from "../button";
import Checkbox from "../checkbox";
import { VTB_Font } from "../vtb_font";
import { AtmShowWithDistance, AtmsService, SalepointService, SalepointShow, SalepointShowWithDistance } from "@/openapi";
import Office, { Type as OfficeType } from "../office";

function SearchBar(props: HTMLAttributes<HTMLInputElement> & { onSubmit?: HTMLAttributes<HTMLFormElement>["onSubmit"] }) {
    return <form onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        props.onSubmit && props.onSubmit(event);
    }} className="px-[10px] py-1 gap-1 flex flex-row rounded-[10px] bg-vtb-gray">
        <Image src={Pin} alt=""></Image>
        <input {...props} name="Address" className="flex-grow bg-vtb-gray" placeholder="Город, район, улица,..."></input>
        <button type="submit" className="ml-[10px]" aria-label="Поиск">
            <Image src={Search} alt=""></Image>
        </button>
    </form>
}

function More(props: { text: string }) {
    return <button className="rounded-[10px] px-[23px] py-1 bg-vtb-gray text-[#474747] flex flex-row border-2 border-vtb-gray gap-1">
        <span>{props.text}</span>
        <Image src={Dots} alt=""></Image>
    </button>
}

export default function Panel() {
    type ToBools<Type> = { -readonly [Property in keyof Type]: boolean };
    const shows = ["Отделения", "Банкоматы"] as const;
    const [showsFlags, setShows] = useState(shows.map((_, i) => i === 0) as unknown as ToBools<typeof shows>);
    const statuses = ["Физическое лицо", "Прайм", "Юридическое лицо", "Привелегия"] as const;
    const [statusesFlags, setStatuses] = useState(statuses.map(() => false) as unknown as ToBools<typeof statuses>);
    const cards = ["Кредитная карта", "Дебетовая карта"] as const;
    const [cardsFlags, setCards] = useState(cards.map(() => false) as unknown as ToBools<typeof cards>);
    const transes = ["Рубли", "Доллары"] as const;
    const [transesFlags, setTranses] = useState(transes.map(() => false) as unknown as ToBools<typeof transes>);
    const credits = ["Консультация", "Оформление, выдача"] as const;
    const [creditsFlags, setCredits] = useState(credits.map(() => false) as unknown as ToBools<typeof credits>);
    const [lowMobility, setLowMobility] = useState(false);

    const workTimes = ["Работает сейчас", "Круглосуточно"] as const;
    const [workFlags, setWorkTimes] = useState(workTimes.map(() => false) as unknown as ToBools<typeof workTimes>);
    const extras = ["Поддержка NFC (бесконтактное обслуживание)", "Снятие наличных по QR-коду", "Платежи по QR-коду", "Оборудован для слабовидящих", "Доступность для маломобильных граждан"] as const;
    const [extraFlags, setExtraFlags] = useState(extras.map(() => false) as unknown as ToBools<typeof extras>);

    const alertEvent: Event = useMemo(() => new Event("more:dollar-alert"), []);
    const showAlert = useCallback(() => window.dispatchEvent(alertEvent), [alertEvent]);


    const [offices, setOffices] = useState<SalepointShowWithDistance[] | undefined>(undefined);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (suc) => {
            const sales = await fetch("http://api.lapki.vladexa.ru:8000/api/v1/salepoint/distance", {
                "body": JSON.stringify([suc.coords.longitude, suc.coords.latitude]),
                "headers": {
                    "content-type": "application/json"
                },
                "method": "POST",
            });
            const salesJ = await sales.json();
            // const salesJ = await SalepointService.findClosestOfficesApiV1SalepointDistancePost([suc.coords.longitude, suc.coords.latitude]);
            setOffices(salesJ);
        }, () => { });
    }, []);
    const [atms, setAtms] = useState<AtmShowWithDistance[] | undefined>(undefined);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async suc => {

            const req = await fetch("http://api.lapki.vladexa.ru:8000/api/v1/atms/distance", {
                "body": JSON.stringify([suc.coords.longitude, suc.coords.latitude]),
                "headers": {
                    "content-type": "application/json"
                },
                "method": "POST",
            });
            const atm = await req.json();
            // const atm = await AtmsService.findClosestAtmsApiV1AtmsDistancePost([suc.coords.longitude, suc.coords.latitude])
            setAtms(atm)
        }, () => { })
    }, [])

    console.log('atms - ' , atms);
    console.log('offices - ', offices)

    return <search className="px-[18px] py-[30px] w-1/4 absolute z-[200] bg-white rounded-[20px] top-[40px] left-[48px] overflow-y-scroll mb-10 h-[90%]" aria-label="Фильтры">
        <SearchBar></SearchBar>
        <ul className="mt-5 sidebar-selects">
            <li>
                <h2>Показать</h2>
                <ul>
                    {shows.map((el, i) => <li key={el}>
                        <Button styleType={showsFlags[i] ? Type.Active : Type.Unactive}
                            onClick={() => {
                                const change = () => setShows((old) => {
                                    old[(i + 1) % 2] = false;
                                    old[i] = true;
                                    return [...old];
                                });

                                if (!document.startViewTransition) {
                                    change();
                                    return;
                                }

                                document.startViewTransition(change)
                            }}
                        >
                            {el}
                        </Button>
                    </li>)}
                </ul>
            </li>
        </ul>
        <details className={`marker:text-vtb-blue ${VTB_Font.className} mt-4`}>
            <summary>Фильтры</summary>

            {
                showsFlags[0] ?
                    <ul className="sidebar-selects">
                        <li>
                            <h2>Ваш статус</h2>
                            <ul>
                                {statuses.map((el, i) => <li key={el}>
                                    <Button styleType={statusesFlags[i] ? Type.Active : Type.Unactive}
                                        onClick={() => {
                                            setStatuses((old) => {
                                                old[i] = !old[i];
                                                return [...old];
                                            })
                                        }}
                                    >
                                        {el}
                                    </Button>
                                </li>)}
                            </ul>
                        </li>
                        <li>
                            <h2>Перечень услуг</h2>
                            <ul className="extra-select">
                                <li>
                                    <h3>Обслуживание карт</h3>
                                    <ul>
                                        {cards.map((el, i) => <li key={el}>
                                            <Button styleType={cardsFlags[i] ? Type.Active : Type.Unactive}
                                                onClick={() => {
                                                    setCards((old) => {
                                                        old[i] = !old[i];
                                                        return [...old];
                                                    })
                                                }}
                                            >
                                                {el}
                                            </Button>
                                        </li>)}
                                    </ul>
                                </li>
                                <li>
                                    <h3>Переводы</h3>
                                    <ul>
                                        {
                                            transes.map((el, i) => <li key={el}>
                                                <Button styleType={transesFlags[i] ? Type.Active : Type.Unactive}
                                                    onClick={() => {
                                                        setTranses((old) => {
                                                            old[i] = !old[i];
                                                            return [...old];
                                                        })
                                                    }}
                                                >
                                                    {el}
                                                </Button>
                                            </li>)
                                        }
                                        <li>
                                            <More text="Больше" />
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h3>Ипотечные кредиты</h3>
                                    <ul>
                                        {
                                            credits.map((el, i) =>
                                                <li key={el}>
                                                    <Button styleType={creditsFlags[i] ? Type.Active : Type.Unactive}
                                                        onClick={() => {
                                                            setCredits((old) => {
                                                                old[i] = !old[i];
                                                                return [...old];
                                                            })
                                                        }}
                                                    >
                                                        {el}
                                                    </Button>
                                                </li>
                                            )
                                        }
                                        <li>
                                            <More text="Больше" />
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="underline text-[#6C6C6C]">Другие услуги</span>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Дополнительная информация</h2>
                            <fieldset>
                                <label className="flex flex-row text-xl gap-[18px]">
                                    <span>
                                        Доступность для маломобильных граждан
                                    </span>
                                    <Checkbox onChange={(el) => setLowMobility(el.currentTarget.checked)} />
                                </label>
                            </fieldset>
                        </li>
                    </ul>
                    : <ul className="sidebar-selects">
                        <li>
                            <h2>Операции</h2>
                            <ul className="extra-select">
                                <li>
                                    <h3>Снять</h3>
                                    <ul>
                                        <li>
                                            <Button styleType={Type.Active}>Рубли</Button>
                                        </li>
                                        <li>
                                            <Button styleType={Type.Disabled} onClick={showAlert}>Доллары</Button>
                                        </li>
                                        <li>
                                            <More text="Валюта"></More>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h3>Внести</h3>
                                    <ul>
                                        <li>
                                            <Button styleType={Type.Active}>Рубли</Button>
                                        </li>
                                        <li>
                                            <Button styleType={Type.Disabled} onClick={showAlert}>Доллары</Button>
                                        </li>
                                        <li>
                                            <More text="Валюта"></More>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>Перечень услуг</h2>
                            <ul className="extra-select">
                                <li>
                                    <h3>Переводы</h3>
                                    <ul>
                                        <li>
                                            <Button styleType={Type.Active}>Рубли</Button>
                                        </li>
                                        <li>
                                            <Button styleType={Type.Disabled} onClick={showAlert}>Доллары</Button>
                                        </li>
                                        <li>
                                            <More text="Валюта"></More>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h3>Обмен валюты</h3>
                                    <ul>
                                        <li>
                                            <Button styleType={Type.Disabled} onClick={showAlert}>Рубли</Button>
                                        </li>
                                        <li>
                                            <Image src={Switch} alt=""></Image>
                                        </li>
                                        <li>
                                            <Button styleType={Type.Disabled} onClick={showAlert}>Доллары</Button>
                                        </li>
                                        <li>
                                            <More text="Валюта"></More>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="underline text-[#6C6C6C]">Другие услуги</span>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h2>
                                Время работы
                            </h2>
                            <fieldset className="flex flex-col gap-[10px]">
                                {workTimes.map((el, i) => <label key={el} className="flex flex-row text-xl gap-[18px]">
                                    <span className="flex-grow">{el}</span>
                                    <Checkbox onChange={() => setWorkTimes((old) => {
                                        old[i] = !old[i]
                                        return [...old];
                                    })}></Checkbox>
                                </label>)}
                            </fieldset>
                            <h2>
                                Дополнительная информация
                            </h2>
                            <fieldset className="flex flex-col gap-[10px]">
                                {extras.map((el, i) => <label key={el} className="flex flex-row text-xl gap-[18px]">
                                    <span className="flex-grow">{el}</span>
                                    <Checkbox onChange={() => setExtraFlags((old) => {
                                        old[i] = !old[i]
                                        return [...old];
                                    })}></Checkbox>
                                </label>)}
                            </fieldset>
                        </li>
                    </ul>
            }
        </details>
        {(showsFlags[0] && offices) || (showsFlags[1] && atms) ? <>
            <h2 className="mt-[30px] text-[#6C6C6C] text-normal">Ближайшие {showsFlags[0] ? "отделения" : "банкоматы"}</h2>
            <ul className="flex flex-col gap-[18px] mt-[22px]">
                {(showsFlags[0] ? offices! : atms!).map(el => <Office key={el.id} id={el.id} type={showsFlags[0] ? OfficeType.Office : OfficeType.Atm} distance={el.distance_to_you * 1482} />)}
            </ul>
        </>
            : <></>}
    </search >
}