export type WeekScheduleRes = {
    result: {
        endDate: number;
        startDate: number;
    }
}

export type cfgDataType = {
    id: string;
    only: boolean
}

export type clubDataType = {
    "id": string;
    "clubNetId": string;
    "name": string;
    "phones": string[];
    "webSite": string;
    "actualScheduleDate": string;
    "description": string;
    address: string
}
