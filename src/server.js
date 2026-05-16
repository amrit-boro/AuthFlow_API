require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./index");

// const DB = process.env.DATABASE.replace(
//   "<db_password>",
//   process.env.DATABASE_PASSWORD,
// );

// mongoose.connect(DB).then(() => {
//   console.log("DB connection successful");
// });
const DB = process.env.LOCAL_DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful (local)");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`App is running on PORT ${process.env.PORT}`);
});
