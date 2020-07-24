import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const TaxState = {
  WA: '9.17',
  OR: '0',
  // This value is intentionally different from the monolith code to simulate
  // a bug in the service that can be caught through traffic mirroring
  ID: '16.03',
  CA: '8.56',
  // To fail intentionally.
  XX: 'XX',
};

app.post('/tax', (req, res) => {
  const purchaseId = req.body.purchaseId;
  const amount = req.body.amount;
  const state = req.body.state;

  // Simulate an error from the service
  if (state === 'XX') {
    throw new Error('unexpected error occurred');
  }

  const taxRate = TaxState[state];
  const total = amount + amount * (taxRate / 100);
  const totalFixed = total.toFixed(2);

  const result = {
    purchaseId,
    state,
    amount,
    taxRate,
    total: totalFixed,
  };
  console.log(result);
  res.json(result);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`tax service is listening on ${port}`);
});
