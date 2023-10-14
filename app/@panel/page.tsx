"use client";
import { HTMLAttributes, useState } from "react"
import Image from "next/image";
import Pin from "../../public/pin.svg";
import Search from "../../public/search.svg";
import Dots from "../../public/dots.svg";
import Button, { Type } from "../button";

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

function More() {
    return <button className="rounded-[10px] px-[23px] py-[10px] bg-vtb-gray text-[#6C6C6C] flex flex-row border-2 border-vtb-gray gap-1">
        <span>Больше</span>
        <Image src={Dots} alt=""></Image>
    </button>
}

export default function Panel() {
    type ToBools<Type> = { -readonly [Property in keyof Type]: boolean };
    const shows = ["Отделения", "Банкоматы"] as const;
    const [showsFlags, setShows] = useState(shows.map((_, i) => i === 0) as unknown as ToBools<typeof shows>);
    const statuses = ["Физическое лицо", "Прайм", "Юридическое лицо", "Привелегия"] as const;
    const [statusesFlags, setStatuses] = useState(statuses.map((_, i) => i === 0) as unknown as ToBools<typeof statuses>);
    const cards = ["Кредитная карта", "Дебетовая карта"] as const;
    const [cardsFlags, setCards] = useState(cards.map((_, i) => i === 0) as unknown as ToBools<typeof cards>);
    const transes = ["Рубли", "Доллары"] as const;
    const [transesFlags, setTranses] = useState(transes.map((_, i) => i === 0) as unknown as ToBools<typeof transes>);
    const credits = ["Консультация", "Оформление, выдача"] as const;
    const [creditsFlags, setCredits] = useState(credits.map((_, i) => i === 0) as unknown as ToBools<typeof credits>);

    return <section className="px-[18px] py-[30px] w-1/3 absolute z-[200] bg-white rounded-[20px] top-[40px] left-[48px]" aria-label="Фильтры">
        <SearchBar></SearchBar>
        <ul className="mt-5 sidebar-selects">
            <li>
                <h2>Показать</h2>
                <ul>
                    {shows.map((el, i) => <li key={el}>
                        <Button styleType={showsFlags[i] ? Type.Active : Type.Unactive}
                            onClick={() => {
                                setShows((old) => {
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
                        <More />
                    </li>
                </ul>
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
                        <More />
                    </li>
                </ul>
            </li>
        </ul>
    </section>
}