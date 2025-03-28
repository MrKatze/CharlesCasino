const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio getEgresos', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    beforeEach(async () => {
        // Limpia datos previos
        await pool.query('DELETE FROM Egreso');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');

        // Inserta un usuario necesario para la relación
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 500, 'testuser', 'testuser@example.com', 'password123'
        ]);

        // Inserta egresos de prueba
        await pool.query('INSERT INTO Egreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 500, 'efectivo', '2025-03-24'
        ]);
        await pool.query('INSERT INTO Egreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 300, 'tarjeta', '2025-03-25'
        ]);
    });

    it('Debe devolver todos los egresos', async () => {
        const response = await supertest(server).get('/api/egresos');

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);

        // Verifica los campos de los egresos
        response.body.forEach(egreso => {
            expect(egreso).to.include.keys('id_usuario', 'monto', 'metodo', 'fecha');
        });
    });

    // Limpia los datos después de cada caso de prueba
    afterEach(async () => {
        await pool.query('DELETE FROM Egreso');
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
