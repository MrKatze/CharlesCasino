process.env.PORT = 4000; // Cambia el puerto para pruebas

const supertest = require('supertest');
const app = require('../dist/server').default; // Accede correctamente a la exportación "default"
const pool = require('../src/database').default; // Conexión a la base de datos
const { expect } = require('chai');

let server; // Instancia del servidor para pruebas

describe('Pruebas del servicio getUsuarios', () => {
    // Antes de todas las pruebas, inicia el servidor
    before((done) => {
        server = app.listen(4000, () => { // Inicia el servidor en el puerto 4000
            console.log('✅ Servidor para pruebas iniciado en http://localhost:4000');
            done();
        });
    });

    // Inserta datos antes de cada prueba
    beforeEach(async () => {
        // Limpia cualquier dato previo en la tabla Usuario
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['testuser']);
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['admin1']); // Opcional: elimina otros usuarios si es necesario

        // Inserta un usuario para la prueba
        await pool.query('INSERT INTO Usuario (id_rol, puntos, username, correo, password) VALUES (?, ?, ?, ?, ?)', [
            1, 100, 'testuser', 'testuser@example.com', 'password123',
        ]);
    });

    // Prueba del servicio getUsuarios
    it('Debe devolver la lista de usuarios correctamente', async () => {
        const response = await supertest(server).get('/api/usuarios'); // Solicita el servicio getUsuarios
        //console.log('Usuarios obtenidos del servicio:', response.body); // Muestra los usuarios en la consola

        expect(response.status).to.equal(200); // Verifica el código de estado de la respuesta
        expect(response.body).to.be.an('array'); // Asegúrate de que la respuesta sea un array

        // Verifica que el usuario esperado esté presente en la respuesta
        const usernames = response.body.map(user => user.username);
        expect(usernames).to.include('testuser'); // Verifica que 'testuser' esté incluido
    });

    // Limpia los datos después de cada prueba
    afterEach(async () => {
        await pool.query('DELETE FROM Usuario WHERE username = ?', ['testuser']);
    });

    // Después de todas las pruebas, cierra el servidor
    after((done) => {
        server.close(() => {
            console.log('✅ Servidor para pruebas cerrado');
            done();
        });
    });
});


//Instalar npm install --save-dev supertest
// npm install --save-dev chai -- aserciones en las pruebas
// npm install --save-dev mocha - para ejecutar pruebas
// MODIFICAMOS EL PACKAJE.JSOON
//"scripts": {
//  "test": "mocha --require ts-node/register tests/**/*.{js,ts} --timeout 10000",
//  "build": "tsc"
// }

// Se exporta el servidor y la base de datos
//Modique ligeramente el servidor.

//Se crea una carpeta tests y ahi van los archivos de prueba con terminacion .js

// Habilitamos un puerto para las pruebas

// se pone .default porque es el objeto que se exporto