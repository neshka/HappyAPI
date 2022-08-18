const express = require("express");
const app = express();

//enable parsing up JSON obj in a body of the req
app.use(express.json());

const port = process.env.PORT || 3000;
const users = [
  { id: 1, name: "user1" },
  { id: 2, name: "user1" },
  { id: 3, name: "user1" },
];

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) res.send("User not found").status(404);
  res.send(req.query);
});

app.get("/api/users", (req, res) => {
  res.send(users);
});

app.post("/api/users", (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(user);
  res.send(user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
