import { PurchaseResult } from './types';
import { newNotificationSystem } from './notifications';

export async function purchaseProduct(
  productId: number,
  customerEmail: string
): Promise<PurchaseResult> {
  console.log(`Purchasing product ${productId}`);
  // Code code
  // more code
  await newNotificationSystem().sendNotification(customerEmail);
  // some more code here
  return Promise.resolve({} as PurchaseResult);
}

export async function someOtherWorkflow(customerEmail: string): Promise<void> {
  console.log(`Running some other workflow`);

  // Code code
  // more code

  // Notify the customer about something
  await newNotificationSystem().sendNotification(customerEmail);
  // some more code here
  return Promise.resolve();
}
