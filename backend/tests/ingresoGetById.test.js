const supertest = require('supertest');
const app = require('../dist/server').default; // Exportación de tu servidor
const pool = require('../src/database').default;
const { expect } = require('chai');

describe('Pruebas del servicio getIngresoById', () => {
    let server;

    // Inicia el servidor antes de las pruebas
    before((done) => {
        server = app.listen(4000, () => {
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta un usuario y un ingreso de prueba antes de cada caso
    beforeEach(async () => {
        // Limpia datos previos
        await pool.query('DELETE FROM Ingreso WHERE id_usuario = 1');
        await pool.query('DELETE FROM Usuario WHERE id_usuario = 1');

        // Inserta un usuario necesario para la relación
        await pool.query('INSERT INTO Usuario (id_usuario, id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?, ?)', [
            1, 2, 500, 'testuser', 'testuser@example.com', 'password123'
        ]);

        // Inserta un ingreso relacionado al usuario
        await pool.query('INSERT INTO Ingreso (id_usuario, monto, metodo, fecha) VALUES (?, ?, ?, ?)', [
            1, 200, 'efectivo', '2025-03-24'
        ]);
    });

    it('Debe devolver un ingreso específico por su ID', async () => {
        // Obtén el ID del ingreso que se insertó
        const [ingreso] = await pool.query('SELECT id_ingreso FROM Ingreso WHERE id_usuario = ?', [1]);
        const idIngreso = ingreso[0].id_ingreso;

        // Realiza la solicitud GET para obtener el ingreso por ID
        const response = await supertest(server).get(`/api/ingresos/${idIngreso}`);
        
        // Verifica la respuesta del servidor
        expect(response.status).to.equal(200);
        expect(response.body).to.include.keys('id_ingreso', 'id_usuario', 'monto', 'metodo', 'fecha');
        expect(response.body.id_ingreso).to.equal(idIngreso);
        expect(Number(response.body.monto)).to.equal(200); // Convierte el monto a número
        expect(response.body.metodo).to.equal('efectivo');
    });

    it('Debe devolver un error 404 si el ingreso no existe', async () => {
        const response = await supertest(server).get('/api/ingresos/999999'); // ID que no existe
        
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
