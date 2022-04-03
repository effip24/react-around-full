const express = require("express");
const mongoose = require("mongoose");

const helmet = require("helmet");

const cors = require("cors");

const routes = require("./routes/index");
const { limiter, MONGODB_ADDRESS } = require("./utils/contants");

require("dotenv").config();

mongoose.connect(MONGODB_ADDRESS);
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet());

app.use(cors());
app.options("*", cors());
app.use(limiter);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
