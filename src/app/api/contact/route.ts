import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "pokochajangielski@gmail.com";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Brak wymaganych pól." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Formularz kontaktowy <onboarding@resend.dev>",
    to: TO,
    replyTo: email,
    subject: `Zapytanie od ${name}`,
    text: `Imię: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Błąd wysyłki." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
