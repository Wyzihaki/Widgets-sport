'use client'

import React, {FC, JSXElementConstructor, ReactElement, useEffect, useReducer, useState} from 'react';
import {getWeekTime} from "@/utils/funcs";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Input} from "@nextui-org/input";
import {Button, Checkbox} from "@nextui-org/react";
import emailjs from '@emailjs/browser';
import {EmailParams, MailerSend, Recipient, Sender} from "mailersend";
import {render} from "@react-email/render";
import EmailTemplate from "@/app/_components/Email";
import {sendEmail} from "@/app/actions";

export type variantType = {
    "visitCount": number,
    "duration": number,
    "durationUnit": "month" | "day",
    "price": number,
    "priceOnSaleCampain": number,
    "name": string,
    id: string
}

export type subsType = {
    "description": ""
    "variants": variantType[],
}


export type classAboutType = {
    room: {
        name: string
    }
    startTime: number,
    course: {
        "description": string
        name: string
    },
    subscription: subsType[],
    id: string,
    duration: number
}

const enum InputDataActions {
    UPDATE_CODE = "UPDATE_CODE",
    UPDATE_MAIL = "UPDATE_MAIL",
    UPDATE_CITY = "UPDATE_CITY"
}

export interface SearchAction {
    type: `${InputDataActions}`;
    payload: {
        value: string
    };
}

const ClassInfo: FC<classAboutType> = (
    {
        room,
        subscription,
        startTime,
        course,
        id,
        duration
    }) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter()
    const [carts, setCart] = useState<Partial<variantType & {count: number}>[]>([])

    const initialState = { code: '', mail: '', city: ''}

    const addCart = (cart: Partial<variantType & {count: number}>) => {
        let ind = carts.findIndex(el => el.id === cart.id)
        console.log(ind, cart.id, carts)
        if(ind !== -1)
        {
            carts[ind] = {
                ...carts[ind],
                count: (carts[ind].count || 0) + 1

            }
        }
        else {
            carts.push({
                name: cart.name,
                price: cart.price,
                count: 1,
                id: cart.id
            })
        }

        setCart(carts)
    }

    useEffect(() => {
        setCart(carts)
    }, [carts])

    const plusOneCart = (cart: Partial<variantType & {count: number}>) => {
        let ind = carts.findIndex(el => el.id === cart.id)
        carts[ind] = {
            ...carts[ind],
            count: (carts[ind].count || 0) + 1
        }

    }

    const minusOneCart = (cart: Partial<variantType & {count: number}>) => {
        let ind = carts.findIndex(el => el.id === cart.id)
        carts[ind] = {
            ...carts[ind],
            count: (carts[ind].count || 0) - 1

        }
    }

    function reducer(state = initialState, action: SearchAction) {
        switch (action.type) {
            case "UPDATE_CODE": {
                return {
                    ...state,
                    code: action.payload.value
                };
            }
            case "UPDATE_CITY": {
                return {
                    ...state,
                    city: action.payload.value
                };
            }
            case "UPDATE_MAIL": {
                return {
                    ...state,
                    mail: action.payload.value
                };
            }
            default: {
                throw Error('Unknown action.');
            }
        }
    }

    const [inputData, dispatch] = useReducer(reducer, initialState);


    const getResultSumma = (data: Partial<variantType & {count: number}>[]) => {
        return data.reduce((acc, el) =>
            acc + (el.count && el.price ? el.count * el.price : 0), 0
        )
    }

    let arr: variantType[] = [];
    subscription.map(el => arr.push(...el.variants))
    let date = getWeekTime(startTime, startTime, "long")

    function handleSubmit(email: string, message: string) {
        fetch(`/api/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                message: message,
            })
        })
            .then(r => r.json())
            .then(d => {
                if (d?.ok) {
                    console.log('tue')
                }
            })
            .catch(e => console.log(e.message))
    }

    return (
        <div className='flex flex-col items-center justify-center relative'>
            <div className='max-w-3xl py-2 flex items-center gap-x-40'>
                <div onClick={() => router.back()} className='cursor-pointer'>Закрыть окно</div>
                <div className='text-[#D04563] text-xl font-bold'>Подробнее о мероприятии</div>
            </div>
            <div className='w-full h-full bg-[#E5E8F1] flex flex-col items-center pt-3'>
                <div className='max-w-3xl'>
                    {room && <div>{room?.name}</div>}
                    <div className='font-bold text-xl'>{course.name}</div>
                    <div className='text-[#97989B] my-2'>Дата начала: {date[0].day} {date[0].month}</div>
                    <div className='text-[#97989B] my-2'>Продолжительность занятия: {duration} минут</div>
                    <div
                        className='bg-white py-7 px-4 rounded-xl text-[#96969F] font-semibold mt-6'
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                    <div className='mt-14'>
                        {
                            arr.map(el => (
                                <div className='flex items-center justify-between bg-[#DADEED] px-5 py-6 rounded-xl mb-3'>
                                    <div>{el.name} - {el.price}</div>
                                    <Button onClick={() => addCart(el)} color="secondary">В корзину</Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div>Cсылка для копирования - {`http://localhost:3000/class/${id}`}</div>
            </div>
            <div onClick={onOpen}>
                <div className='absolute top-20 right-20 bg-white p-4 rounded-[100%] cursor-pointer'>
                    <Image src='/cart.svg' alt='cart' width={50} height={50}/>
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='3xl' scrollBehavior='inside'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl">Корзина</ModalHeader>
                            <ModalBody>
                                <div className='font-semibold'>
                                    <div className='font-light'>
                                        Дата посещения: <span className='font-bold'>{new Date(Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <div className='border-[##e3e3e3] border-b-[1px] border-solid'>
                                        {
                                            carts.map((el, ind) => (
                                                <div className='flex items-center mt-2 mb-5 text-lg'>
                                                    <div className='text-[#95c11c]'>
                                                        {ind + 1}
                                                    </div>
                                                    <div className='ml-3'>{el.name}</div>
                                                    <div className='ml-6'>
                                                        {`${el.count} * ${el.price}Р`}
                                                    </div>
                                                    <div className='mx-10 flex items-center justify-center relative border-[#e3e3e3] border-solid border-[1px] rounded-lg py-[10px] px-5 w-20'>
                                                        <button
                                                            type='button'
                                                            className='w-7 h-7 bg-[#5fac2a] flex items-center justify-center rounded-full absolute -left-3'
                                                            onClick={() => minusOneCart(el)}
                                                        >
                                                            <Image src='/minus.svg' alt='minus' width={15} height={15}></Image>
                                                        </button>
                                                        <div>
                                                            {el.count}
                                                        </div>
                                                        <button
                                                            type='button'
                                                            className='w-7 h-7 bg-[#5fac2a] flex items-center justify-center rounded-full absolute -right-3'
                                                            onClick={() => plusOneCart(el)}
                                                        >
                                                            <Image src='/plus.svg' alt='minus' width={15} height={15}></Image>
                                                        </button>
                                                    </div>
                                                    <div className='ml-6'>
                                                        {`${el.count && el.price ? el.count * el.price : 0}Р`}
                                                    </div>
                                                    <Image src='/cross.svg' alt='/cross.svg' width={28} height={28} className='ml-10'/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='mt-10'>
                                        <div className='flex items-center justify-start w-full mb-14'>
                                            <Input
                                                value={inputData.code}
                                                placeholder="ПРОМОКОД"
                                                onChange={(e) => dispatch({
                                                    type: "UPDATE_CODE",
                                                    payload: {
                                                        value: e.target.value
                                                    }
                                                })}
                                                size='lg'
                                                className='max-w-48'
                                            />
                                            <Button color='primary' className='font-bold mx-10' size='lg'>Применить</Button>
                                            <div className='flex items-center justify-between text-xl w-[50%]'>
                                               <span>
                                                   Итого:
                                               </span>
                                                <span>
                                                    {getResultSumma(carts)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="mail" className='text-lg'>Укажите email для получения билетов</label>
                                            <Input
                                                id="mail"
                                                placeholder='Еmail'
                                                aria-describedby="mail-help"
                                                value={inputData.mail}
                                                onChange={(e) => dispatch({
                                                    type: "UPDATE_MAIL",
                                                    payload: {
                                                        value: e.target.value
                                                    }
                                                })}
                                                size='lg'
                                                className='mt-2 mb-4'
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className='text-lg'>Основной город проживания</label>
                                            <Input
                                                id="city"
                                                placeholder='Город'
                                                aria-describedby="mail-city"
                                                value={inputData.city}
                                                onChange={(e) => dispatch({
                                                    type: "UPDATE_CITY",
                                                    payload: {
                                                        value: e.target.value
                                                    }
                                                })}
                                                size='lg'
                                                className='mt-2'
                                            />
                                        </div>
                                        <Button
                                            color='primary'
                                            className='w-full my-5 font-bold'
                                            size={'lg'}
                                            onClick={() => {
                                                handleSubmit(inputData.mail, 'Спасибо что купили билеты, через виджет Sport Priority, с перечнем билетов, вы можете ознакомиться на сайте нашего сервиса')
                                            }}
                                        >
                                            Перейти к оплате
                                        </Button>
                                        <Checkbox defaultSelected size="lg">
                                            Я даю согласие на обработку персональных данных, соглашаюсь с
                                            <span className='underline-offset-1'>политикой конфеденциальности</span>
                                        </Checkbox>

                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ClassInfo;
