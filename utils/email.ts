import { emailService } from '../services/emailService';

interface InvitationEmailData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const sendInvitationEmail = async (data: InvitationEmailData): Promise<boolean> => {
  const message = `
Welcome to Review Fighters!

Dear ${data.name},

You have been invited to join Review Fighters as a ${data.role}. Here are your login credentials:

Email: ${data.email}
Temporary Password: ${data.password}

For security reasons, please change your password immediately after your first login.

You can log in at: ${window.location.origin}/#/login

Best regards,
The Review Fighters Team
`;

  return emailService.sendEmail({
    customer_name: data.name,
    message,
    to: data.email,
    from: emailService.getConfig().fromEmail,
  });
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  resetToken: string
): Promise<boolean> => {
  const resetLink = `${window.location.origin}/#/reset-password?token=${resetToken}`;
  
  const message = `
Password Reset Request

Hello ${name},

You have requested to reset your password. Please click the link below to reset your password:

${resetLink}

If you did not request this, please ignore this email.

This link will expire in 24 hours.

Best regards,
The Review Fighters Team
`;

  return emailService.sendEmail({
    customer_name: name,
    message,
    to: email,
    from: emailService.getConfig().fromEmail,
  });
}; 