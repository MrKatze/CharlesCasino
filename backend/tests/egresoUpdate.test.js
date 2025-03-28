const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio updateEgreso', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta un egreso y un usuario de prueba antes de cada caso
    beforeEach(async () => {
        // Limpia datos previos
        await pool.query('DELETE FROM Egreso WHERE id_usuario = 1');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');

        // Inserta un usuario y un egreso de prueba
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 1000, 'testuser', 'testuser@example.com', 'password123'
        ]);
        await pool.query('INSERT INTO Egreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 500, 'efectivo', '2025-03-24'
        ]);
    });

    it('Debe actualizar un egreso correctamente', async () => {
        // Obtén el ID del egreso que se insertó
        const [egreso] = await pool.query('SELECT id_egreso FROM Egreso WHERE id_usuario = ?', [1]);
        const idEgreso = egreso[0].id_egreso;

        const updatedEgreso = {
            id_usuario: 1,
            monto: 300,
            metodo: 'tarjeta',
            fecha: '2025-04-01'
        };

        // Realiza la solicitud PUT para actualizar el egreso
        const response = await supertest(server)
            .put(`/api/egreso/${idEgreso}`)
            .send(updatedEgreso);

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(200);
        expect(response.body).to.include.keys('id_egreso', 'id_usuario', 'monto', 'metodo', 'fecha');
        expect(response.body.monto).to.equal(updatedEgreso.monto);
        expect(response.body.metodo).to.equal(updatedEgreso.metodo);
        expect(response.body.fecha).to.equal(updatedEgreso.fecha);
    });

    it('Debe devolver un error 404 si el egreso no existe', async () => {
        const updatedEgreso = {
            id_usuario: 1,
            monto: 300,
            metodo: 'tarjeta',
            fecha: '2025-04-01'
        };

        const response = await supertest(server)
            .put('/api/egreso/999999') // ID que no existe
            .send(updatedEgreso);

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
