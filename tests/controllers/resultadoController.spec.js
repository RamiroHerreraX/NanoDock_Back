jest.mock("../../config/database", () => ({
  execute: jest.fn(),
}));
const db = require("../../config/database");
const {
  obtenerResultados,
  crearResultado,
} = require("../../controllers/resultadoController");

describe("resultadoController – obtenerResultados", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    db.execute.mockReset();
  });

  test("200 y devuelve resultados cuando la BD responde correctamente", () => {
    const mockResults = [
      { id: 1, nombre: "Victoria" },
      { id: 2, nombre: "Derrota" },
    ];
    db.execute.mockImplementation((sql, cb) => cb(null, mockResults));

    obtenerResultados(req, res);

    expect(db.execute).toHaveBeenCalledWith(
      "SELECT * FROM resultados",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  test("500 y JSON con error si falla la BD", () => {
    const error = new Error("fallo en BD");
    db.execute.mockImplementation((sql, cb) => cb(error, null));

    obtenerResultados(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener los resultados",
      details: error,
    });
  });
});

describe("resultadoController – crearResultado", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    db.execute.mockReset();
  });

  test('400 si falta el campo "nombre"', () => {
    crearResultado(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El campo "nombre" es obligatorio',
    });
  });

  test("409 si el resultado ya existe (ER_DUP_ENTRY)", () => {
    req.body.nombre = "Empate";
    const err = { code: "ER_DUP_ENTRY" };
    db.execute.mockImplementation((sql, params, cb) => cb(err, null));

    crearResultado(req, res);

    expect(db.execute).toHaveBeenCalledWith(
      "INSERT INTO resultados (nombre) VALUES (?)",
      ["Empate"],
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "El resultado ya existe",
    });
  });

  test("500 si ocurre un error genérico al insertar", () => {
    req.body.nombre = "Nuevo";
    const err = new Error("fail insert");
    db.execute.mockImplementation((sql, params, cb) => cb(err, null));

    crearResultado(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al insertar el resultado",
      details: err,
    });
  });

  test("201 y JSON con id y nombre si OK", () => {
    req.body.nombre = "Victoria";
    const result = { insertId: 55 };
    db.execute.mockImplementation((sql, params, cb) => cb(null, result));

    crearResultado(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resultado creado correctamente",
      id: 55,
      nombre: "Victoria",
    });
  });
});
