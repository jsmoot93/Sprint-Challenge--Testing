const express = require("express");
const server = express();

//Middleware
server.use(express.json());

//Routes Middleware
server.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome."
  });
});

server.get("/games", (req, res) => {
  res.status(200).json(gameData);
});

let nextId = 0;
server.post("/games", ({ body: game }, res) => {
  if (game.title && game.genre) {
    const copy = gameData.filter(cur => cur.title === game.title);
    if (copy.length > 0) {
      res.status(405).json({ message: "Already exists." });
    } else {
      gameData = [
        ...gameData,
        {
          id: nextId,
          ...game
        }
      ];
      nextId++;
      res.status(200).json(gameData);
    }
  } else {
    res.status(422).json({ message: "Please provide a title and genre." });
  }
});

server.get("/games/:id", ({ params: { id } }, res) => {
  const [game] = gameData.filter(cur => cur.id == id);
  if (game) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ message: "Not found." });
  }
});

server.delete("/games/:id", ({ params: { id } }, res) => {
  const [game] = gameData.filter(cur => cur.id == id);
  if (game) {
    gameData = gameData.filter(cur => cur.id != id);
    res.status(200).json(gameData);
  } else {
    res.status(404).json({ message: "Not found." });
  }
});

let gameData = [];

module.exports = server;
