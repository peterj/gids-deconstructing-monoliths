"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const port = Number(process.env.PORT) || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const TaxState = {
    WA: '9.17',
    OR: '0',
    ID: '6.03',
    CA: '8.56',
};
app.get('/');
app.post('/tax', (req, res) => {
    const purchaseId = req.body.purchaseId;
    const amount = req.body.amount;
    const state = req.body.state;
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
    return console.log(`monolith is listening on ${port}`);
});
//# sourceMappingURL=app.js.map