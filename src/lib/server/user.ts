import type { RowDataPacket } from 'mysql2';
import db from './db/db';
import type { User } from './db/models';

interface IUser extends User, RowDataPacket {}

export const getUserData = async (user_id: string) => {
	const [rows] = await db.query<IUser[]>('SELECT * FROM users where id=? LIMIT 1', [user_id]);

	return rows?.[0];
};
