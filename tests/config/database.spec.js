describe("config/database", () => {
  const originalEnv = { ...process.env };

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.resetModules();
  });

  test("en ENV=test exporta stub con execute mockResolvedValue", async () => {
    process.env.NODE_ENV = "test";
    const db = require("../../config/database");
    // debe exponer execute como mock y no exponer connect
    expect(typeof db.execute).toBe("function");
    expect(db.execute._isMockFunction).toBe(true);
    expect(db.connect).toBeUndefined();
    // execute devuelve Promise<[[],[]]>
    await expect(db.execute("SQL")).resolves.toEqual([[], []]);
  });

  test("en ENV≠test crea conexión real con mysql2", () => {
    process.env.NODE_ENV = "development";
    process.env.DB_HOST = "host";
    process.env.DB_PORT = "1234";
    process.env.DB_USER = "user";
    process.env.DB_PASSWORD = "pass";
    process.env.DB_NAME = "db";
    // mock de mysql2.createConnection
    const mysql = require("mysql2");
    mysql.createConnection = jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      execute: jest.fn(),
    }));

    const db = require("../../config/database");
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: "host",
      port: "1234",
      user: "user",
      password: "pass",
      database: "db",
      charset: "utf8mb4",
    });
    // en este modo debe exponer connect y execute
    expect(typeof db.connect).toBe("function");
    expect(typeof db.execute).toBe("function");
  });

  test("en ENV≠test, si connect() falla, llama a console.error y no a console.log", () => {
    // Preparamos el entorno
    process.env.NODE_ENV = "development";
    process.env.DB_HOST = "host";
    process.env.DB_PORT = "1234";
    process.env.DB_USER = "user";
    process.env.DB_PASSWORD = "pass";
    process.env.DB_NAME = "db";

    // Mock de mysql2
    const mysql = require("mysql2");
    mysql.createConnection = jest.fn(() => ({
      // Simula error en el callback
      connect: jest.fn((cb) => cb(new Error("fail"))),
      execute: jest.fn(),
    }));

    // Espejos en consola
    const spyError = jest.spyOn(console, "error").mockImplementation(() => {});
    const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});

    // Importamos el módulo (ejecuta el connect)
    require("../../config/database");

    expect(spyError).toHaveBeenCalledWith(
      "❌ Error al conectar a la base de datos:",
      "fail"
    );
    // comprobamos que NO se haya llamado exactamente al mensaje de éxito
    expect(spyLog).not.toHaveBeenCalledWith(
      "✅ Conexión a la base de datos MySQL establecida"
    );

    spyError.mockRestore();
    spyLog.mockRestore();
  });
});
