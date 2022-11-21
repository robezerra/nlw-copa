import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			avatarUrl: 'https://avatars.dicebear.com/api/adventurer/john-doe.svg',
		},
	});

	const pool = await prisma.pool.create({
		data: {
			title: 'My first pool',
			code: 'BOL123',
			ownerId: user.id,

			participants: {
				create: {
					userId: user.id,
				},
			},
		},
	});

	await prisma.game.create({
		data: {
			date: '2022-11-18T12:00:00.173Z',
			firstTeamCountryCode: 'DE',
			secondTeamCountryCode: 'BR',
		},
	});

	await prisma.game.create({
		data: {
			date: '2022-11-24T11:00:00.000Z',
			firstTeamCountryCode: 'BR',
			secondTeamCountryCode: 'AR',

			guesses: {
				create: {
					firstTeamGoals: 10,
					secondTeamGoals: 0,

					participant: {
						connect: {
							userId_poolId: {
								userId: user.id,
								poolId: pool.id,
							},
						},
					},
				},
			},
		},
	});
}

main();
