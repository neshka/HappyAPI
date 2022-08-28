const express = require("express");
const Joi = require("joi");
const config = require("config");
const startupdebugger = require("debug")("app");

const logger = require("./logger.js");
const app = express();
//enable parsing up JSON obj in a body of the req
app.use(express.json());
app.use(logger);

//Configureation
console.log(`Application Name: ${config.get("name")}`);
console.log(`Email: ${config.get("mail.host")}`);
console.log(`Password: ${config.get("mail.password")}`);

if (app.get("env") === "development") {
  startupdebugger("dev env");
}

const port = process.env.PORT || 3000;
const users = [
  { id: 1, name: "user1" },
  { id: 2, name: "user1" },
  { id: 3, name: "user1" },
];

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

app.get("/api/users", (req, res) => {
  res.send(users);
});

app.post("/api/users", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = {
    id: users.length + 1,
    name: req.body.name,
  };

  users.push(user);
  res.send(user);
});

app.put("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  user.name = req.body.name;
  res.send(user);
});

app.delete("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  const index = users.indexOf(user);
  users.splice(index, 1);
  res.send(user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(user);
}
