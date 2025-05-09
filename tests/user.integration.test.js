const request = require("supertest")
const app = require("../users-service/users/app")

describe("users crud", ()=>{

    it("should create a user", async ()=>{
        const res = await request(app).post("/v1/users").send({body:{
        "first_name":"shahd",
        "last_name":"hossam",
        "email":"shahd@gmail.com",
        "password":"shahd123"}})
        console.log(res)
        expect(res.statusCode).toBe(200)
    })

    it("should get a user", async ()=>{
        const res = await request(app).get("/v1/users/1")
        expect(res.statusCode).toBe(200)
    })

    it("should delete a user", async ()=>{
        const res = await request(app).delete("/v1/users/1")
        expect(res.statusCode).toBe(200)
    })
})

