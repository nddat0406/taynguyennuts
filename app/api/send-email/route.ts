import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER , 
        pass: process.env.GMAIL_APP_PASSWORD ,
      },
    });
    const info = await transporter.sendMail({
      from: `"Tây Nguyên Nuts" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Send mail error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
