import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

export async function initMailer() {
  if (!transporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Ethereal Email Transporter initialized for password resets.');
    } catch (e) {
      console.warn('⚠️ Could not initialize Ethereal mailer, falling back to local logger.');
    }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<string> {
  await initMailer();
  const resetLink = `http://localhost:3000/forgot-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  
  console.log(`\n================ PASSWORD RESET LINK ================`);
  console.log(`To: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log(`Token: ${resetToken}`);
  console.log(`=====================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: '"Tripweave Support" <security@tripweave.com>',
        to: email,
        subject: 'Reset Your Tripweave Password',
        text: `You requested a password reset for Tripweave. Use this link: ${resetLink} (Valid for 1 hour).`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #000;">Tripweave Password Reset</h2>
            <p>We received a request to reset your password. Click the button below to choose a new password:</p>
            <a href="${resetLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; margin: 16px 0;">Reset Password</a>
            <p style="color: #666; font-size: 12px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`Preview email at: ${previewUrl}`);
      }
    } catch (err) {
      console.error('Failed to dispatch test email:', err);
    }
  }

  return resetLink;
}
