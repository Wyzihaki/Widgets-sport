"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {clubDataType} from "@/utils/types";
import {getWeekTime} from "@/utils/funcs";
import {widgetCfgData} from "@/config";
import {useMutation} from "@tanstack/react-query";
import {classType, reqBodyData} from "@/app/api/route";

import {aboutDayType} from "@/app/_components/gallery/WeekSlider";
import axios, {AxiosResponse} from "axios";
import {start} from "repl";
import Link from "next/link";
import {Dialog} from "primereact/dialog";

const Cabinet = ({clubs}: {clubs: clubDataType[]}) => {
    const weekTimePeriod = 1000 * 3600 * 24 * 7
    const [startTime,setStartTime] = useState<number>(Date.now());
    const [endTime, setEndTime] = useState<number>(Date.now() + weekTimePeriod);
    const [days, setDays] = useState<
        aboutDayType[] | null>(null)
    const [classes, setClasses] = useState<classType[]>([])

    useEffect(() => {
        let days = getWeekTime(startTime, startTime + weekTimePeriod, "long" )
        setDays(days)
        setStartTime(days[0].millsTime)
        mutate({
            start: days[0].millsTime,
            end: days[0].millsTime + 1000 * 3600 * 24 * 7,
            clubs: clubs,
            city: widgetCfgData.city.id
        })
    }, [])

    useEffect(() => {
        let days = getWeekTime(startTime, startTime, "long" )
        setDays(days)
    }, [startTime])


    const {mutate} = useMutation({
        mutationFn: (data: reqBodyData) => {
            return axios.post<any, AxiosResponse<{data: classType[] }, any>>("http://localhost:3000/api", data)
        },
        onSuccess: data1 => setClasses(data1.data.data)
    })
    console.log(classes)
    return (
        <div className='flex bg-[#101113] h-auto'>
            <div className='bg-[#101113] w-full px-5'>
                <div className='max-w-4xl w-full mx-auto my-0 flex items-center justify-between py-2'>
                    <div onClick={() => {
                        let st = startTime - 1000 * 3600 * 24
                        setStartTime(st)
                        mutate({
                            start: st,
                            end: st + 1000 * 3600 * 24 * 7,
                            clubs: clubs,
                            city: widgetCfgData.city.id
                        })
                    }}>
                        <Image src='/arrow-left.svg' alt='arl' width={35} height={35}/>
                    </div>
                    <div className='text-white'>
                        Афиша
                    </div>
                    <div onClick={() => {
                        let st = startTime + 1000 * 3600 * 24
                        setStartTime(st)
                        mutate({
                            start: st,
                            end: st + 1000 * 3600 * 24 * 7,
                            clubs: clubs,
                            city: widgetCfgData.city.id
                        })
                    }}>
                        <Image src='/arrow-right.svg' alt='arr' width={35} height={35}/>
                    </div>
                </div>
                <div className='max-w-4xl w-full mx-auto my-0 flex items-center justify-center text-white'>{days ? `${days[0].day} ${days[0].month} - ${days[0].dayOfWeek}` : ''}</div>
                <div className='grid grid-cols-3 gap-10 mt-10 bg-[#101113]'>
                    {
                        classes.map(el => (
                            <div className='bg-[#252729] rounded-lg h-[440px]'>
                                <div
                                    className='w-full h-[55%] rounded-lg '
                                    style={{
                                        backgroundColor: el.course.color
                                    }}
                                ></div>
                                <div className='pl-5 flex flex-col gap-y-1 mt-2'>
                                    <div className='text-white'>{el.course.name}</div>
                                    <div className='text-[#44444A]' >{el.group.name}</div>
                                    {
                                        el.coach?.name &&  <div className='text-white'>Тренер: {el.coach?.name}</div>
                                    }
                                    <div className='text-[#444F5B]'>{clubs[0].address}</div>
                                    <div className='text-[#444F5B]'>Начало в {el.startTime}</div>
                                    <div className='text-[#822940] cursor-pointer'>
                                        <Link href={`class/${el.id}`} onClick={() => {
                                            window.parent.postMessage({action: 'widget-modal-open', route: `http://localhost:3000/class/${el.id}`}, "*");
                                        }}>Подробнее</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Cabinet;
