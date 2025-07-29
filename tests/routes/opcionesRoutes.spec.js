const request = require("supertest");
const express = require("express");

// Mockeamos el controller para controlar la respuesta
jest.mock("../../controllers/opcionesController", () => ({
  obtenerOpciones: jest.fn((req, res) => res.json({ mocked: true })),
}));
const { obtenerOpciones } = require("../../controllers/opcionesController");
const opcionesRoutes = require("../../routes/opcionesRoutes");

describe("routes/opcionesRoutes", () => {
  let app;

  beforeAll(() => {
    app = express();
    // Montamos el router bajo el path /opciones
    app.use("/opciones", opcionesRoutes);
  });

  test("GET /opciones/all debe invocar obtenerOpciones y devolver JSON", async () => {
    const res = await request(app).get("/opciones/all");
    expect(obtenerOpciones).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ mocked: true });
  });
});
