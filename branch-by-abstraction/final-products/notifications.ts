import * as fetch from 'node-fetch';

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

class ServiceNotificationSystem implements Notifications {
  async sendNotification(email: string): Promise<string> {
    const serviceUrl = process.env.NOTIFICATION_SERVICE_URL;
    if (serviceUrl === undefined) {
      throw new Error(
        `NOTIFICATION_SERVICE_URL environment variable is not set`
      );
    }
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return response.json();
  }
}

export function newNotificationSystem(): Notifications {
  const useNotificationSystem = process.env.USE_NOTIFICATION_SYSTEM_SERVICE;

  // If variable is  set -> use the new implementation
  if (useNotificationSystem !== undefined) {
    console.log('Using service (new) implementation');
    return new ServiceNotificationSystem();
  }

  console.log('Using existing (old) implementation');
  return new NotificationSystem();
}
