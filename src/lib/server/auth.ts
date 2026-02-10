import { v4 } from 'uuid';
import db from './db/db';
import type { User } from './db/models';
import { compare, hash } from 'bcrypt';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';

export type AccessTokenUser = Pick<User, 'id' | 'email' | 'username' | 'fullname'>;
const secure = false;

export const createUser = async ({
	email,
	username,
	fullname,
	password
}: Pick<User, 'email' | 'username' | 'fullname' | 'password'> & {
	password: string;
}) => {
	const password_hash = await hash(password, 10);
	const user_id = v4();
	await db.query(
		'INSERT INTO users (id, email, username, fullname, password_hash) VALUES (?, ?, ?, ?, ?)',
		[user_id, email, username, fullname, password_hash]
	);

	return makeTokens({ id: user_id, email, username, fullname });
};

export const verifyUser = async ({ email, password }: { email: string; password: string }) => {
	const user = await findUserByEmail(email);
	if (!user || !(await compare(password, user.password_hash))) throw Error('Invalid credentials');
	return makeTokens({
		id: user.id,
		email: user.email,
		username: user.username,
		fullname: user.fullname
	});
};

export const verifyAccessToken = (token: string): Promise<JwtPayload | string> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, ACCESS_TOKEN_SECRET as string, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded as JwtPayload | string);
			}
		});
	});
};

export const verifyRefreshToken = (token: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, REFRESH_TOKEN_SECRET as string, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded as JwtPayload | string);
			}
		});
	});
};

export const setCookie = (
	cookies: Cookies,
	{ accessToken, refreshToken }: { accessToken: string; refreshToken: string }
) => {
	cookies.set('accessToken', accessToken, {
		secure,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	});

	cookies.set('refreshToken', refreshToken, {
		secure,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		maxAge: 60 * 60 * 24 * 30
	});
};

const findUserByEmail = async (email: string): Promise<User | undefined> => {
	const [rows] = await db.query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
	return rows[0];
};

const generateAccessToken = (user: AccessTokenUser) =>
	jwt.sign(user, ACCESS_TOKEN_SECRET as string, { expiresIn: '30m' });

const generateRefreshToken = (user: AccessTokenUser) =>
	jwt.sign(user, REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

export const makeTokens = ({ id, email, username, fullname }: AccessTokenUser) => {
	const accessToken = generateAccessToken({ id, email, username, fullname });
	const refreshToken = generateRefreshToken({
		id,
		email,
		username,
		fullname
	});

	return [accessToken, refreshToken];
};
