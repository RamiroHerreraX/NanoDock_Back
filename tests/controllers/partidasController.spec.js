jest.mock("../../config/database", () => ({
  execute: jest.fn(),
}));
const db = require("../../config/database");
const {
  obtenerPartidas,
  obtenerPartidaPorId,
  crearPartida,
  actualizarPartida,
  eliminarPartida,
  calcularResultado,
} = require("../../controllers/partidasController");

describe("PartidasController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    db.execute.mockReset();
  });

  describe("calcularResultado", () => {
    test("400 si faltan parámetros", () => {
      calcularResultado(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Faltan parámetros" });
    });

    test("empate cuando idUsuario === idCpu", () => {
      req.body = { idUsuario: 2, idCpu: 2 };
      calcularResultado(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 3 });
    });

    test("victoria del usuario", () => {
      req.body = { idUsuario: 1, idCpu: 3 };
      calcularResultado(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test("victoria cuando idUsuario === 2 y idCpu === 1", () => {
      req.body = { idUsuario: 2, idCpu: 1 };
      calcularResultado(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test("victoria cuando idUsuario === 3 y idCpu === 2", () => {
      req.body = { idUsuario: 3, idCpu: 2 };
      calcularResultado(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test("derrota del usuario", () => {
      req.body = { idUsuario: 1, idCpu: 2 };
      calcularResultado(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });
  });

  describe("obtenerPartidas", () => {
    test("200 y devuelve resultados", () => {
      const rows = [{ id: 1 }];
      db.execute.mockImplementation((sql, cb) => cb(null, rows));
      obtenerPartidas(req, res);
      expect(res.json).toHaveBeenCalledWith(rows);
    });

    test("500 si falla la BD", () => {
      const err = new Error("fail");
      db.execute.mockImplementation((sql, cb) => cb(err, null));
      obtenerPartidas(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al obtener partidas",
        details: err,
      });
    });
  });

  describe("obtenerPartidaPorId", () => {
    test("200 si encuentra partida", () => {
      req.params.id = 5;
      const rows = [{ id: 5 }];
      db.execute.mockImplementation((sql, params, cb) => cb(null, rows));
      obtenerPartidaPorId(req, res);
      expect(res.json).toHaveBeenCalledWith(rows[0]);
    });

    test("404 si no existe", () => {
      req.params.id = 5;
      db.execute.mockImplementation((sql, params, cb) => cb(null, []));
      obtenerPartidaPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Partida no encontrada" });
    });

    test("500 si falla la BD", () => {
      const err = new Error("fail");
      db.execute.mockImplementation((sql, params, cb) => cb(err, null));
      obtenerPartidaPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al obtener la partida",
        details: err,
      });
    });
  });

  describe("crearPartida", () => {
    test("400 si faltan datos obligatorios", () => {
      crearPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Faltan datos obligatorios",
      });
    });

    test("500 si falla la BD", () => {
      req.body = { id_opcion_usuario: 1, id_opcion_cpu: 2, id_resultado: 3 };
      const err = new Error("fail");
      db.execute.mockImplementation((sql, params, cb) => cb(err, null));
      crearPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al crear partida",
        details: err,
      });
    });

    test("201 si inserta correctamente", () => {
      req.body = { id_opcion_usuario: 1, id_opcion_cpu: 2, id_resultado: 3 };
      const result = { insertId: 42 };
      db.execute.mockImplementation((sql, params, cb) => cb(null, result));
      crearPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Partida creada correctamente",
        id: 42,
      });
    });
  });

  describe("actualizarPartida", () => {
    test("400 si faltan datos obligatorios", () => {
      req.params.id = 1;
      actualizarPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Faltan datos obligatorios",
      });
    });

    test("500 si falla la BD", () => {
      req.params.id = 1;
      req.body = { id_opcion_usuario: 1, id_opcion_cpu: 2, id_resultado: 3 };
      const err = new Error("fail");
      db.execute.mockImplementation((sql, params, cb) => cb(err, null));
      actualizarPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al actualizar partida",
        details: err,
      });
    });

    test("404 si no existe", () => {
      req.params.id = 1;
      req.body = { id_opcion_usuario: 1, id_opcion_cpu: 2, id_resultado: 3 };
      db.execute.mockImplementation((sql, params, cb) =>
        cb(null, { affectedRows: 0 })
      );
      actualizarPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Partida no encontrada" });
    });

    test("200 si actualiza correctamente", () => {
      req.params.id = 1;
      req.body = { id_opcion_usuario: 1, id_opcion_cpu: 2, id_resultado: 3 };
      db.execute.mockImplementation((sql, params, cb) =>
        cb(null, { affectedRows: 1 })
      );
      actualizarPartida(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Partida actualizada correctamente",
      });
    });
  });

  describe("eliminarPartida", () => {
    test("500 si falla la BD", () => {
      req.params.id = 1;
      const err = new Error("fail");
      db.execute.mockImplementation((sql, params, cb) => cb(err, null));
      eliminarPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al eliminar partida",
        details: err,
      });
    });

    test("404 si no existe", () => {
      req.params.id = 1;
      db.execute.mockImplementation((sql, params, cb) =>
        cb(null, { affectedRows: 0 })
      );
      eliminarPartida(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Partida no encontrada" });
    });

    test("200 si elimina correctamente", () => {
      req.params.id = 1;
      db.execute.mockImplementation((sql, params, cb) =>
        cb(null, { affectedRows: 1 })
      );
      eliminarPartida(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Partida eliminada correctamente",
      });
    });
  });
});
