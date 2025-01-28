import { formatTaskId } from '@/utils/ai/taskIdMap';

interface EmailTemplate {
  subject: string;
  html: string;
}

export const taskEmailTemplates = {
  taskAssigned: (assigneeName: string, creatorName: string, taskId: string): EmailTemplate => ({
    subject: `New Task Assignment: ${formatTaskId(taskId)}`,
    html: `
      <h1><strong>New Task Assigned</strong></h1>
      <p>Hello ${assigneeName},</p>
      <p>You have been assigned a new task "${formatTaskId(taskId)}" by ${creatorName}.</p>
      <p>Visit your dashboard to view the task details.</p>
      <br>
      <i><strong>This is an automated notification from Taskify AI</strong></i>
    `
  }),

  taskUpdated: (assigneeName: string, updaterName: string, taskId: string): EmailTemplate => ({
    subject: `Task Updated: ${formatTaskId(taskId)}`,
    html: `
      <h1><strong>Task Update Notification</strong></h1>
      <p>Hello ${assigneeName},</p>
      <p>Your task "${formatTaskId(taskId)}" has been updated by ${updaterName}.</p>
      <p>Please check your dashboard for the changes.</p>
      <br>
      <i><strong>This is an automated notification from Taskify AI</strong></i>
    `
  }),

  taskDeleted: (assigneeName: string, deleterName: string, taskId: string): EmailTemplate => ({
    subject: `Task Deletion Notification: ${formatTaskId(taskId)}`,
    html: `
      <h1><strong>Task Deleted</strong></h1>
      <p>Hello ${assigneeName},</p>
      <p>Task "${formatTaskId(taskId)}" assigned to you has been deleted by ${deleterName}.</p>
      <br>
      <i><strong>This is an automated notification from Taskify AI</strong></i>
    `
  })
}; 