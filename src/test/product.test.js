// tests/products.test.js

import request from "supertest"
import jwt from "jsonwebtoken"
import { server } from "../app.js"
import { Product } from "../models/ProductModel.js"

describe("GET /products", () => {
  it("debe devolver solo los productos del usuario autenticado", async () => {
    // Crear token de prueba
    const token = jwt.sign(
      {
        id: "685123456789012345678901",
        email: "test@test.com"
      },
      "contraseñasupersegurayprivadaquenadietienequeconocer", { expiresIn: "1h" }
    )

    // Mock de Product.find
    jest.spyOn(Product, "find").mockResolvedValue([
      {
        _id: "1",
        name: "Notebook",
        price: 1000,
        category: "Tecnología",
        stock: 10,
        available: true
      }
    ])

    const response = await request(server)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      success: true,
      data: [
        {
          _id: "1",
          name: "Notebook",
          price: 1000,
          category: "Tecnología",
          stock: 10,
          available: true
        }
      ],
      message: "Producst fetched successfully"
    })

    expect(Product.find).toHaveBeenCalledWith(
      { userId: "685123456789012345678901" },
      { userId: 0 }
    )
  })
})