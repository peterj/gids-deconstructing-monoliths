import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const email = req.body.email;
  console.log(`Sending notification to ${email}`);
  res.json('ok');
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`notification service is listening on ${port}`);
});
