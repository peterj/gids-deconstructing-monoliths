"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
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
//# sourceMappingURL=app.js.map