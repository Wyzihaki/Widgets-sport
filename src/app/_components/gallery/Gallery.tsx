import React from 'react';
import WeekSlider from "@/app/_components/gallery/WeekSlider";
import {clubDataType} from "@/utils/types";

const Gallery = async ({data}: {data: clubDataType[]}) => {
    return (
        <div>
            <WeekSlider data={data} lengthDate='short'/>
        </div>
    );
};

export default Gallery;
