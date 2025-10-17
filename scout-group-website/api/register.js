import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'scout-forum'; // reuse existing DB

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);

    const b = req.body || {};

    // Minimal validation
    const childName = (b.childName || '').toString().trim().slice(0, 120);
    const childSurname = (b.childSurname || '').toString().trim().slice(0, 160);
    const childBirthdate = (b.childBirthdate || '').toString().trim();
    const childGender = (b.childGender || '').toString().trim().slice(0, 20);
    const section = (b.section || '').toString().trim().slice(0, 30);
    const healthInfo = (b.healthInfo || '').toString().trim().slice(0, 2000);

    const guardianName = (b.guardianName || '').toString().trim().slice(0, 160);
    const guardianRelation = (b.guardianRelation || '').toString().trim().slice(0, 40);
    const guardianEmail = (b.guardianEmail || '').toString().trim().slice(0, 180);
    const guardianPhone = (b.guardianPhone || '').toString().trim().slice(0, 40);
    const guardianAddress = (b.guardianAddress || '').toString().trim().slice(0, 240);

    const additionalInfo = (b.additionalInfo || '').toString().trim().slice(0, 2400);
    const privacyPolicy = !!b.privacyPolicy;
    const imageConsent = !!b.imageConsent;

    if (!childName || !childSurname || !childBirthdate || !section || !guardianName || !guardianEmail || !guardianPhone || !privacyPolicy) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const createdAt = new Date();

    const doc = {
      childName,
      childSurname,
      childBirthdate,
      childGender,
      section,
      healthInfo,
      guardianName,
      guardianRelation,
      guardianEmail,
      guardianPhone,
      guardianAddress,
      additionalInfo,
      privacyPolicy,
      imageConsent,
      createdAt,
    };

    await db.collection('registrations').insertOne(doc);

    const publicProjection = {
      childName: childName,
      section,
      createdAt,
    };

    res.status(201).json(publicProjection);
  } catch (err) {
    console.error('Error register', err);
    res.status(500).json({ error: 'Error al registrar' });
  }
}
