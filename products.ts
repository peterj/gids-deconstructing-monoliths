import { PurchaseResult } from './types';

async function sendNotification(email: string): Promise<void> {
  console.log(`\tSending notification to: ${email}`);
  // Send a notification to the customer via email.
  // code code code
  return Promise.resolve();
}

export async function purchaseProduct(
  productId: number,
  customerEmail: string
): Promise<PurchaseResult> {
  console.log(`Purchasing product ${productId}`);
  // Code code
  // more code
  await sendNotification(customerEmail);
  // some more code here
  return Promise.resolve({} as PurchaseResult);
}

export async function someOtherWorkflow(customerEmail: string): Promise<void> {
  console.log(`Running some other workflow`);

  // Code code
  // more code

  // Notify the customer about something
  await sendNotification(customerEmail);
  // some more code here
  return Promise.resolve();
}
