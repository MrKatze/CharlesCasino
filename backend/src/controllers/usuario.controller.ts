import { Request, Response } from 'express';
import pool from '../database';
import { Usuario } from '../models/usuario.model';

export const getUsuarios = async (req: Request, res: Response) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Usuario');
      res.json(rows);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  };
  
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { id_rol, puntos, username, correo, password }: Usuario = req.body;
    const [result] = await pool.query(
      'INSERT INTO Usuario (id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?)',
      [id_rol, puntos, username, correo, password]
    );
    res.status(201).json({ id_usuario: (result as any).insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};
