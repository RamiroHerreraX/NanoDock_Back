const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/resultadoController", () => ({
  obtenerResultados: jest.fn((req, res) =>
    res.json({ action: "obtenerResultados" })
  ),
  crearResultado: jest.fn((req, res) =>
    res.json({ action: "crearResultado", body: req.body })
  ),
}));

const {
  obtenerResultados,
  crearResultado,
} = require("../../controllers/resultadoController");
const resultadosRoutes = require("../../routes/resultadosRoutes");

describe("routes/resultadosRoutes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/resultados", resultadosRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET  /resultados/all → obtenerResultados", async () => {
    const res = await request(app).get("/resultados/all");
    expect(obtenerResultados).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "obtenerResultados" });
  });

  test("POST /resultados/     → crearResultado", async () => {
    const payload = { nombre: "Test" };
    const res = await request(app).post("/resultados/").send(payload);
    expect(crearResultado).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "crearResultado", body: payload });
  });
});
