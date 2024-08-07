// const supertest = require('supertest')
// const app = require('../app')

// describe("/api/v1/healthcheck", () => {
//   test("healthcheck responds successfully", async () => {
//     const req = supertest(app);
//     console.log("req from test: " + req)

//     const res = await req
//       .get("/api/v1/healthcheck")

//     console.log("res from test: " + res.body.name)
//     expect(res.status).toBe(200);
//     expect(res.headers["content-type"]).toMatch(/json/);
//     expect(res.body).toHaveProperty("name");
//     expect(res.body).toHaveProperty("message");
//   });
// });

// describe("/api/v1/healthcheck", () => {
//   test("cannot be a POST request", async () => {
//     const req = supertest(app);
//     const res = await req
//       .post("/api/v1/healthcheck")

//     expect(res.status).toBe(404);
//     expect(res.body).toHaveProperty("error");
//   });
// });
require('dotenv').config()

const supertest = require('supertest');
const app = require('../app');

describe("/", () => {
  test("basic up signal", async () => {
    const req = supertest(app)

    try{
      const res = await req
        .get('/')

      console.log("res.text: " + res.text)        
      await expect(res.status).toEqual(200);
      await expect(res.text).toContain("API is alive!")
    } 
    catch (error) {
      console.error("Error in 0th test: ", error);
    }
  })
})

describe("/api/v1/healthcheck", () => {
  test("healthcheck responds successfully", async () => {
    const req = supertest(app);

    try {
      const res = await req
        .get("/api/v1/healthcheck");
      
      console.log("res from test: ", res.text);
      console.log("process.env.API_VERSION : " + process.env.API_VERSION);

      const res2 = await req
        .get("/api/v/healthcheck");

      console.log("res2 with /api/v/healthcheck: ", res2.text);

      await expect(res.status).toBe(200);
      await expect(res.headers["content-type"]).toMatch(/json/);
      await expect(res.body).toHaveProperty("name");
      await expect(res.body).toHaveProperty("message");
    } catch (error) {
      console.error("Error in 1st test: ", error);
    }
  });
});

describe("/api/v1/healthcheck", () => {
  test("cannot be a POST request", async () => {
    const req = supertest(app);

    try {
      const res = await req.post("/api/v1/healthcheck");
      await expect(res.status).toBe(404);
    } catch (error) {
      console.error("Error in 2nd test: ", error);
    }
  });
});