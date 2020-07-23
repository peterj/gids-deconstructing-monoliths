export interface Notifications {
  sendNotification(email: string): Promise<string>;
}

class NotificationSystem implements Notifications {
  sendNotification(email: string): Promise<string> {
    console.log(`\tSending notification to: ${email}`);
    // Send a notification to the customer via email.
    // code code code
    return Promise.resolve('ok');
  }
}

export function newNotificationSystem(): Notifications {
  return new NotificationSystem();
}
