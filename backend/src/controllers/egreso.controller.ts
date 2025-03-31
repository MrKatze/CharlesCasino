import { Request, Response, NextFunction } from 'express';
import pool from '../database';
import { Egreso } from '../models/egreso.model';

// Obtener todos los egresos
export const getEgresos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM Egreso');
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener egresos:", error);
    res.status(500).json({ error: "Error al obtener egresos" });
  }
};

// Crear un nuevo egreso
export const createEgreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const { id_usuario, monto, metodo, fecha, hora }: Egreso = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!id_usuario || !monto || !metodo || !fecha || !hora) {
      res.status(400).json({ error: "Todos los campos son obligatorios: id_usuario, monto, metodo, fecha, hora" });
      return;
    }

    // Iniciar transacción
    await connection.beginTransaction();

    // Insertar el egreso
    const [result] = await connection.query(
      'INSERT INTO Egreso (id_usuario, monto, metodo, fecha, hora) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, monto, metodo, fecha, hora]
    );

    // Actualizar puntos del usuario
    await connection.query(
      'UPDATE Usuario SET puntos = puntos - ? WHERE id_usuario = ?',
      [monto, id_usuario]
    );

    // Confirmar transacción
    await connection.commit();

    res.status(201).json({ id_egreso: (result as any).insertId, ...req.body });
  } catch (error) {
    // Revertir en caso de error
    await connection.rollback();
    console.error("❌ Error al crear egreso:", error);
    res.status(500).json({ error: "Error al crear egreso" });
  } finally {
    connection.release();
  }
};


// Obtener un egreso por su ID
export const getEgresoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM Egreso WHERE id_egreso = ?', [id]);

    if ((rows as any).length === 0) {
      res.status(404).json({ error: "Egreso no encontrado" });
      return;
    }

    res.json((rows as any)[0]);
  } catch (error) {
    console.error("❌ Error al obtener egreso:", error);
    res.status(500).json({ error: "Error al obtener egreso" });
  }
};

// Obtener egresos por ID de usuario
export const getEgresosByUserID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const [rows] = await pool.query('SELECT * FROM Egreso WHERE id_usuario = ?', [id_usuario]);

    if ((rows as any).length === 0) {
      res.status(404).json({ error: "Egresos no encontrados para este usuario" });
    }

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener egresos por usuario:", error);
    res.status(500).json({ error: "Error al obtener egresos por usuario" });
  }
};

// Actualizar un egreso
export const updateEgreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { id_usuario, monto, metodo, fecha, hora }: Egreso = req.body;

    const [result] = await pool.query(
      'UPDATE Egreso SET id_usuario = ?, monto = ?, metodo = ?, fecha = ?, hora = ? WHERE id_egreso = ?',
      [id_usuario, monto, metodo, fecha, hora, id]
    );

    // Si no se afectaron filas, significa que el egreso no existe
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Egreso no encontrado" });
      return; // Detener la ejecución aquí
    }

    // Respuesta si la actualización fue exitosa
    res.status(200).json({ id_egreso: id, id_usuario, monto, metodo, fecha, hora });
  } catch (error) {
    console.error("❌ Error al actualizar egreso:", error);

    // Enviar respuesta de error solo si no se han enviado encabezados
    if (!res.headersSent) {
      res.status(500).json({ error: "Error al actualizar egreso" });
    }
  }
};


// Eliminar un egreso
export const deleteEgreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Egreso WHERE id_egreso = ?', [id]);

    // Verifica si el egreso fue encontrado y eliminado
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Egreso no encontrado" });
      return; // Detener la ejecución después de enviar la respuesta
    }

    // Responder si la eliminación fue exitosa
    res.status(200).json({ message: "Egreso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar egreso:", error);

    // Asegura que no se envíen múltiples respuestas
    if (!res.headersSent) {
      res.status(500).json({ error: "Error al eliminar egreso" });
    }
  }
};

