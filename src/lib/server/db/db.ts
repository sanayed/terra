import mysql from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';

export default mysql.createPool({
	host: DB_HOST || 'localhost',
	port: parseInt(DB_PORT || '3306'),
	user: DB_USER || 'root',
	password: DB_PASSWORD || '',
	database: DB_NAME || 'terra',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
