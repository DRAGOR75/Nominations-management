import nodemailer from 'nodemailer';

// 1. Create the Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * HELPER: Get the Base URL (Production Safe)
 */
const getBaseUrl = () => {
  // 1. Development Mode always uses localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 2. If you set NEXT_PUBLIC_APP_URL in Vercel, use it (Best Practice)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 3. Fallback to the specific URL you found (Safety Net)
  return 'https://templtrainingportal.vercel.app';
};

/**
 * GENERIC EMAIL FUNCTION
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Thriveni Training System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`📧 Generic Email sent to ${to} (ID: ${info.messageId})`);
    return { success: true };
  } catch (error) {
    console.error('❌ Generic Email failed:', error);
    return { success: false, error };
  }
}

/**
 * 1. NOMINATION APPROVAL FUNCTION (For Managers)
 */
export async function sendApprovalEmail(
  managerEmail: string,
  managerName: string,
  nomineeName: string,
  justification: string,
  nominationId: string
) {
  const baseUrl = getBaseUrl();
  const approvalLink = `${baseUrl}/nominations/manager/${nominationId}`;

  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Nomination Approval Request</h2>
        
        <p>Dear <strong>${managerName}</strong>,</p>
        
        <p>A new training nomination has been submitted for <strong style="color: #2c3e50;">${nomineeName}</strong>.</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0;">
          <strong style="display: block; margin-bottom: 5px; color: #555;">Justification / Details:</strong>
          <span style="font-style: italic; color: #333;">${justification.replace(/\n/g, '<br/>')}</span>
        </div>

        <p>Your action is required to proceed with this nomination. Please click the button below to review, approve, or reject this request.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${approvalLink}" style="background-color: #0056b3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Review & Take Action
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #888; text-align: center;">Thriveni Training & Development System</p>
      </div>
    `;

  return await sendEmail(managerEmail, `Action Required: Nomination Approval for ${nomineeName}`, html);
}

/**
 * 2. FEEDBACK REQUEST EMAIL (For Employees)
 * 🟢 Added this back so your feedback system works!
 */
export async function sendFeedbackRequestEmail(
  employeeEmail: string,
  employeeName: string,
  programName: string,
  enrollmentId: string
) {
  const baseUrl = getBaseUrl();
  const feedbackLink = `${baseUrl}/feedback/employee/${enrollmentId}`;

  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Training Feedback Request</h2>
        
        <p>Dear <strong>${employeeName}</strong>,</p>
        
        <p>You recently completed the training program: <strong style="color: #2c3e50;">${programName}</strong>.</p>
        
        <p>We value your feedback! Please take a moment to rate the effectiveness of this training to help us improve.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${feedbackLink}" style="background-color: #2e7d32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Submit Feedback
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #888; text-align: center;">Thriveni Training & Development System</p>
      </div>
    `;

  return await sendEmail(employeeEmail, `Feedback Required: ${programName}`, html);
}