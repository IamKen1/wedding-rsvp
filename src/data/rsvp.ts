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

    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Production environment detected');
      // In production, we should use a database instead
      // For now, just return the entry without saving
      return entry;
    }

    let entries: RSVPEntry[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      entries = Array.isArray(JSON.parse(fileContent)) ? JSON.parse(fileContent) : [];
    } catch (error) {
      console.error('Error reading RSVP file:', error);
      entries = [];
    }

    entries.push(entry);
    
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2));
      console.log('Successfully wrote to file');
    } catch (error) {
      console.error('Error writing to file:', error);
      throw new Error('Failed to write to file');
    }

    return entry;
  } catch (error) {
    console.error('Error in saveRSVP:', error);
    throw new Error('Failed to save RSVP');
  }
}

export async function getAllRSVPs(): Promise<RSVPEntry[]> {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, we should fetch from a database
      return [];
    }

    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const entries = JSON.parse(fileContent);
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.error('Error in getAllRSVPs:', error);
    return [];
  }
} 