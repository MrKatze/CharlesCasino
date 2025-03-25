const supertest = require('supertest');
const app = require('../dist/server').default;
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio login', () => {
    let server;

    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    beforeEach(async () => {
        // Limpia datos anteriores y agrega un usuario para pruebas
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['testuser']);
        await pool.query('INSERT INTO Usuario (id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?)', [
            1, 100, 'testuser', 'testuser@example.com', 'password123'
        ]);
    });

    it('Debe hacer login correctamente con credenciales válidas', async () => {
        const loginData = {
            username: 'testuser',
            password: 'password123'
        };

        const response = await supertest(server)
            .post('/api/usuario/login')
            .send(loginData);

        expect(response.status).to.equal(200); // Código de estado OK
        expect(response.body).to.include.keys('id_rol', 'username', 'correo');
        expect(response.body.username).to.equal('testuser');
    });

    it('Debe devolver un error 404 para credenciales incorrectas', async () => {
        const loginData = {
            username: 'wronguser',
            password: 'wrongpassword'
        };

        const response = await supertest(server)
            .post('/api/usuario/login')
            .send(loginData);

        expect(response.status).to.equal(404); // Usuario o contraseña incorrectos
        expect(response.body).to.include.keys('error');
    });

    afterEach(async () => {
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['testuser']);
    });

    after((done) => {
        server.close(() => {
            console.log('✅ Servidor para pruebas cerrado');
            done();
        });
    });
});
