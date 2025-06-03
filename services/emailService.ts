interface EmailData {
  customer_name: string;
  message: string;
  to: string;
  from: string;
}

interface EmailConfig {
  apiUrl: string;
  apiKey: string;
  fromEmail: string;
}

class EmailService {
  private config: EmailConfig;
  private initialized: boolean = false;

  constructor() {
    // Default configuration - will be overridden by admin settings
    this.config = {
      apiUrl: 'https://webhook-processor-production-68cd.up.railway.app/webhook/sendMail',
      apiKey: '', // Will be set from admin settings
      fromEmail: 'noreply@reviewfighters.com'
    };
    
    this.initializeFromStorage();
  }

  // Initialize configuration from localStorage
  private initializeFromStorage() {
    try {
      const savedConfig = localStorage.getItem('emailConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsedConfig };
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error loading email configuration from storage:', error);
      this.initialized = true; // Still mark as initialized to prevent repeated attempts
    }
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return this.initialized && !!this.config.apiUrl;
  }

  // Update configuration from admin settings
  updateConfig(config: Partial<EmailConfig>) {
    this.config = { ...this.config, ...config };
    // Save to localStorage
    try {
      localStorage.setItem('emailConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving email configuration:', error);
    }
  }

  // Get current configuration
  getConfig(): EmailConfig {
    return { ...this.config };
  }

  // Send email through n8n webhook
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.config.apiUrl) {
        console.error('Email service not configured - missing API URL');
        return false;
      }

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        console.error('Failed to send email:', response.status, response.statusText);
        return false;
      }

      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Helper method for support ticket notifications
  async sendSupportTicketNotification(
    customerName: string,
    customerEmail: string,
    ticketSubject: string,
    ticketMessage: string,
    adminEmail: string = 'admin@reviewfighters.com'
  ): Promise<boolean> {
    const emailData: EmailData = {
      customer_name: customerName,
      message: `New Support Ticket from ${customerName} (${customerEmail})\n\nSubject: ${ticketSubject}\n\nMessage:\n${ticketMessage}`,
      to: adminEmail,
      from: this.config.fromEmail
    };

    const emailSent = await this.sendEmail(emailData);
    
    // Also trigger browser/system notification
    if (emailSent) {
      try {
        // Dynamic import to avoid circular dependency
        const { notificationService } = await import('./notificationService');
        await notificationService.notifySupportTicket(customerName, ticketSubject);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return emailSent;
  }

  // Helper method for review notifications
  async sendReviewNotification(
    customerName: string,
    businessName: string,
    reviewContent: string,
    rating: number,
    notificationEmail: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      customer_name: customerName,
      message: `New Review Alert\n\nBusiness: ${businessName}\nCustomer: ${customerName}\nRating: ${rating} stars\n\nReview:\n${reviewContent}`,
      to: notificationEmail,
      from: this.config.fromEmail
    };

    const emailSent = await this.sendEmail(emailData);
    
    // Also trigger browser/system notification
    if (emailSent) {
      try {
        const { notificationService } = await import('./notificationService');
        await notificationService.notifyNewReview(customerName, businessName, rating);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return emailSent;
  }

  // Helper method for user registration notifications
  async sendUserRegistrationNotification(
    userName: string,
    userEmail: string,
    userRole: string,
    adminEmail: string = 'admin@reviewfighters.com'
  ): Promise<boolean> {
    const emailData: EmailData = {
      customer_name: userName,
      message: `New User Registration\n\nName: ${userName}\nEmail: ${userEmail}\nRole: ${userRole}\n\nUser has successfully registered on the platform.`,
      to: adminEmail,
      from: this.config.fromEmail
    };

    const emailSent = await this.sendEmail(emailData);
    
    // Also trigger browser/system notification
    if (emailSent) {
      try {
        const { notificationService } = await import('./notificationService');
        await notificationService.notifyUserRegistration(userName, userRole);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return emailSent;
  }

  // Helper method for password reset emails
  async sendPasswordResetEmail(
    userName: string,
    userEmail: string,
    resetToken: string
  ): Promise<boolean> {
    const resetLink = `${window.location.origin}/#/reset-password?token=${resetToken}`;
    
    const emailData: EmailData = {
      customer_name: userName,
      message: `Password Reset Request\n\nHello ${userName},\n\nYou have requested to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThis link will expire in 24 hours.`,
      to: userEmail,
      from: this.config.fromEmail
    };

    return this.sendEmail(emailData);
  }

  // Helper method for staff task assignments
  async sendStaffTaskNotification(
    staffName: string,
    staffEmail: string,
    taskTitle: string,
    taskDescription: string,
    dueDate: string,
    staffUserId?: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      customer_name: staffName,
      message: `New Task Assignment\n\nHello ${staffName},\n\nYou have been assigned a new task:\n\nTitle: ${taskTitle}\nDescription: ${taskDescription}\nDue Date: ${dueDate}\n\nPlease log in to the staff portal to view more details.`,
      to: staffEmail,
      from: this.config.fromEmail
    };

    const emailSent = await this.sendEmail(emailData);
    
    // Also trigger browser/system notification
    if (emailSent && staffUserId) {
      try {
        const { notificationService } = await import('./notificationService');
        await notificationService.notifyTaskAssignment(taskTitle, staffUserId);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return emailSent;
  }

  // Helper method for contact form submissions
  async sendContactFormSubmission(
    customerName: string,
    customerEmail: string,
    subject: string,
    message: string,
    adminEmail: string = 'admin@reviewfighters.com'
  ): Promise<boolean> {
    const emailData: EmailData = {
      customer_name: customerName,
      message: `Contact Form Submission\n\nFrom: ${customerName} (${customerEmail})\nSubject: ${subject}\n\nMessage:\n${message}`,
      to: adminEmail,
      from: this.config.fromEmail
    };

    const emailSent = await this.sendEmail(emailData);
    
    // Also trigger browser/system notification
    if (emailSent) {
      try {
        const { notificationService } = await import('./notificationService');
        await notificationService.notify({
          title: 'New Contact Form',
          message: `${customerName} submitted a contact form: ${subject}`,
          type: 'info',
          actionUrl: '/admin/contact-forms',
          metadata: { customerName, customerEmail, subject }
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return emailSent;
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Export types for use in other files
export type { EmailData, EmailConfig }; 