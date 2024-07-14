import {cfgDataType, clubDataType} from "@/utils/types";
import {aboutDayType} from "@/app/_components/gallery/WeekSlider";
import {widgetCfgData} from "@/config";

export const postApi = <T,>(url: string, data: {[key: string]: any}): Promise<T> => {
    return fetch(url, {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log('error with postApi')
            }
            return response.json() as Promise<T>
        })
}

export const getApi = <T,>(url: string, query: {[key: string]: string | number}): Promise<T> => {

    let url2 = url
    Object.keys(query).forEach(key => {
        url2 = url2.replace(`{${key}}`, query[key].toString())
    })

    return fetch(url2,{
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            console.log(response.statusText)
        }
        return response.json() as Promise<T>
    })
}

export const getWeekTime = (start: number, end: number, lengthDate: "long" | "short" | "narrow" | undefined): aboutDayType[] => {
    let returnArr: aboutDayType[] = [];
    let millsForOneDay = 1000 * 60 * 60 * 24
    let locale = "ru-ru";


    while (start <= end) {
        let date = new Date(start)
        let m = date.toLocaleString(locale, {month: lengthDate})

        let m2 = m.split('')
        m2[m2.length - 1] = 'я'
        let m3 = m2.join('')

        returnArr.push({
            day: date.getDate(),
            dayOfWeek: date.toLocaleString(locale, {weekday: lengthDate}),
            month: m3,
            millsTime: start
        })
        start += millsForOneDay
    }
    return returnArr
}

export const weekData = async (city: cfgDataType, net: cfgDataType, club: cfgDataType) => {
    const returnObj = {
        data: [] as clubDataType[],
        error: {
            state: false,
            info: ''
        }
    }
    switch (true) {
        case city.only: {
            const data = await getApi<{clubs: clubDataType[]}>("https://sportpriorityapi.ud4.ru/v1/cities/{cityUrlName}/clubs", {
                cityUrlName: city.id
            })
            returnObj.data  = data.clubs
            break;
        }
        case net.only: {
            if(!city.id) {
                returnObj.error.state = true;
                returnObj.error.info = "Необходимо указать навазние города в конфиге виджета"
                break;
            }

            const data = await getApi<{clubs: clubDataType[]}>("https://sportpriorityapi.ud4.ru/v1/cities/{cityUrlName}/nets/{clubNetId}/clubs", {
                cityUrlName: city.id,
                clubNetId: net.id
            })

            returnObj.data  = data.clubs
            break;
        }
        case (club.only || widgetCfgData.isApp): {
            if(!city.id) {
                returnObj.error.state = true;
                returnObj.error.info = "Необходимо указать навазние города в конфиге виджета"
                break;
            }

            const clubsCity = await getApi<{clubs: clubDataType[]}>("https://sportpriorityapi.ud4.ru/v1/cities/{cityUrlName}/clubs", {
                cityUrlName: city.id
            })

            returnObj.data  = clubsCity.clubs.filter((el) => el.id === club.id)
        }
    }
    return returnObj;
}


