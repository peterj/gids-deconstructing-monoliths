# Branch by abstraction demo

This demo shows an example of the [branch by abstraction pattern](https://martinfowler.com/bliki/BranchByAbstraction.html). There are five steps to this pattern: 

1. Create the abstraction
2. Use the abstraction with the existing implementation
3. Implement the new service
4. Switch the implementation to the new service
5. Clean up the old implementation and abstraction

The abstractions what we will be creating is called `Notifications`. Currently, in the `products` we have a single function called `sendNotification` that sends an email to the provided email (it doesn't really, but let's pretend it does :)). 

We want to extract the `sendNotification` implementation and move it into a separate service called `notification`. 

## 1. Create the abstraction

We will create a new file called `notifications.ts` and create an interface called `Notifications`:

```typescript
export interface Notifications {
    sendNotification(email: string): Promise<string>;
};
```

## 2. Use the abstraction with the existing implementation

Once we have the interface in place we need to search for the places where `sendNotification` is called and replace it with the abstraction.

To do that, we will create a class called `NotificationSystem` that implements the `Notifications` interface.

Open the `notifications.ts` and create a new class called `NotificationSystem` that implements the interface. The implementation of the `sendNotification` function is just copied from the `products.ts`:

```typescript

class NotificationSystem implements Notifications {
  sendNotification(email: string): Promise<string> {
    console.log(`\tSending notification to: ${email}`);
    // Send a notification to the customer via email.
    // code code code
    return Promise.resolve('ok');
  }
}
```

The next step is to create an instance of this class and then invoke the `sendNotification` method, instead of calling the `sendNotification` function in the `products.ts` file. 

We will add another function called `newNotificationSystem` to the `notifications.ts` file. This function instantiates the `NotificationSystem` class and returns the interface. This is the same function where we will implement the feature flags and logic to switch between implementation of the `sendNotification` functionality.

Here's how the `newNotificationSystem` function looks like:

```typescript
export function newNotificationSystem(): Notifications {
  return new NotificationSystem();
}
```

We just create an instance of the `NotificationSystem` and return it. Note that the return type of the function is the interface.

Finally, we need to update all places where `sendNotification` function is being called from and replace it with the new abstraction.

Open `products.ts` and replace two instances of `sendNotification` with the following line:

```typescript
await newNotificationSystem().sendNotification(customerEmail);
```

Since we moved the implementation to the class, we can also remove the `sendNotification` function from the `products.ts` file.

If you run the application it will work exactly the same as before - it's still using the existing implementation, the only difference is that the functionality is behind an abstraction.

## 3. Implement the new service

The new service is implemented in the `notification` folder. It runs on port 3000 and has a single endpoint, `/`, that accepts POST requests with `email` in the body:

```bash
curl -H "content-type: application/json" -X POST -d '{ "email": "hello@example.com" }' localhost:3000
```

Now you can spend time to test the new service and new functionality to make sure it works the same way as the old implementation.

## 4. Switch the implementation

Before we switch to the new implementation we will add a feature flag that will allow us to switch between two implementations. We will use an environment variable called `USE_NOTIFICATION_SYSTEM_SERVICE`. If the environment variable is set to any value, we will use the new notification service. Otherwise, if the value is not set we default to the old, existing implementation. Additonally, we will pass the notification service URL through the `NOTIFICATION_SERVICE_URL` environment variable. 

Let's add the `ServiceNotificationSystem` class that implements `Notifications` and calls the service:

```typescript
class ServiceNotificationSystem implements Notifications {
  async sendNotification(email: string): Promise<string> {
    const serviceUrl = process.env.NOTIFICATION_SERVICE_URL;
    if (serviceUrl === undefined) {
      throw new Error(`NOTIFICATION_SERVICE_URL environment variable is not set`);
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
```

We also need to update the `newNotificationSystem` function to switch between implementations based on the `USE_NOTIFICATION_SYSTEM_SERVICE` environment variable:

```typescript
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
```

You can use the products implementation from the `final-products` folder to try it out. First, start the notification service by running `npm start` from the `notification` folder.

Then, open the `final-products` folder and run it with `npm start`. The app will 'purchase' 5 products (there's a delay between them) and the final output will look like this:

```
App is running
Purchasing product 0
Using existing (old) implementation
        Sending notification to: hello@example.com
Purchasing product 1
Using existing (old) implementation
        Sending notification to: hello@example.com
Purchasing product 2
Using existing (old) implementation
        Sending notification to: hello@example.com
Purchasing product 3
Using existing (old) implementation
        Sending notification to: hello@example.com
Purchasing product 4
Using existing (old) implementation
        Sending notification to: hello@example.com
```

Since we haven't set the environment variables, it will use the old implementation. Let's set the `NOTIFICATION_SERVICE_URL` and `USE_NOTIFICATION_SYSTEM_SERVICE` environment variables to switch to the new implementation:

```
export NOTIFICATION_SERVICE_URL="http://localhost:3000"
export USE_NOTIFICATION_SYSTEM_SERVICE=1
```

If you run the products app this time, you will notice the output saying that the new implementation is used, and you will also see the output from the notification service:

```
# Notification service output
notification service is listening on 3000
Sending notification to hello@example.com
Sending notification to hello@example.com
Sending notification to hello@example.com
Sending notification to hello@example.com
Sending notification to hello@example.com

...

# final-products output
App is running
Purchasing product 0
Using service (new) implementation
Purchasing product 1
Using service (new) implementation
Purchasing product 2
Using service (new) implementation
Purchasing product 3
Using service (new) implementation
Purchasing product 4
Using service (new) implementation
```

## 5. Clean up

As a final step you can clean up the `notifications.ts` file and remove the old class (`NotificationSystem`). Don't forget to remove the use of feature flags in `newNotificationSystem` as well. 