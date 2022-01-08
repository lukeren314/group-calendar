const app = require("../server");
const supertest = require("supertest");

// test our dummy endpoint
test("GET /api/user/sup", async () => {
  await supertest(app)
    .get("/api/user/sup")
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(typeof response.body == "object").toBeTruthy();
      expect(Object.keys(response.body).length).toEqual(1);

      // Check data
      expect(response.body.foo).toBe("bar");
    });
});
