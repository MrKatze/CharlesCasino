import { Request, Response, NextFunction } from 'express';
import pool from '../database';
import { Ingreso } from '../models/ingreso.model';

// Obtener todos los ingresos
export const getIngresos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM Ingreso');
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener ingresos:", error);
    res.status(500).json({ error: "Error al obtener ingresos" });
  }
};

// Crear un nuevo ingreso
export const createIngreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const { id_usuario, monto, metodo, fecha, hora }: Ingreso = req.body;

    // Validar que se envían todos los campos obligatorios
    if (!id_usuario || !monto || !metodo || !fecha || !hora) {
      res.status(400).json({ error: "Todos los campos son obligatorios: id_usuario, monto, metodo, fecha, hora" });
      return;
    }

    // Iniciar la transacción
    await connection.beginTransaction();

    // Insertar el nuevo ingreso
    const [result] = await connection.query(
      'INSERT INTO Ingreso (id_usuario, monto, metodo, fecha, hora) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, monto, metodo, fecha, hora]
    );

    // Actualizar el saldo del usuario
    await connection.query(
      'UPDATE Usuario SET puntos = puntos + ? WHERE id_usuario = ?',
      [monto, id_usuario]
    );

    // Confirmar la transacción
    await connection.commit();

    res.status(201).json({ id_ingreso: (result as any).insertId, ...req.body });
  } catch (error) {
    // Revertir en caso de error
    await connection.rollback();
    console.error("❌ Error al crear ingreso:", error);
    res.status(500).json({ error: "Error al crear ingreso" });
  } finally {
    connection.release();
  }
};



// Obtener un ingreso por su ID
export const getIngresoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM Ingreso WHERE id_ingreso = ?', [id]);

    if ((rows as any).length === 0) {
      res.status(404).json({ error: "Ingreso no encontrado" });
      return;
    }

    res.json((rows as any)[0]);
  } catch (error) {
    console.error("❌ Error al obtener ingreso:", error);
    res.status(500).json({ error: "Error al obtener ingreso" });
  }
};

// Obtener ingresos por ID de usuario
export const getIngresosByUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const [rows] = await pool.query('SELECT * FROM Ingreso WHERE id_usuario = ?', [id_usuario]);

    if ((rows as any).length === 0) {
      res.status(404).json({ error: "Ingresos no encontrados para este usuario" });
    }

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener ingresos por usuario:", error);
    res.status(500).json({ error: "Error al obtener ingresos por usuario" });
  }
};

// Actualizar un ingreso
export const updateIngreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { id_usuario, monto, metodo, fecha }: Ingreso = req.body;

    const [result] = await pool.query(
      'UPDATE Ingreso SET id_usuario = ?, monto = ?, metodo = ?, fecha = ? WHERE id_ingreso = ?',
      [id_usuario, monto, metodo, fecha, id]
    );

    // Si no se afectaron filas, significa que el ingreso no existe
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Ingreso no encontrado" });
      return; // Detiene la ejecución aquí
    }

    // Respuesta si la actualización fue exitosa
    res.status(200).json({ id_ingreso: id, id_usuario, monto, metodo, fecha });
  } catch (error) {
    console.error("❌ Error al actualizar ingreso:", error);

    // Manejo de errores inesperados, evitando múltiples respuestas
    if (!res.headersSent) {
      res.status(500).json({ error: "Error al actualizar ingreso" });
    }
  }
};


// Eliminar un ingreso
export const deleteIngreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Ingreso WHERE id_ingreso = ?', [id]);

    // Verifica si se eliminó algún registro
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Ingreso no encontrado" });
      return; // Detener el flujo aquí
    }

    // Respuesta si la eliminación fue exitosa
    res.status(200).json({ message: "Ingreso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar ingreso:", error);

    // Enviar una respuesta de error solo si no se ha enviado previamente
    if (!res.headersSent) {
      res.status(500).json({ error: "Error al eliminar ingreso" });
    }
  }
};

