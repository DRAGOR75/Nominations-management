// app/api/test-mail/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET() {
    // Security check: Only allow this in development or for your specific email
    console.log("🚀 Vercel Test Triggered for:", process.env.EMAIL_USER);

    try {
        const result = await sendEmail(
            process.env.EMAIL_USER || '',
            "Thriveni Portal: Vercel Connection Test",
            `
        <div style="font-family: sans-serif; padding: 20px; border: 5px solid #2e7d32;">
          <h1>✅ Handshake Successful!</h1>
          <p>This confirms that Vercel is successfully using your <b>GMAIL_REFRESH_TOKEN</b>.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `
        );

        if (result.success) {
            return NextResponse.json({ message: "Test Email Sent Successfully!" });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}