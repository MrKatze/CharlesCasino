const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio createEgreso', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta un usuario de prueba antes de cada caso
    beforeEach(async () => {
        // Limpia cualquier dato previo
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');
        await pool.query('DELETE FROM Egreso WHERE id_usuario = 1');
        
        // Inserta un usuario con puntos suficientes para realizar egresos
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 1000, 'testuser', 'testuser@example.com', 'password123'
        ]);
    });

    it('Debe crear un egreso correctamente y actualizar los puntos del usuario', async () => {
        const newEgreso = {
            id_usuario: 1,
            monto: 200,
            metodo: 'tarjeta',
            fecha: '2025-03-24',
            hora: '12:30:00' // Campo obligatorio agregado
        };

        // Realiza la solicitud POST para crear el egreso
        const response = await supertest(server)
            .post('/api/egresos/')
            .send(newEgreso);

        // Verifica la respuesta del servidor
        expect(response.status).to.equal(201);
        expect(response.body).to.include.keys('id_egreso', 'id_usuario', 'monto', 'metodo', 'fecha', 'hora');
        expect(response.body.monto).to.equal(newEgreso.monto);
        expect(response.body.hora).to.equal(newEgreso.hora);

        // Verifica que los puntos del usuario se hayan actualizado correctamente
        const [updatedUser] = await pool.query('SELECT puntos FROM Usuario WHERE id_usuario = ?', [1]);
        expect(updatedUser[0].puntos).to.equal(800); // 1000 - 200 = 800
    });

    // Limpia los datos después de cada caso de prueba
    afterEach(async () => {
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');
        await pool.query('DELETE FROM Egreso WHERE id_usuario = 1');
    });

    // Cierra el servidor después de las pruebas
    after((done) => {
        server.close(() => {
            console.log('✅ Servidor para pruebas cerrado');
            done();
        });
    });
});
