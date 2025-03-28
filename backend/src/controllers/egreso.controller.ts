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
      const { id_usuario, monto, metodo, fecha }: Egreso = req.body;
  
      // Iniciar la transacción
      await connection.beginTransaction();
  
      // Insertar el nuevo egreso
      const [result] = await connection.query(
        'INSERT INTO Egreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)',
        [id_usuario, monto, metodo, fecha]
      );
  
      // Restar el monto al saldo del usuario
      await connection.query(
        'UPDATE Usuario SET puntos = puntos - ? WHERE id_usuario = ?',
        [monto, id_usuario]
      );
  
      // Confirmar la transacción
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
    const { id_usuario, monto, metodo, fecha }: Egreso = req.body;

    const [result] = await pool.query(
      'UPDATE Egreso SET id_usuario = ?, monto = ?, metodo = ?, fecha = ? WHERE id_egreso = ?',
      [id_usuario, monto, metodo, fecha, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Egreso no encontrado" });
    }

    res.json({ id_egreso: id, id_usuario, monto, metodo, fecha });
  } catch (error) {
    console.error("❌ Error al actualizar egreso:", error);
    res.status(500).json({ error: "Error al actualizar egreso" });
  }
};

// Eliminar un egreso
export const deleteEgreso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Egreso WHERE id_egreso = ?', [id]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "Egreso no encontrado" });
    }

    res.json({ message: "Egreso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar egreso:", error);
    res.status(500).json({ error: "Error al eliminar egreso" });
  }
};
