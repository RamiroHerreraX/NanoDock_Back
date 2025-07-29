const request = require("supertest");

// Mocks para no depender de la BD ni de la lógica de los controllers
jest.mock("../config/database", () => ({}));

jest.mock("../controllers/opcionesController", () => ({
  obtenerOpciones: (req, res) => res.status(200).json({ ruta: "opciones" }),
}));
jest.mock("../controllers/resultadoController", () => ({
  obtenerResultados: (req, res) => res.status(200).json({ ruta: "resultados" }),
  crearResultado: (req, res) =>
    res.status(200).json({ ruta: "crearResultado", body: req.body }),
}));
jest.mock("../controllers/partidasController", () => ({
  obtenerPartidas: (req, res) => res.status(200).json({ ruta: "partidas" }),
  obtenerPartidaPorId: (req, res) =>
    res.status(200).json({ ruta: "partidaPorId", id: req.params.id }),
  crearPartida: (req, res) =>
    res.status(200).json({ ruta: "crearPartida", body: req.body }),
  actualizarPartida: (req, res) =>
    res
      .status(200)
      .json({ ruta: "actualizarPartida", id: req.params.id, body: req.body }),
  eliminarPartida: (req, res) =>
    res.status(200).json({ ruta: "eliminarPartida", id: req.params.id }),
  calcularResultado: (req, res) =>
    res.status(200).json({ ruta: "calcularResultado", body: req.body }),
}));

const app = require("../index");

describe("index.js – rutas montadas", () => {
  test("GET  /api/opciones/all       → opciones", async () => {
    const res = await request(app).get("/api/opciones/all");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "opciones" });
  });

  test("GET  /api/resultados/all     → resultados", async () => {
    const res = await request(app).get("/api/resultados/all");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "resultados" });
  });

  test("POST /api/resultados/        → crearResultado", async () => {
    const payload = { nombre: "X" };
    const res = await request(app).post("/api/resultados/").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "crearResultado", body: payload });
  });

  test("GET  /api/partidas/all       → partidas", async () => {
    const res = await request(app).get("/api/partidas/all");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "partidas" });
  });

  test("GET  /api/partidas/part/99   → partidaPorId", async () => {
    const res = await request(app).get("/api/partidas/part/99");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "partidaPorId", id: "99" });
  });

  test("POST /api/partidas/          → crearPartida", async () => {
    const payload = { foo: "bar" };
    const res = await request(app).post("/api/partidas/").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "crearPartida", body: payload });
  });

  test("PUT  /api/partidas/up/7      → actualizarPartida", async () => {
    const payload = { a: 1 };
    const res = await request(app).put("/api/partidas/up/7").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ruta: "actualizarPartida",
      id: "7",
      body: payload,
    });
  });

  test("DELETE /api/partidas/del/8    → eliminarPartida", async () => {
    const res = await request(app).delete("/api/partidas/del/8");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "eliminarPartida", id: "8" });
  });

  test("POST /api/partidas/calcular   → calcularResultado", async () => {
    const payload = { x: 2 };
    const res = await request(app).post("/api/partidas/calcular").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ruta: "calcularResultado", body: payload });
  });
});
