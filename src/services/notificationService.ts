import { taskEmailTemplates } from '@/utils/mail/taskNotificationTemplates';
import nodemailer from 'nodemailer';

export class NotificationService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private static async sendEmail(to: string, subject: string, html: string) {
    const transporter = this.getTransporter();
    
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // In production, you might want to use a proper logging service
    }
  }

  static async notifyTaskAssignment(assigneeEmail: string, assigneeName: string, creatorName: string, taskId: string) {
    const { subject, html } = taskEmailTemplates.taskAssigned(assigneeName, creatorName, taskId);
    await this.sendEmail(assigneeEmail, subject, html);
  }

  static async notifyTaskUpdate(assigneeEmail: string, assigneeName: string, updaterName: string, taskId: string) {
    const { subject, html } = taskEmailTemplates.taskUpdated(assigneeName, updaterName, taskId);
    await this.sendEmail(assigneeEmail, subject, html);
  }

  static async notifyTaskDeletion(assigneeEmail: string, assigneeName: string, deleterName: string, taskId: string) {
    const { subject, html } = taskEmailTemplates.taskDeleted(assigneeName, deleterName, taskId);
    await this.sendEmail(assigneeEmail, subject, html);
  }
} 