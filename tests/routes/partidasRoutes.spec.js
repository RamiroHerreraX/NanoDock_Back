const request = require("supertest");
const express = require("express");

// Mock de los controladores para interceptar llamadas
jest.mock("../../controllers/partidasController", () => ({
  obtenerPartidas: jest.fn((req, res) =>
    res.json({ action: "obtenerPartidas" })
  ),
  obtenerPartidaPorId: jest.fn((req, res) =>
    res.json({ action: "obtenerPartidaPorId", id: req.params.id })
  ),
  crearPartida: jest.fn((req, res) =>
    res.json({ action: "crearPartida", body: req.body })
  ),
  actualizarPartida: jest.fn((req, res) =>
    res.json({ action: "actualizarPartida", id: req.params.id, body: req.body })
  ),
  eliminarPartida: jest.fn((req, res) =>
    res.json({ action: "eliminarPartida", id: req.params.id })
  ),
  calcularResultado: jest.fn((req, res) =>
    res.json({ action: "calcularResultado", body: req.body })
  ),
}));
const {
  obtenerPartidas,
  obtenerPartidaPorId,
  crearPartida,
  actualizarPartida,
  eliminarPartida,
  calcularResultado,
} = require("../../controllers/partidasController");
const partidasRoutes = require("../../routes/partidasRoutes");

describe("routes/partidasRoutes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/partidas", partidasRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET  /partidas/all     → obtenerPartidas", async () => {
    const res = await request(app).get("/partidas/all");
    expect(obtenerPartidas).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "obtenerPartidas" });
  });

  test("GET  /partidas/part/:id → obtenerPartidaPorId", async () => {
    const res = await request(app).get("/partidas/part/123");
    expect(obtenerPartidaPorId).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "obtenerPartidaPorId", id: "123" });
  });

  test("POST /partidas/        → crearPartida", async () => {
    const payload = { foo: "bar" };
    const res = await request(app).post("/partidas/").send(payload);
    expect(crearPartida).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "crearPartida", body: payload });
  });

  test("PUT  /partidas/up/:id  → actualizarPartida", async () => {
    const payload = { a: 1 };
    const res = await request(app).put("/partidas/up/456").send(payload);
    expect(actualizarPartida).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      action: "actualizarPartida",
      id: "456",
      body: payload,
    });
  });

  test("DELETE /partidas/del/:id → eliminarPartida", async () => {
    const res = await request(app).delete("/partidas/del/789");
    expect(eliminarPartida).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "eliminarPartida", id: "789" });
  });

  test("POST /partidas/calcular → calcularResultado", async () => {
    const payload = { x: 2 };
    const res = await request(app).post("/partidas/calcular").send(payload);
    expect(calcularResultado).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "calcularResultado", body: payload });
  });
});
