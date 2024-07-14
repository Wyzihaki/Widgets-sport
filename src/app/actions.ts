'use server'

import { Resend } from 'resend'
import EmailTemplate from "@/app/_components/Email";

const resend = new Resend('re_JKTAxDhc_5ap13KV16ybez1UxFqxsNedh')

export async function sendEmail(email: string) {
    try {
        const data = await resend.emails.send({
            from: 'hello@widget.com',
            to: [email],
            subject: 'Contact form submission',
            text: `Email: ${email}`,
            react: EmailTemplate({})
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}
