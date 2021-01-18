// file for attaching all the routes with the express server

const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");

const cartRouter = require("./routers/cart");
const orderRouter = require("./routers/order");
const productRouter = require("./routers/product");
const reviewRouter = require("./routers/review");
const userRouter = require("./routers/user");

const app = express();
const public = path.join(__dirname, "../public");

app.use(express.static(public));
app.use(cookieParser()); // parse all cookies sent
app.use(express.json()); // parse all json sent into objects
app.use(cartRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(reviewRouter);
app.use(userRouter);

module.exports = app;
