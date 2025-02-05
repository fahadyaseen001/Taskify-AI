import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, token: string) => {
  // Use the request host or fallback to environment variable
  const getBaseURL = () => {
    // Check for production deployment
    if (process.env.NODE_ENV === 'production') {
      // Prioritize custom production URL
      return `https://${process.env.NEXT_PUBLIC_PRODUCTION_URL}` 
        || `https://${process.env.VERCEL_URL}`
        || process.env.NEXT_PUBLIC_APP_URL ;
    }
  
    // For preview or development environments
    return process.env.NEXT_PUBLIC_APP_URL 
      || `https://${process.env.VERCEL_URL}`
      || 'http://localhost:3000';
  };
  
  // Generate the base URL
  const baseUrl = getBaseURL();
  
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1><strong>Email Verification</strong></h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <br>
      <i><strong>This is an automated notification from Taskify AI</strong></i>
    `,
  });
};