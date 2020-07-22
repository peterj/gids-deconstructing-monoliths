import { purchaseProduct } from './products';
import { sleep } from './util';

console.log('App is running');

const main = async () => {
  for (let i = 0; i < 5; i++) {
    await purchaseProduct(i, 'hello@example.com');
    await sleep();
  }
};

main();
