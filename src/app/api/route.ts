import {clubDataType} from "@/utils/types";
import {widgetCfgData} from "@/config";
import {getApi} from "@/utils/funcs";
import {NextRequest} from "next/server";

export type reqBodyData = {
    clubs: clubDataType[],
    start: number,
    end: number,
    city: string
}


export type classType = {
    "id": string,
    "entityStatus": string,
    "startDate": string,
    "startTime": string,
    "duration": number,
    "course": {
        "color": string,
        "name": string
    },
    coach: {
        color: string,
        name: string
    },
    group: {
        name: string
    },

}

export async function POST(req: NextRequest) {
    const results = await new Promise(async (resolve, reject) => {
        const body: reqBodyData  = await req.json()

        let arr:classType[] = [];
        let cnt = 0;

        await Promise.all(body.clubs.map(el => {
            doRequest(
                body.start,
                body.end,
                body.city,
                el.id,
                el.clubNetId,
            )
        }))


        function doRequest(
            start: number,
            end: number,
            city: string,
            clubId: string,
            netId: string
        ){
            getApi<{classes: classType[]}>("https://sportpriorityapi.ud4.ru/v1/cities/{cityUrlName}/nets/{clubNetId}/clubs/{clubId}/schedule?baseDate={baseDate}&toDate={toDate}", {
                cityUrlName: city,
                clubNetId: netId,
                clubId: clubId,
                baseDate: new Date(start).toLocaleString().slice(0, 10),
                toDate: new Date(end).toLocaleString().slice(0, 10)
            }).then(res => {
                arr.push(...res.classes.filter(el =>
                    el.startDate === new Date(start).toLocaleString().slice(0, 10) && el.id !== "00000000000000000000000000000000"
                ))
                cnt++

                if(cnt === body.clubs.length)
                    resolve(arr)
            })
        }
    });

    return Response.json({data: results})
}
