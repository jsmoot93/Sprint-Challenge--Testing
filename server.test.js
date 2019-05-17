const request = require("supertest");
const server = require("./server");

describe("Server Testing", () => {
  it("Should res 200 with a welcome messaging on GET /", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome."
    });
  });
});

describe("Data Testing", () => {
  it("Should handle all successful CRUD operations", async () => {
    //Prep
    const game = {
      title: "The Game",
      genre: "Shooter"
    };
    //Test 1. Should respond with an empty array because of no games.
    const first = await request(server).get("/games");
    expect(first.status).toBe(200);
    expect(first.body).toHaveLength(0);

    //Test 2. Should add a game and return all of the games (1).
    const second = await request(server)
      .post("/games")
      .send(game);
    expect(second.status).toBe(200);
    expect(second.body).toHaveLength(1);
    expect(second.body[0].title).toBe("The Game");
    expect(second.body[0].genre).toBe("Shooter");
    expect(second.body[0].id).toBe(0);

    //Test 3. Should not allow the same game to be posted twice.
    const third = await request(server)
      .post("/games")
      .send(game);
    expect(third.status).toBe(405);
    expect(third.body.message).toBe("Already exists.");

    //Test 4. Should get game by ID in object form.
    const fourth = await request(server).get(`/games/${second.body[0].id}`);
    expect(fourth.status).toBe(200);
    expect(fourth.body).toBeTruthy();
    expect(fourth.body.title).toBe("The Game");
    expect(fourth.body.genre).toBe("Shooter");
    expect(fourth.body.id).toBe(0);

    //Test 5. Should delete game by ID and return an empty array of games.
    const fifth = await request(server).delete(`/games/${fourth.body.id}`);
    expect(fifth.status).toBe(200);
    expect(fifth.body).toHaveLength(0);
  });

  it("Should handle all error cases as expected", async () => {
    const game = {
      title: "The Game"
    };

    //Test 1. Should respond about missing field for game post.
    const first = await request(server)
      .post("/games")
      .send(game);
    expect(first.status).toBe(422);
    expect(first.body.message).toBe("Please provide a title and genre.");

    //Test 2. Should respond with 404 for game not found.
    const second = await request(server).get("/games/0");
    expect(second.status).toBe(404);
    expect(second.body.message).toBe("Not found.");

    //Test 3. Should respond with 404 for game not found on delete.
    const third = await request(server).delete("/games/0");
    expect(third.status).toBe(404);
    expect(third.body.message).toBe("Not found.");
  });
});
