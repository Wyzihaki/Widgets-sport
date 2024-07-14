import React from 'react';
import {postApi} from "@/utils/funcs";
import ClassInfo, {classAboutType} from "@/app/_components/ClassInfo";


const Page = async ({params: { id },}: { params: { id: string } }) => {

    const data = await postApi<{result: classAboutType}>("https://sportpriorityapi.ud4.ru/v2/wg/schedule-getClass", {
        classId: id
    })
    return (
       <div>
           <ClassInfo
               room={data.result?.room}
               startTime={data.result?.startTime}
               course={data.result?.course}
               subscription={data.result?.subscription}
               id={data.result?.id}
               duration={data.result?.duration}
           />
       </div>
    );
};

export default Page;
