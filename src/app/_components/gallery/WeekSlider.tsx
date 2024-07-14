"use client"
import React, {FC, useEffect, useState} from 'react';
import { Navigation} from 'swiper/modules';
import { Swiper, SwiperSlide  } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {getWeekTime} from "@/utils/funcs";
import {clubDataType} from "@/utils/types";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios, {AxiosResponse} from "axios";
import {classType, reqBodyData} from "@/app/api/route";
import {widgetCfgData} from "@/config";
import Link from "next/link";
import {useRouter} from "next/navigation";

type weekSliderProps = {
    data: clubDataType[];
    lengthDate?: "long" | "short" | "narrow" | undefined;
}

export type aboutDayType = {
    day: number,
    dayOfWeek: string,
    month: string,
    millsTime: number
}


const getTimeClass = (start: string, duration: number) => {
    let partOdTime = start.split(':');
    let hours = parseInt(partOdTime[0]);
    let minutes = parseInt(partOdTime[1]);

    let summaMinutes = hours * 60 + minutes + duration

    return `${start} - ${(summaMinutes / 60 | 0) < 10 ? '0' : ''}${summaMinutes / 60 | 0}:${summaMinutes % 60 === 0 ? '00' : summaMinutes % 60 }`

}

const WeekSlider: FC<weekSliderProps> = ({data, lengthDate}) => {
    const router = useRouter()
    const weekTimePeriod = 1000 * 3600 * 24 * 7

    const [startTime,] = useState<number>(Date.now());
    const [endTime, setEndTime] = useState<number>(Date.now() + weekTimePeriod);
    const [maxSlide, setMaxSlide] = useState<number>(0);
    const [days, setDays] = useState<
        aboutDayType[] | null>(null)
    const [active, setActive] = useState(0);
    const [classes, setClasses] = useState<classType[]>([])

    useEffect(() => {
        let days = getWeekTime(startTime, startTime + weekTimePeriod, lengthDate )
        setDays(days)
        mutate({
            start: days[0].millsTime,
            end: days[0].millsTime + 1000 * 3600 * 24 * 7,
            clubs: data,
            city: widgetCfgData.city.id
        })
    }, [])

    const {mutate} = useMutation({
        mutationFn: (data: reqBodyData) => {
            return axios.post<any, AxiosResponse<{data: classType[] }, any>>("http://localhost:3000/api", data)
        },
        onSuccess: data1 => setClasses(data1.data.data)
    })

    return (
        <div className='max-w-5xl w-full mx-auto my-0 px-5'>
            <h1 className='font-bold text-2xl mt-6'>Афиша на дату: <span className='text-green-500'>{days ? `${days[active]?.month} ${days[active]?.day}` : '' }</span></h1>
            <div className='my-8'>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={7}
                    onNavigationNext={(swiper) => {
                        if(swiper.activeIndex > maxSlide) {
                            let end = endTime + 1000 * 3600 * 24;
                            setEndTime(end)

                            let day = getWeekTime(end, end, lengthDate )
                            days?.push(...day)
                            setDays(days)
                            setMaxSlide(swiper.activeIndex)
                        }
                    }}
                    onSwiper={(swiper) => console.log(swiper)}
                    modules={[Navigation]}
                    navigation
                    style={{
                        // @ts-ignore
                        "--swiper-navigation-size": "20px",
                    }}
                >
                    {
                        days?.map((el, ind) => (
                            <SwiperSlide>
                                <div
                                    className={`${active === ind  ? 'text-white' : ''} rounded-2xl ${active === ind ? 'bg-[#1F529B]' : ''} flex items-center justify-center flex-col w-9 h-14`}
                                    onClick={() => {
                                        setActive(ind);
                                        mutate({
                                            start: el.millsTime,
                                            end: el.millsTime + 1000 * 3600 * 24 * 7,
                                            clubs: data,
                                            city: widgetCfgData.city.id
                                        })
                                    }}
                                >
                                    <div>{el.dayOfWeek}</div>
                                    <div>{el.day}</div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            <Swiper
                slidesPerView={4}
                modules={[Navigation]}
                navigation
                style={{
                    // @ts-ignore
                    "--swiper-navigation-size": "20px",
                }}
            >
                {
                    classes?.map((el, ind) => (
                        <SwiperSlide>
                            <div
                                className='min-h-[300px] h-full w-[200px] rounded-tl-3xl rounded-xl relative'
                                style={{
                                    backgroundColor: el.course.color
                                }}
                            >
                                <div className='absolute w-9/12 h-8 bg-white rounded-tl-xl rounded-bl-none rounded-tr-none rounded-2xl text-center truncate'>
                                    {el.group ? el.group?.name : el.course.name}
                                </div>
                                <div className='my-10 flex flex-col items-center h-full' >
                                    <div className='mt-12 text-center text-white font-bold'>
                                        {
                                            getTimeClass(el.startTime, el.duration)
                                        }
                                    </div>
                                    <div className='bg-white text-black font-bold p-1 rounded-xl mt-20'>
                                       <Link href={`class/${el.id}`} onClick={() => {
                                           window.parent.postMessage(['widget-modal-open', `http://localhost:3000/class/${el.id}`], "*");
                                       }}>Подробнее</Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};

export default WeekSlider;
