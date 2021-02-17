import fetch from 'node-fetch';

export interface Notifications {
  sendNotification(email: string): Promise<string>;
}

class ServiceNotificationSystem implements Notifications {
  async sendNotification(email: string): Promise<string> {
    const serviceUrl = process.env.NOTIFICATION_SERVICE_URL;
    if (serviceUrl === undefined) {
      throw new Error('NOTIFICATION_SERVICE_URL is not set');
    }
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  }
}

export function newNotificationSystem(): Notifications {
    return new ServiceNotificationSystem();
}
