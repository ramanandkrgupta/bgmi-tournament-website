import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { teamName, players } = req.body;

    const newTeam = await prisma.team.create({
      data: {
        teamName,
        teamCode: generateTeamCode(),
        players: {
          create: players.map(player => ({
            userId: player.userId,
            role: player.role,
          }))
        }
      }
    });

    res.status(201).json(newTeam);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8);
}