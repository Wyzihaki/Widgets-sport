import React, {useState} from 'react';

const DayItem = ({day, dayOfWeek}: {day: number, dayOfWeek: string}) => {
    const [clicked, setClicked] = useState(false)
    return (
        <div>
            <div
                className={`${clicked ? 'text-white' : ''} rounded-2xl ${clicked ? 'bg-[#1F529B]' : ''} flex items-center justify-center flex-col w-9 h-14`}
                onClick={() => setClicked(!clicked)}
            >
                <div>{dayOfWeek}</div>
                <div>{day}</div>
            </div>
        </div>
    );
};

export default DayItem;
