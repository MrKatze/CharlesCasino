const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio deleteEgreso', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta un egreso de prueba antes de cada caso
    beforeEach(async () => {
        // Limpia datos previos
        await pool.query('DELETE FROM Egreso WHERE id_usuario = 1');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');

        // Inserta un usuario y un egreso para las pruebas
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 1000, 'testuser', 'testuser@example.com', 'password123'
        ]);
        await pool.query('INSERT INTO Egreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 500, 'efectivo', '2025-03-24'
        ]);
    });

    it('Debe eliminar un egreso correctamente', async () => {
        // Obtén el ID del egreso que se insertó
        const [egreso] = await pool.query('SELECT id_egreso FROM Egreso WHERE id_usuario = ?', [1]);

        // Verifica que se haya insertado un egreso
        expect(egreso.length).to.be.greaterThan(0);

        const idEgreso = egreso[0].id_egreso;

        // Realiza la solicitud DELETE para eliminar el egreso
        const response = await supertest(server).delete(`/api/egresos/${idEgreso}`);

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(200);
        expect(response.body).to.include.keys('message');
        expect(response.body.message).to.equal('Egreso eliminado correctamente');

        // Verifica que el egreso ya no exista en la base de datos
        const [deletedEgreso] = await pool.query('SELECT * FROM Egreso WHERE id_egreso = ?', [idEgreso]);
        expect(deletedEgreso.length).to.equal(0);
    });

    it('Debe devolver un error 404 si el egreso no existe', async () => {
        const response = await supertest(server).delete('/api/egresos/999999'); // ID que no existe
        
        // Verifica la respuesta del servidor
        expect(response.status).to.equal(404);
        expect(response.body).to.include.keys('error');
        expect(response.body.error).to.equal('Egreso no encontrado');
    });

    // Limpia los datos después de cada caso de prueba
    afterEach(async () => {
        await pool.query('DELETE FROM Egreso WHERE id_usuario = 1');
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
