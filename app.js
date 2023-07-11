const express = require("express");
const mongoose = require("mongoose");
const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

mongoose
  .connect(
    "mongodb+srv://doucoder:Passer123@cluster0.f91cbkm.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion a MongoDB reussie"))
  .catch(() => console.log("Connexion a MongoDB echoue"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
