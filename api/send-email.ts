import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
    region: process.env.AWS_SES_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
    },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    const { to, subject, body } = req.body ?? {};
    if (!to || !subject || !body) {
        return res.status(400).json({ ok: false, error: "missing_fields", message: "Faltan campos: to, subject o body." });
    }
    try {
        const command = new SendEmailCommand({
            Source: process.env.SES_FROM_EMAIL!,
            Destination: { ToAddresses: [to] },
            Message: {
                Subject: { Data: subject },
                Body: { Text: { Data: body } },
            }
        });
        const result = await ses.send(command);
        return res.status(200).json({ ok: true, messageId: result.MessageId });
    } catch (err: any) {
        console.error("SES error:", err?.message);
        return res.status(500).json({ ok: false, error: err?.name ?? "send_failed", message: "No se pudo enviar el email." });
    }
}