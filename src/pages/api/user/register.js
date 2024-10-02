import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, referralCode } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,  // In real-world apps, hash this!
        referralCode: referralCode || generateReferralCode(),
      },
    });

    return res.status(201).json(newUser);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10);
}