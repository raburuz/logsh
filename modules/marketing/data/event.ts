export interface IEventDemo {
  name: string;
  description: string;
  icon: string;
  color?: string,
  workspace: string;
}

export const eventTemplates:IEventDemo[] = [
  // ===============================
  // User Authentication & Sessions
  // ===============================
  { name: 'User Login', description: 'john.doe@example.com logged in from Chrome', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Login', description: 'sarah.smith@example.com logged in from Safari', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Login', description: 'mike.johnson@example.com logged in from Firefox', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Login', description: 'emma.wilson@example.com logged in from Edge', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Login', description: 'david.brown@example.com logged in from Mobile App', icon: '📱', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Logout', description: 'alice.cooper@example.com logged out', icon: '🚪', color: '#3b82f6', workspace: 'Authentication' },
  { name: 'User Logout', description: 'bob.martin@example.com logged out', icon: '🚪', color: '#3b82f6', workspace: 'Authentication' },
  { name: 'Password Changed', description: 'jessica.taylor@example.com updated their password', icon: '🔑', color: '#a855f7', workspace: 'Authentication' },
  { name: 'Password Reset', description: 'kevin.anderson@example.com requested password reset', icon: '♻️', color: '#f59e0b', workspace: 'Authentication' },
  { name: '2FA Enabled', description: 'laura.thomas@example.com enabled two-factor authentication', icon: '🛡️', color: '#10b981', workspace: 'Authentication' },
  { name: '2FA Disabled', description: 'mark.jackson@example.com disabled two-factor authentication', icon: '🛡️', color: '#f59e0b', workspace: 'Authentication' },
  { name: 'Session Expired', description: 'User session expired for paul.white@example.com', icon: '⏰', color: '#ef4444', workspace: 'Authentication' },
  { name: 'Failed Login', description: 'Failed login attempt for admin@example.com', icon: '❌', color: '#dc2626', workspace: 'Authentication' },
  { name: 'Account Locked', description: 'natalie.harris@example.com account locked after 5 failed attempts', icon: '🔒', color: '#991b1b', workspace: 'Authentication' },
  { name: 'Account Unlocked', description: 'oliver.clark@example.com account unlocked by admin', icon: '🔓', color: '#059669', workspace: 'Authentication' },
  { name: 'User Login', description: 'mia.evans@example.com logged in from Opera', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Login', description: 'liam.morgan@example.com logged in from Brave', icon: '🔓', color: '#22c55e', workspace: 'Authentication' },
  { name: 'User Logout', description: 'olivia.martin@example.com logged out', icon: '🚪', color: '#3b82f6', workspace: 'Authentication' },
  { name: 'Password Changed', description: 'noah.robinson@example.com updated their password', icon: '🔑', color: '#a855f7', workspace: 'Authentication' },
  { name: 'Password Reset', description: 'sophia.walker@example.com requested a password reset', icon: '♻️', color: '#f59e0b', workspace: 'Authentication' },
  { name: '2FA Enabled', description: 'ethan.hall@example.com enabled two-factor authentication', icon: '🛡️', color: '#10b981', workspace: 'Authentication' },
  { name: '2FA Disabled', description: 'amelia.young@example.com disabled two-factor authentication', icon: '🛡️', color: '#f59e0b', workspace: 'Authentication' },
  { name: 'Session Expired', description: 'User session expired for jackson.king@example.com', icon: '⏰', color: '#ef4444', workspace: 'Authentication' },
  { name: 'Failed Login', description: 'Failed login attempt for lucas.scott@example.com', icon: '❌', color: '#dc2626', workspace: 'Authentication' },
  { name: 'Account Locked', description: 'harper.adams@example.com account locked after multiple failed attempts', icon: '🔒', color: '#991b1b', workspace: 'Authentication' },
  { name: 'Account Unlocked', description: 'avery.bell@example.com account unlocked by admin', icon: '🔓', color: '#059669', workspace: 'Authentication' },
  { name: 'Security Alert', description: 'Suspicious login detected for evelyn.carter@example.com', icon: '🚨', color: '#f97316', workspace: 'Authentication' },
  { name: 'Email Updated', description: 'isabella.mitchell@example.com updated their email address', icon: '📧', color: '#8b5cf6', workspace: 'Authentication' },
  { name: 'Profile Updated', description: 'mason.roberts@example.com updated their profile information', icon: '👤', color: '#0ea5e9', workspace: 'Authentication' },
  { name: 'Login From New Device', description: 'aiden.turner@example.com logged in from a new device', icon: '🖥️', color: '#3b82f6', workspace: 'Authentication' },
  // ===============================
  // Payments & Billing
  // ===============================
  { name: 'Payment Received', description: 'Subscription renewed: Pro Plan - $29.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Received', description: 'Enterprise Plan payment processed - $299.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Received', description: 'Basic Plan subscription - $9.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Failed', description: 'Card declined for rebecca.lee@example.com - $49.99', icon: '❌', color: '#ef4444', workspace: 'Billing' },
  { name: 'Payment Failed', description: 'Insufficient funds for steve.walker@example.com', icon: '❌', color: '#ef4444', workspace: 'Billing' },
  { name: 'Refund Processed', description: 'Refund issued: $99.99 to tina.hall@example.com', icon: '↩️', color: '#06b6d4', workspace: 'Billing' },
  { name: 'Subscription Upgraded', description: 'victor.young@example.com upgraded to Pro Plan', icon: '📈', color: '#8b5cf6', workspace: 'Billing' },
  { name: 'Subscription Downgraded', description: 'wendy.king@example.com downgraded to Basic Plan', icon: '📉', color: '#f59e0b', workspace: 'Billing' },
  { name: 'Subscription Cancelled', description: 'xavier.wright@example.com cancelled subscription', icon: '🛑', color: '#dc2626', workspace: 'Billing' },
  { name: 'Trial Started', description: 'yolanda.lopez@example.com started 14-day trial', icon: '🧪', color: '#06b6d4', workspace: 'Billing' },
  { name: 'Trial Ending Soon', description: 'Trial expires in 3 days for zack.hill@example.com', icon: '⏳', color: '#f97316', workspace: 'Billing' },
  { name: 'Trial Expired', description: 'Trial ended for amy.green@example.com', icon: '⌛', color: '#ef4444', workspace: 'Billing' },
  { name: 'Invoice Generated', description: 'Invoice #INV-2024-001 created for $149.99', icon: '🧾', color: '#8b5cf6', workspace: 'Billing' },
  { name: 'Invoice Paid', description: 'Invoice #INV-2024-002 paid by brian.adams@example.com', icon: '✅', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Method Added', description: 'carol.baker@example.com added new payment method', icon: '💳', color: '#06b6d4', workspace: 'Billing' },

  { name: 'Payment Received', description: 'Pro Plan subscription renewed for nathan.morris@example.com - $29.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Received', description: 'Enterprise Plan payment processed for laura.scott@example.com - $299.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Received', description: 'Basic Plan subscription renewed for ethan.evans@example.com - $9.99', icon: '💰', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Failed', description: 'Card declined for sophia.james@example.com - $59.99', icon: '❌', color: '#ef4444', workspace: 'Billing' },
  { name: 'Payment Failed', description: 'Insufficient funds for liam.hill@example.com - $19.99', icon: '❌', color: '#ef4444', workspace: 'Billing' },
  { name: 'Refund Processed', description: 'Refund issued: $49.99 to olivia.mitchell@example.com', icon: '↩️', color: '#06b6d4', workspace: 'Billing' },
  { name: 'Subscription Upgraded', description: 'jackson.moore@example.com upgraded to Enterprise Plan', icon: '📈', color: '#8b5cf6', workspace: 'Billing' },
  { name: 'Subscription Downgraded', description: 'amelia.morgan@example.com downgraded to Basic Plan', icon: '📉', color: '#f59e0b', workspace: 'Billing' },
  { name: 'Subscription Cancelled', description: 'mason.carter@example.com cancelled subscription', icon: '🛑', color: '#dc2626', workspace: 'Billing' },
  { name: 'Trial Started', description: 'isabella.turner@example.com started 7-day trial', icon: '🧪', color: '#06b6d4', workspace: 'Billing' },
  { name: 'Trial Ending Soon', description: 'Trial expires in 2 days for noah.adams@example.com', icon: '⏳', color: '#f97316', workspace: 'Billing' },
  { name: 'Trial Expired', description: 'Trial ended for harper.james@example.com', icon: '⌛', color: '#ef4444', workspace: 'Billing' },
  { name: 'Invoice Generated', description: 'Invoice #INV-2026-003 created for $199.99', icon: '🧾', color: '#8b5cf6', workspace: 'Billing' },
  { name: 'Invoice Paid', description: 'Invoice #INV-2026-004 paid by evelyn.robinson@example.com', icon: '✅', color: '#22c55e', workspace: 'Billing' },
  { name: 'Payment Method Added', description: 'liam.anderson@example.com added a new credit card', icon: '💳', color: '#06b6d4', workspace: 'Billing' },
  { name: 'Payment Method Removed', description: 'emma.walker@example.com removed an old payment method', icon: '🗑️', color: '#f59e0b', workspace: 'Billing' },
  { name: 'Refund Requested', description: 'oliver.hall@example.com requested a refund for $79.99', icon: '📨', color: '#f97316', workspace: 'Billing' },
  { name: 'Subscription Paused', description: 'avery.bell@example.com paused their subscription', icon: '⏸️', color: '#f59e0b', workspace: 'Billing' },
  { name: 'Subscription Resumed', description: 'harper.james@example.com resumed subscription', icon: '▶️', color: '#22c55e', workspace: 'Billing' },

  // ===============================
  // Marketing
  // ===============================
  { name: 'Campaign Launched', description: 'Email campaign "Spring Sale" launched', icon: '🚀', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Ad Created', description: 'New social media ad created for Facebook', icon: '🖼️', color: '#06b6d4', workspace: 'Marketing' },
  { name: 'Ad Paused', description: 'Google Ads campaign paused temporarily', icon: '⏸️', color: '#f97316', workspace: 'Marketing' },
  { name: 'Newsletter Sent', description: 'Newsletter "Weekly Updates" sent to subscribers', icon: '📨', color: '#8b5cf6', workspace: 'Marketing' },
  { name: 'Campaign Comment', description: 'Comment added to campaign "Holiday Promo"', icon: '💬', color: '#6366f1', workspace: 'Marketing' },
  { name: 'Reaction Added', description: '👍 Reaction added to social post draft', icon: '👍', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Mention Used', description: '@marketing.team mentioned in campaign discussion', icon: '🏷️', color: '#f59e0b', workspace: 'Marketing' },
  { name: 'Segment Created', description: 'New subscriber segment "VIP Customers" created', icon: '👥', color: '#06b6d4', workspace: 'Marketing' },
  { name: 'Subscriber Added', description: 'new.subscriber@example.com added to mailing list', icon: '➕', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Subscriber Removed', description: 'unsubscribed.user@example.com removed from list', icon: '➖', color: '#ef4444', workspace: 'Marketing' },
  { name: 'A/B Test Started', description: 'A/B test launched for subject line "Spring Deals"', icon: '🧪', color: '#22c55e', workspace: 'Marketing' },
  { name: 'A/B Test Completed', description: 'A/B test results available for "Spring Deals" campaign', icon: '📊', color: '#06b6d4', workspace: 'Marketing' },
  { name: 'Social Post Scheduled', description: 'Instagram post scheduled for 10 AM', icon: '📅', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Social Post Published', description: 'Facebook post published successfully', icon: '📢', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Campaign Paused', description: 'Campaign "Winter Promo" paused due to low engagement', icon: '⏸️', color: '#f97316', workspace: 'Marketing' },
  { name: 'Campaign Ended', description: 'Campaign "Black Friday" ended', icon: '🏁', color: '#6366f1', workspace: 'Marketing' },
  { name: 'Email Opened', description: 'User opened email from "Spring Sale" campaign', icon: '📬', color: '#06b6d4', workspace: 'Marketing' },
  { name: 'Email Clicked', description: 'Subscriber clicked a link in newsletter', icon: '🔗', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Bounce Recorded', description: 'Email bounced for invalid address user@example.com', icon: '📭', color: '#ef4444', workspace: 'Marketing' },
  { name: 'Unsubscribe Recorded', description: 'User unsubscribed from mailing list', icon: '🚫', color: '#dc2626', workspace: 'Marketing' },
  { name: 'Engagement Report Generated', description: 'Weekly engagement report for campaigns generated', icon: '📈', color: '#8b5cf6', workspace: 'Marketing' },
  { name: 'Lead Captured', description: 'New lead captured via landing page form', icon: '🎯', color: '#22c55e', workspace: 'Marketing' },
  { name: 'Conversion Recorded', description: 'User completed purchase from campaign link', icon: '🛒', color: '#059669', workspace: 'Marketing' },
  { name: 'Ad Budget Updated', description: 'Ad campaign budget increased to $500', icon: '💵', color: '#f59e0b', workspace: 'Marketing' },
  { name: 'Ad Performance Alert', description: 'Ad CTR dropped below 1% for "Spring Sale"', icon: '🚨', color: '#dc2626', workspace: 'Marketing' },
  { name: 'Marketing Goal Achieved', description: 'Monthly goal of 1000 leads achieved', icon: '🏆', color: '#22c55e', workspace: 'Marketing' },

  // ===============================
  // File Operations
  // ===============================
  { name: 'File Uploaded', description: 'Document.pdf uploaded (2.4 MB)', icon: '📤', color: '#22c55e', workspace: 'Files' },
  { name: 'File Uploaded', description: 'Presentation.pptx uploaded (15.8 MB)', icon: '📤', color: '#22c55e', workspace: 'Files' },
  { name: 'File Uploaded', description: 'Budget_2024.xlsx uploaded (890 KB)', icon: '📤', color: '#22c55e', workspace: 'Files' },
  { name: 'File Uploaded', description: 'Product_Image.jpg uploaded (3.2 MB)', icon: '📤', color: '#22c55e', workspace: 'Files' },
  { name: 'File Downloaded', description: 'Report_Q4.pdf downloaded by daniel.carter@example.com', icon: '📥', color: '#06b6d4', workspace: 'Files' },
  { name: 'File Downloaded', description: 'Contract.docx downloaded by emily.mitchell@example.com', icon: '📥', color: '#06b6d4', workspace: 'Files' },
  { name: 'File Deleted', description: 'Old_Data.csv deleted by frank.perez@example.com', icon: '🗑️', color: '#ef4444', workspace: 'Files' },
  { name: 'File Renamed', description: 'draft.txt renamed to final.txt', icon: '✏️', color: '#8b5cf6', workspace: 'Files' },
  { name: 'File Shared', description: 'Project_Plan.pdf shared with team@example.com', icon: '🤝', color: '#10b981', workspace: 'Files' },
  { name: 'File Moved', description: 'invoice.pdf moved to /archive folder', icon: '📂', color: '#6366f1', workspace: 'Files' },
  { name: 'Folder Created', description: 'New folder "Q1_Reports" created', icon: '📁', color: '#10b981', workspace: 'Files' },
  { name: 'Folder Deleted', description: 'Folder "temp" deleted with 12 files', icon: '🗂️', color: '#ef4444', workspace: 'Files' },
  { name: 'File Version Created', description: 'New version of design.ai created (v3)', icon: '🕒', color: '#8b5cf6', workspace: 'Files' },
  { name: 'File Restored', description: 'backup.zip restored from trash', icon: '♻️', color: '#10b981', workspace: 'Files' },
  { name: 'File Locked', description: 'confidential.pdf locked by grace.roberts@example.com', icon: '🔒', color: '#f97316', workspace: 'Files' },
  { name: 'File Unlocked', description: 'confidential.pdf unlocked by admin@example.com', icon: '🔓', color: '#22c55e', workspace: 'Files' },
  { name: 'File Previewed', description: 'marketing_banner.png previewed', icon: '👁️', color: '#06b6d4', workspace: 'Files' },
  { name: 'Bulk Upload Started', description: 'Bulk upload of 120 files started', icon: '🚚', color: '#f97316', workspace: 'Files' },
  { name: 'Bulk Upload Completed', description: 'Bulk upload completed successfully', icon: '📦', color: '#22c55e', workspace: 'Files' },
  { name: 'Storage Limit Reached', description: 'Storage limit reached for team workspace', icon: '⚠️', color: '#dc2626', workspace: 'Files' },

  // ===============================
  // Projects & Tasks
  // ===============================
  { name: 'Project Created', description: 'New project "Website Redesign" created', icon: '📁', color: '#22c55e', workspace: 'Projects' },
  { name: 'Project Updated', description: 'Project "Mobile App" settings updated', icon: '⚙️', color: '#6366f1', workspace: 'Projects' },
  { name: 'Project Archived', description: 'Project "Legacy CRM" archived', icon: '🗄️', color: '#f97316', workspace: 'Projects' },
  { name: 'Project Restored', description: 'Project "Legacy CRM" restored from archive', icon: '♻️', color: '#10b981', workspace: 'Projects' },
  { name: 'Task Created', description: 'Task "Design Homepage" created', icon: '📝', color: '#22c55e', workspace: 'Projects' },
  { name: 'Task Assigned', description: 'Task "API Integration" assigned to john.doe@example.com', icon: '👤', color: '#06b6d4', workspace: 'Projects' },
  { name: 'Task Updated', description: 'Task "Landing Page Copy" updated', icon: '✏️', color: '#6366f1', workspace: 'Projects' },
  { name: 'Task Completed', description: 'Task "Database Migration" marked as completed', icon: '✅', color: '#22c55e', workspace: 'Projects' },
  { name: 'Task Reopened', description: 'Task "Bug Fix #245" reopened', icon: '🔁', color: '#f97316', workspace: 'Projects' },
  { name: 'Task Deleted', description: 'Task "Old Draft" deleted', icon: '🗑️', color: '#ef4444', workspace: 'Projects' },
  { name: 'Subtask Created', description: 'Subtask "Create Wireframes" created', icon: '🧩', color: '#8b5cf6', workspace: 'Projects' },
  { name: 'Checklist Completed', description: 'Checklist "Release Prep" completed', icon: '📋', color: '#22c55e', workspace: 'Projects' },
  { name: 'Milestone Reached', description: 'Milestone "Beta Launch" reached', icon: '🏁', color: '#22c55e', workspace: 'Projects' },
  { name: 'Sprint Started', description: 'Sprint "Sprint 12" started', icon: '🚀', color: '#06b6d4', workspace: 'Projects' },
  { name: 'Sprint Ended', description: 'Sprint "Sprint 11" ended', icon: '🏁', color: '#6366f1', workspace: 'Projects' },


  // ===============================
  // Notifications
  // ===============================
    { name: 'Email Sent', description: 'Welcome email sent to new user', icon: '📧', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Email Opened', description: 'Newsletter email opened by user', icon: '📬', color: '#06b6d4', workspace: 'Notifications' },
  { name: 'Push Sent', description: 'Push notification sent to mobile device', icon: '📲', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Push Failed', description: 'Push notification delivery failed', icon: '❌', color: '#ef4444', workspace: 'Notifications' },
  { name: 'SMS Sent', description: 'Verification SMS sent', icon: '📱', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Reminder Triggered', description: 'Task reminder triggered', icon: '⏰', color: '#f59e0b', workspace: 'Notifications' },
  { name: 'Alert Triggered', description: 'System alert triggered', icon: '🚨', color: '#dc2626', workspace: 'Notifications' },
  { name: 'Email Sent', description: 'Password reset email sent to user', icon: '📧', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Email Opened', description: 'Promotion email opened by subscriber', icon: '📬', color: '#06b6d4', workspace: 'Notifications' },
  { name: 'Email Bounced', description: 'Email failed to deliver to user@example.com', icon: '📭', color: '#ef4444', workspace: 'Notifications' },
  { name: 'Push Sent', description: 'Push notification sent for new message', icon: '📲', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Push Opened', description: 'User opened push notification on mobile device', icon: '👆', color: '#06b6d4', workspace: 'Notifications' },
  { name: 'Push Failed', description: 'Push notification could not be delivered to device', icon: '❌', color: '#ef4444', workspace: 'Notifications' },
  { name: 'SMS Sent', description: 'Promotional SMS sent to user', icon: '📱', color: '#22c55e', workspace: 'Notifications' },
  { name: 'SMS Failed', description: 'SMS delivery failed for user@example.com', icon: '❌', color: '#ef4444', workspace: 'Notifications' },
  { name: 'Reminder Triggered', description: 'Upcoming appointment reminder sent', icon: '⏰', color: '#f59e0b', workspace: 'Notifications' },
  { name: 'Alert Triggered', description: 'High CPU usage alert triggered', icon: '🚨', color: '#dc2626', workspace: 'Notifications' },
  { name: 'Notification Read', description: 'User read in-app notification', icon: '👁️', color: '#06b6d4', workspace: 'Notifications' },
  { name: 'Notification Dismissed', description: 'User dismissed a notification', icon: '✖️', color: '#f59e0b', workspace: 'Notifications' },
  { name: 'Email Scheduled', description: 'Marketing email scheduled for next week', icon: '📅', color: '#22c55e', workspace: 'Notifications' },
  { name: 'Push Scheduled', description: 'Push notification scheduled for campaign', icon: '📆', color: '#22c55e', workspace: 'Notifications' },


  // ===============================
  // Security & Access
  // ===============================
  { name: 'Role Assigned', description: 'Admin role assigned to user', icon: '👑', color: '#22c55e', workspace: 'Security' },
  { name: 'Role Revoked', description: 'Editor role revoked from user', icon: '🪓', color: '#f97316', workspace: 'Security' },
  { name: 'Permission Granted', description: 'Export permission granted', icon: '✅', color: '#06b6d4', workspace: 'Security' },
  { name: 'Permission Revoked', description: 'Delete permission revoked', icon: '❌', color: '#ef4444', workspace: 'Security' },
  { name: 'API Key Created', description: 'New API key generated', icon: '🔐', color: '#8b5cf6', workspace: 'Security' },
  { name: 'API Key Revoked', description: 'API key revoked by admin', icon: '🗑️', color: '#dc2626', workspace: 'Security' },
  { name: 'IP Blocked', description: 'IP 192.168.1.45 blocked', icon: '⛔', color: '#991b1b', workspace: 'Security' },
  { name: 'IP Allowed', description: 'IP 10.0.0.12 allowed', icon: '🟢', color: '#22c55e', workspace: 'Security' },
  { name: 'Suspicious Login', description: 'Suspicious login detected', icon: '🚨', color: '#f59e0b', workspace: 'Security' },
  { name: 'Token Refreshed', description: 'Auth token refreshed', icon: '♻️', color: '#06b6d4', workspace: 'Security' },

  // ===============================
  // Database & Data
  // ===============================
  { name: 'Database Backup', description: 'Nightly database backup completed', icon: '💾', color: '#22c55e', workspace: 'Database' },
  { name: 'Database Restore', description: 'Database restored from snapshot', icon: '♻️', color: '#f59e0b', workspace: 'Database' },
  { name: 'Record Created', description: 'New record created in users table', icon: '🆕', color: '#22c55e', workspace: 'Database' },
  { name: 'Database Backup', description: 'Nightly database backup completed', icon: '💾', color: '#22c55e', workspace: 'Database' },
  { name: 'Database Restore', description: 'Database restored from snapshot', icon: '♻️', color: '#f59e0b', workspace: 'Database' },
  { name: 'Record Created', description: 'New record created in users table', icon: '🆕', color: '#22c55e', workspace: 'Database' },
  { name: 'Record Updated', description: 'Record updated in orders table', icon: '✏️', color: '#6366f1', workspace: 'Database' },
  { name: 'Record Deleted', description: 'Record deleted from logs table', icon: '🗑️', color: '#ef4444', workspace: 'Database' },
  { name: 'Query Executed', description: 'Heavy query executed on analytics DB', icon: '⚡', color: '#8b5cf6', workspace: 'Database' },
  { name: 'Data Sync Started', description: 'Data sync with CRM started', icon: '🔄', color: '#06b6d4', workspace: 'Database' },
  { name: 'Data Sync Completed', description: 'Data sync completed successfully', icon: '✅', color: '#22c55e', workspace: 'Database' },
  { name: 'Index Rebuilt', description: 'Search index rebuilt', icon: '🏗️', color: '#6366f1', workspace: 'Database' },
  { name: 'Schema Updated', description: 'DB schema migration applied', icon: '🛠️', color: '#f97316', workspace: 'Database' },

]
