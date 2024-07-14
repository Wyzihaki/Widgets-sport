import nodemailer from "nodemailer"
import {NextRequest, NextResponse} from "next/server";
import email from "@/app/_components/Email";

async function sendMail(data: {message: string, email: string}) {
    const message = data?.message

    const formattedBody = `
    <html>
      <body>
        <p>${message}</p>
      </body>
    </html>
  `

    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 587,
        secure: false,
        auth: {
            user: 'w1dgetsport@mail.ru',
            pass: 'R6YAJMZ18dCYWpkQyhFY'
        }
    });

    return await transporter.sendMail({
        from: 'w1dgetsport@mail.ru',
        to: data.email,
        subject: "Заявка с сайта",
        html: formattedBody,
    })
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    const r2 = await sendMail(body as {message: string, email: string})
    if (r2?.messageId) {
        return NextResponse.json({ok: true})
    } else {
        return NextResponse.json({ok: false, message: "Сообщение не отправлено"})
    }
}
