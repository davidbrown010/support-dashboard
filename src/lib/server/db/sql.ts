import { SECRET_DATABASE_HOST, SECRET_DATABASE_USERNAME, SECRET_DATABASE_PASSWORD } from '$env/static/private';
import mysql from 'mysql2';
import type { RowDataPacket } from 'mysql2';

export const connect = () => {
    const connection = mysql.createConnection(SECRET_DATABASE_HOST)
    console.log('Connected to PlanetScale!')
    // SHOW
    connection.query<RowDataPacket[]>('SELECT * FROM donors', (_err, rows) => {
        console.log(rows);
    });
    connection.end()
}

