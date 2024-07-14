import * as React from 'react';

import {FC} from "react";
import {variantType} from "@/app/_components/ClassInfo";

type EmailTemplateType = {
    carts: Array<Partial<variantType & {count: number}>>,
    email: string
}

const EmailTemplate = (p: {}) => {

    return (
        <div>
            <p>
                Благодарим вас за то, что вы заказли билеты через виджет<br/>
            </p>
        </div>
    );
}

export default EmailTemplate
