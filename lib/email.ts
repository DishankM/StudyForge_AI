import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  throw new Error("BREVO_API_KEY is not set");
}

const senderName = process.env.BREVO_SENDER_NAME || "StudyForge";
const senderEmail = process.env.BREVO_SENDER_EMAIL;
if (!senderEmail) {
  throw new Error("BREVO_SENDER_EMAIL is not set");
}

const transactionalApi = new TransactionalEmailsApi();
transactionalApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  await transactionalApi.sendTransacEmail({
    sender: { name: senderName, email: senderEmail },
    to: [{ email }],
    subject: "Verify your email - StudyForge",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; padding: 0; background-color: #0b0b12; font-family: 'Inter', Arial, sans-serif; color: #e8e8f0; }
            .wrapper { width: 100%; padding: 32px 16px; background: radial-gradient(circle at top, rgba(124, 92, 255, 0.2), transparent 55%), #0b0b12; }
            .card { max-width: 600px; margin: 0 auto; background: #12121b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35); }
            .header { padding: 28px 32px; background: linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(255, 107, 157, 0.18)); }
            .brand { font-size: 22px; font-weight: 700; letter-spacing: 0.6px; color: #ffffff; }
            .content { padding: 32px; }
            h1 { font-size: 26px; margin: 0 0 12px; color: #ffffff; }
            p { color: #b6b6c6; line-height: 1.7; margin: 0 0 18px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #7c5cff, #ff6b9d); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; letter-spacing: 0.2px; }
            .pill { display: inline-block; background: rgba(124, 92, 255, 0.2); color: #c8c2ff; padding: 4px 10px; border-radius: 999px; font-size: 12px; margin-bottom: 14px; }
            .linkbox { background: #0f0f17; border: 1px dashed rgba(255, 255, 255, 0.18); padding: 12px 14px; border-radius: 10px; color: #c9c9e6; word-break: break-all; font-size: 13px; }
            .footer { padding: 22px 32px 30px; border-top: 1px solid rgba(255, 255, 255, 0.06); color: #8a8aa3; font-size: 13px; }
            .small { font-size: 12px; color: #9a9ab0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div class="brand">StudyForge</div>
              </div>
              <div class="content">
                <div class="pill">Email Verification</div>
                <h1>Welcome, ${name}!</h1>
                <p>Your new StudyForge account is ready. Confirm your email to activate your 7-day free trial and unlock your workspace.</p>
                <p><a href="${confirmLink}" class="cta">Verify Email Address</a></p>
                <p class="small">This link expires in 1 hour.</p>
                <p class="small">If the button doesn’t work, copy and paste this link:</p>
                <div class="linkbox">${confirmLink}</div>
              </div>
              <div class="footer">
                If you didn't create a StudyForge account, you can safely ignore this email.<br />
                (c) 2024 StudyForge.
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`;

  await transactionalApi.sendTransacEmail({
    sender: { name: senderName, email: senderEmail },
    to: [{ email }],
    subject: "Reset your password - StudyForge",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; padding: 0; background-color: #0b0b12; font-family: 'Inter', Arial, sans-serif; color: #e8e8f0; }
            .wrapper { width: 100%; padding: 32px 16px; background: radial-gradient(circle at top, rgba(124, 92, 255, 0.2), transparent 55%), #0b0b12; }
            .card { max-width: 600px; margin: 0 auto; background: #12121b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35); }
            .header { padding: 28px 32px; background: linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(255, 107, 157, 0.18)); }
            .brand { font-size: 22px; font-weight: 700; letter-spacing: 0.6px; color: #ffffff; }
            .content { padding: 32px; }
            h1 { font-size: 26px; margin: 0 0 12px; color: #ffffff; }
            p { color: #b6b6c6; line-height: 1.7; margin: 0 0 18px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #7c5cff, #ff6b9d); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; letter-spacing: 0.2px; }
            .alert { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); color: #fca5a5; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin: 18px 0; }
            .linkbox { background: #0f0f17; border: 1px dashed rgba(255, 255, 255, 0.18); padding: 12px 14px; border-radius: 10px; color: #c9c9e6; word-break: break-all; font-size: 13px; }
            .footer { padding: 22px 32px 30px; border-top: 1px solid rgba(255, 255, 255, 0.06); color: #8a8aa3; font-size: 13px; }
            .small { font-size: 12px; color: #9a9ab0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div class="brand">StudyForge</div>
              </div>
              <div class="content">
                <div class="pill" style="display:inline-block;background:rgba(124,92,255,0.2);color:#c8c2ff;padding:4px 10px;border-radius:999px;font-size:12px;margin-bottom:14px;">Password Reset</div>
                <h1>Reset your password</h1>
                <p>Hi ${name}, we received a request to reset your password. Use the button below to set a new one.</p>
                <p><a href="${resetLink}" class="cta">Reset Password</a></p>
                <p class="small">This link expires in 1 hour.</p>
                <p class="small">If the button doesn’t work, copy and paste this link:</p>
                <div class="linkbox">${resetLink}</div>
                <div class="alert">If you didn't request a password reset, please ignore this email.</div>
              </div>
              <div class="footer">
                (c) 2024 StudyForge.
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
