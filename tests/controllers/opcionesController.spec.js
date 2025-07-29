jest.mock("../../config/database", () => ({
  execute: jest.fn(),
}));
const db = require("../../config/database");
const { obtenerOpciones } = require("../../controllers/opcionesController");

describe("opcionesController – obtenerOpciones", () => {
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
      { id: 1, nombre: "Piedra" },
      { id: 2, nombre: "Papel" },
    ];
    // Simula cb(null, results)
    db.execute.mockImplementation((sql, cb) => cb(null, mockResults));

    obtenerOpciones(req, res);

    expect(db.execute).toHaveBeenCalledWith(
      "SELECT * FROM opciones",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  test("500 y JSON con error si falla la BD", () => {
    const error = new Error("fallo en BD");
    // Simula cb(err, null)
    db.execute.mockImplementation((sql, cb) => cb(error, null));

    obtenerOpciones(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener las opciones",
      details: error,
    });
  });
});
