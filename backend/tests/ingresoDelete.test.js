const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio deleteIngreso', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta un ingreso de prueba antes de cada caso
    beforeEach(async () => {
        // Limpia datos previos
        await pool.query('DELETE FROM Ingreso WHERE id_usuario = 1');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');

        // Inserta un usuario y un ingreso para las pruebas
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 500, 'testuser', 'testuser@example.com', 'password123'
        ]);
        await pool.query('INSERT INTO Ingreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 200, 'efectivo', '2025-03-24'
        ]);
    });

    it('Debe eliminar un ingreso correctamente', async () => {
        // Obtén el ID del ingreso que se insertó
        const [ingreso] = await pool.query('SELECT id_ingreso FROM Ingreso WHERE id_usuario = ?', [1]);
        const idIngreso = ingreso[0].id_ingreso;

        // Realiza la solicitud DELETE para eliminar el ingreso
        const response = await supertest(server).delete(`/api/ingreso/${idIngreso}`);

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(200);
        expect(response.body).to.include.keys('message');
        expect(response.body.message).to.equal('Ingreso eliminado correctamente');

        // Verifica que el ingreso ya no exista en la base de datos
        const [deletedIngreso] = await pool.query('SELECT * FROM Ingreso WHERE id_ingreso = ?', [idIngreso]);
        expect(deletedIngreso.length).to.equal(0);
    });

    it('Debe devolver un error 404 si el ingreso no existe', async () => {
        const response = await supertest(server).delete('/api/ingreso/999999'); // ID que no existe

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(404);
        expect(response.body).to.include.keys('error');
        expect(response.body.error).to.equal('Ingreso no encontrado');
    });

    // Limpia los datos después de cada caso de prueba
    afterEach(async () => {
        await pool.query('DELETE FROM Ingreso WHERE id_usuario = 1');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');
    });

    // Cierra el servidor después de las pruebas
    after((done) => {
        server.close(() => {
            console.log('✅ Servidor para pruebas cerrado');
            done();
        });
    });
});
