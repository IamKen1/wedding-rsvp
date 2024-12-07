import fs from 'fs/promises';
import path from 'path';

interface RSVPEntry {
  id: string;
  name: string;
  willAttend: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  message: string;
  createdAt: string;
}

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'rsvp-data.json');

export async function saveRSVP(data: Omit<RSVPEntry, 'id' | 'createdAt'>) {
  try {
    const entry: RSVPEntry = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    let entries: RSVPEntry[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      entries = Array.isArray(JSON.parse(fileContent)) ? JSON.parse(fileContent) : [];
    } catch {
      entries = [];
    }

    entries.push(entry);
    await fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2));
    return entry;
  } catch (error) {
    console.error('Error saving RSVP:', error);
    throw new Error('Failed to save RSVP');
  }
}

export async function getAllRSVPs(): Promise<RSVPEntry[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const entries = JSON.parse(fileContent);
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
} 