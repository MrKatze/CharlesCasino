const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio createUsuario', () => {
    let server;

    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    beforeEach(async () => {
        // Limpia usuarios con el mismo username para evitar conflictos
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['newuser']);
    });

    it('Debe crear un usuario correctamente', async () => {
        const newUser = {
            username: 'newuser',
            correo: 'newuser@example.com',
            password: 'password123',
        };

        const response = await supertest(server)
            .post('/api/usuario/createUsuario')
            .send(newUser);

        expect(response.status).to.equal(201); // Código de estado creado
        expect(response.body).to.include.keys('id_usuario', 'username', 'correo');
        expect(response.body.username).to.equal(newUser.username);
    });

    afterEach(async () => {
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['newuser']);
    });

    after((done) => {
        server.close(() => {
            console.log('✅ Servidor para pruebas cerrado');
            done();
        });
    });
});
