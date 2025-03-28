import { Request, Response } from 'express';
import pool from '../database';
import { Usuario } from '../models/usuario.model';

export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    req.body.id_rol = 2;
    req.body.puntos = 0;
    const { id_rol, puntos, username, correo, password }: Usuario = req.body;
    console.log(id_rol, puntos, username, correo, password);
    const [result] = await pool.query(
      'INSERT INTO Usuario (id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?)',
      [id_rol, puntos, username, correo, password]
    );
    res.status(201).json({ id_usuario: (result as any).insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: Usuario = req.body;
    
    // Verificar que username y password no estén vacíos
    if (!username || !password) {
      res.status(400).json({ error: "Username y password son requeridos" });
      return;
    }

    const [rows]: any = await pool.query(
      'SELECT * FROM Usuario WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error al hacer login" });
  }
};