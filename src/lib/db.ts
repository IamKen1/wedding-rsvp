import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test connection first
    await sql`SELECT 1`;
    console.log('Database connection successful');
    
    // Create guests table
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        invitation_code VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        allocated_seats INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create RSVPs table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        will_attend VARCHAR(10) NOT NULL CHECK (will_attend IN ('yes', 'no')),
        number_of_guests INTEGER DEFAULT 1,
        dietary_requirements TEXT,
        song_request TEXT,
        message TEXT,
        invitation_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invitation_code) REFERENCES guests(invitation_code) ON DELETE SET NULL
      )
    `;

    // Ensure email column allows NULL values (in case it was created with NOT NULL constraint)
    try {
      await sql`ALTER TABLE rsvps ALTER COLUMN email DROP NOT NULL`;
    } catch (e) {
      // Ignore error if constraint doesn't exist
      console.log('Email column already allows NULL or constraint does not exist');
    }

    // Ensure phone column allows NULL values  
    try {
      await sql`ALTER TABLE rsvps ALTER COLUMN phone DROP NOT NULL`;
    } catch (e) {
      // Ignore error if constraint doesn't exist
      console.log('Phone column already allows NULL or constraint does not exist');
    }

    // Ensure other optional columns allow NULL values
    try {
      await sql`ALTER TABLE rsvps ALTER COLUMN dietary_requirements DROP NOT NULL`;
    } catch {
      // Ignore error if constraint doesn't exist
      console.log('Dietary requirements column already allows NULL or constraint does not exist');
    }

    try {
      await sql`ALTER TABLE rsvps ALTER COLUMN song_request DROP NOT NULL`;
    } catch {
      // Ignore error if constraint doesn't exist
      console.log('Song request column already allows NULL or constraint does not exist');
    }

    try {
      await sql`ALTER TABLE rsvps ALTER COLUMN invitation_code DROP NOT NULL`;
    } catch {
      // Ignore error if constraint doesn't exist
      console.log('Invitation code column already allows NULL or constraint does not exist');
    }

    // Create wedding_events table (schedule)
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(255) NOT NULL,
        event_time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(50),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wedding_entourage table
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_entourage (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        side VARCHAR(10) NOT NULL CHECK (side IN ('bride', 'groom', 'male', 'female', 'both')),
        category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('parents', 'sponsors', 'other')),
        description TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wedding_attire table
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_attire (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        color_scheme VARCHAR(255),
        dress_code VARCHAR(100),
        guidelines TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wedding_locations table
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        contact_phone VARCHAR(50),
        contact_email VARCHAR(255),
        directions TEXT,
        special_instructions TEXT,
        map_url TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create prenup_photos table
    await sql`
      CREATE TABLE IF NOT EXISTS prenup_photos (
        id SERIAL PRIMARY KEY,
        photo_url TEXT NOT NULL,
        caption TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add photo columns to existing tables (migrations)
    try {
      // Add photos column to wedding_attire if it doesn't exist
      await sql`
        ALTER TABLE wedding_attire 
        ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}'
      `;
      
      // Add map_photo column to wedding_locations if it doesn't exist
      await sql`
        ALTER TABLE wedding_locations 
        ADD COLUMN IF NOT EXISTS map_photo TEXT
      `;
      
      // Add category column to wedding_entourage if it doesn't exist
      await sql`
        ALTER TABLE wedding_entourage 
        ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'other'
      `;
      
      // Add CHECK constraint for category if it doesn't exist
      try {
        await sql`
          ALTER TABLE wedding_entourage 
          ADD CONSTRAINT wedding_entourage_category_check 
          CHECK (category IN ('parents', 'sponsors', 'other'))
        `;
      } catch (constraintError) {
        console.log('Category constraint may already exist:', constraintError);
      }
      
      // Update existing side constraint to include new values
      try {
        await sql`
          ALTER TABLE wedding_entourage 
          DROP CONSTRAINT IF EXISTS wedding_entourage_side_check
        `;
        await sql`
          ALTER TABLE wedding_entourage 
          ADD CONSTRAINT wedding_entourage_side_check 
          CHECK (side IN ('bride', 'groom', 'male', 'female', 'both'))
        `;
      } catch (sideError) {
        console.log('Side constraint update may have failed:', sideError);
      }
    } catch (error) {
      console.log('Column additions skipped (may already exist):', error);
    }

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_code ON rsvps(invitation_code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_will_attend ON rsvps(will_attend)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_events_sort_order ON wedding_events(sort_order)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_entourage_side ON wedding_entourage(side)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_entourage_sort_order ON wedding_entourage(sort_order)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_attire_category ON wedding_attire(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wedding_locations_sort_order ON wedding_locations(sort_order)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_prenup_photos_sort_order ON prenup_photos(sort_order)`;

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Guest operations
export async function createGuest(guest: {
  invitationCode: string;
  name: string;
  email?: string;
  allocatedSeats: number;
  notes?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO guests (invitation_code, name, email, allocated_seats, notes)
      VALUES (${guest.invitationCode}, ${guest.name}, ${guest.email || null}, ${guest.allocatedSeats}, ${guest.notes || null})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating guest:', error);
    throw error;
  }
}

export async function getAllGuests(): Promise<any[]> {
  try {
    const guests = await sql`
      SELECT invitation_code as "invitationCode", name, email, allocated_seats as "allocatedSeats", notes, created_at as "createdAt"
      FROM guests 
      ORDER BY created_at DESC
    `;
    return guests;
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw error;
  }
}

export async function getGuestByInvitationCode(invitationCode: string): Promise<any | null> {
  try {
    const result = await sql`
      SELECT invitation_code as "invitationCode", name, email, allocated_seats as "allocatedSeats", notes
      FROM guests 
      WHERE invitation_code = ${invitationCode}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching guest by invitation code:', error);
    throw error;
  }
}

export async function deleteGuest(invitationCode: string) {
  try {
    const result = await sql`
      DELETE FROM guests 
      WHERE invitation_code = ${invitationCode}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
}

export async function updateGuest(guest: {
  invitationCode: string;
  name: string;
  email?: string;
  allocatedSeats: number;
  notes?: string;
}) {
  try {
    const result = await sql`
      UPDATE guests 
      SET name = ${guest.name},
          email = ${guest.email || null},
          allocated_seats = ${guest.allocatedSeats},
          notes = ${guest.notes || null},
          updated_at = NOW()
      WHERE invitation_code = ${guest.invitationCode}
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
}

// RSVP operations
export async function createRSVP(rsvp: {
  name: string;
  email?: string;
  phone?: string;
  willAttend: string;
  numberOfGuests: number;
  dietaryRequirements?: string;
  songRequest?: string;
  message: string;
  invitationCode?: string;
}) {
  try {
    console.log('Creating RSVP with data:', rsvp);
    
    const result = await sql`
      INSERT INTO rsvps (name, email, phone, will_attend, number_of_guests, dietary_requirements, song_request, message, invitation_code)
      VALUES (
        ${rsvp.name}, 
        ${rsvp.email || null}, 
        ${rsvp.phone || null}, 
        ${rsvp.willAttend}, 
        ${rsvp.numberOfGuests}, 
        ${rsvp.dietaryRequirements || null}, 
        ${rsvp.songRequest || null}, 
        ${rsvp.message}, 
        ${rsvp.invitationCode || null}
      )
      RETURNING *
    `;
    
    console.log('RSVP created successfully:', result[0]);
    return result[0];
  } catch (error) {
    console.error('Error creating RSVP in database:', error);
    console.error('Failed RSVP data:', rsvp);
    throw error;
  }
}

export async function getAllRSVPs() {
  try {
    const rsvps = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        will_attend as "willAttend", 
        number_of_guests as "numberOfGuests", 
        dietary_requirements as "dietaryRequirements", 
        song_request as "songRequest", 
        message, 
        invitation_code as "invitationCode", 
        created_at as "createdAt"
      FROM rsvps 
      ORDER BY created_at DESC
    `;
    return rsvps;
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    throw error;
  }
}

// Utility functions
export async function getTotalSeats() {
  try {
    const result = await sql`
      SELECT COALESCE(SUM(allocated_seats), 0) as total
      FROM guests
    `;
    return result[0].total;
  } catch (error) {
    console.error('Error calculating total seats:', error);
    throw error;
  }
}

export async function getRSVPStats() {
  try {
    const stats = await sql`
      SELECT 
        will_attend,
        COUNT(*) as count,
        COALESCE(SUM(number_of_guests), 0) as total_guests
      FROM rsvps 
      GROUP BY will_attend
    `;
    
    const result = {
      attending: { count: 0, totalGuests: 0 },
      notAttending: { count: 0, totalGuests: 0 }
    };
    
    stats.forEach((stat: any) => {
      if (stat.will_attend === 'yes') {
        result.attending = { count: parseInt(stat.count), totalGuests: parseInt(stat.total_guests) };
      } else if (stat.will_attend === 'no') {
        result.notAttending = { count: parseInt(stat.count), totalGuests: parseInt(stat.total_guests) };
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching RSVP stats:', error);
    throw error;
  }
}

export async function clearAllRSVPs() {
  try {
    // First get the count, then delete
    const countResult = await sql`SELECT COUNT(*) as count FROM rsvps`;
    const totalCount = countResult[0].count;
    
    // Delete all RSVPs
    await sql`DELETE FROM rsvps`;
    
    console.log('All RSVPs cleared successfully, deleted count:', totalCount);
    return { deletedCount: parseInt(totalCount) };
  } catch (error) {
    console.error('Error clearing all RSVPs:', error);
    throw error;
  }
}

// Wedding Events (Schedule) operations
export async function getAllWeddingEvents() {
  try {
    const events = await sql`
      SELECT id, event_name, event_time, location, description, icon, color, sort_order, created_at, updated_at
      FROM wedding_events 
      ORDER BY sort_order ASC, event_time ASC
    `;
    return events;
  } catch (error) {
    console.error('Error fetching wedding events:', error);
    throw error;
  }
}

export async function createWeddingEvent(event: {
  eventName: string;
  eventTime: string;
  location: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      INSERT INTO wedding_events (event_name, event_time, location, description, icon, color, sort_order)
      VALUES (${event.eventName}, ${event.eventTime}, ${event.location}, ${event.description || null}, ${event.icon || null}, ${event.color || null}, ${event.sortOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating wedding event:', error);
    throw error;
  }
}

export async function updateWeddingEvent(id: number, event: {
  eventName: string;
  eventTime: string;
  location: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      UPDATE wedding_events 
      SET event_name = ${event.eventName}, event_time = ${event.eventTime}, location = ${event.location}, 
          description = ${event.description || null}, icon = ${event.icon || null}, color = ${event.color || null}, 
          sort_order = ${event.sortOrder || 0}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating wedding event:', error);
    throw error;
  }
}

export async function deleteWeddingEvent(id: number) {
  try {
    const result = await sql`DELETE FROM wedding_events WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error deleting wedding event:', error);
    throw error;
  }
}

// Wedding Entourage operations
export async function getAllWeddingEntourage() {
  try {
    const entourage = await sql`
      SELECT id, name, role, side, category, description, image_url, sort_order, created_at, updated_at
      FROM wedding_entourage 
      ORDER BY 
        CASE category
          WHEN 'parents' THEN 1
          WHEN 'sponsors' THEN 2
          WHEN 'other' THEN 3
        END,
        side ASC, 
        sort_order ASC
    `;
    return entourage;
  } catch (error) {
    console.error('Error fetching wedding entourage:', error);
    throw error;
  }
}

export async function createWeddingEntourage(member: {
  name: string;
  role: string;
  side: 'bride' | 'groom' | 'male' | 'female' | 'both';
  category?: 'parents' | 'sponsors' | 'other';
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      INSERT INTO wedding_entourage (name, role, side, category, description, image_url, sort_order)
      VALUES (${member.name}, ${member.role}, ${member.side}, ${member.category || 'other'}, ${member.description || null}, ${member.imageUrl || null}, ${member.sortOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating wedding entourage member:', error);
    throw error;
  }
}

export async function updateWeddingEntourage(id: number, member: {
  name: string;
  role: string;
  side: 'bride' | 'groom' | 'male' | 'female' | 'both';
  category?: 'parents' | 'sponsors' | 'other';
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      UPDATE wedding_entourage 
      SET name = ${member.name}, role = ${member.role}, side = ${member.side}, 
          category = ${member.category || 'other'}, description = ${member.description || null}, 
          image_url = ${member.imageUrl || null}, sort_order = ${member.sortOrder || 0}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating wedding entourage member:', error);
    throw error;
  }
}

export async function deleteWeddingEntourage(id: number) {
  try {
    const result = await sql`DELETE FROM wedding_entourage WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error deleting wedding entourage member:', error);
    throw error;
  }
}

// Wedding Attire operations
export async function getAllWeddingAttire() {
  try {
    const attire = await sql`
      SELECT id, category, title, description, color_scheme, dress_code, guidelines, photos, sort_order, created_at, updated_at
      FROM wedding_attire 
      ORDER BY sort_order ASC
    `;
    return attire;
  } catch (error) {
    console.error('Error fetching wedding attire:', error);
    throw error;
  }
}

export async function createWeddingAttire(attire: {
  category: string;
  title: string;
  description?: string;
  colorScheme?: string;
  dressCode?: string;
  guidelines?: string;
  photos?: string[];
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      INSERT INTO wedding_attire (category, title, description, color_scheme, dress_code, guidelines, photos, sort_order)
      VALUES (${attire.category}, ${attire.title}, ${attire.description || null}, ${attire.colorScheme || null}, ${attire.dressCode || null}, ${attire.guidelines || null}, ${attire.photos || []}, ${attire.sortOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating wedding attire:', error);
    throw error;
  }
}

export async function updateWeddingAttire(id: number, attire: {
  category: string;
  title: string;
  description?: string;
  colorScheme?: string;
  dressCode?: string;
  guidelines?: string;
  photos?: string[];
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      UPDATE wedding_attire 
      SET category = ${attire.category}, title = ${attire.title}, description = ${attire.description || null}, 
          color_scheme = ${attire.colorScheme || null}, dress_code = ${attire.dressCode || null}, 
          guidelines = ${attire.guidelines || null}, photos = ${attire.photos || []}, sort_order = ${attire.sortOrder || 0}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating wedding attire:', error);
    throw error;
  }
}

export async function deleteWeddingAttire(id: number) {
  try {
    const result = await sql`DELETE FROM wedding_attire WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error deleting wedding attire:', error);
    throw error;
  }
}

// Wedding Locations operations
export async function getAllWeddingLocations() {
  try {
    const locations = await sql`
      SELECT id, name, address, contact_phone, contact_email, directions, special_instructions, map_url, map_photo, sort_order, created_at, updated_at
      FROM wedding_locations 
      ORDER BY sort_order ASC
    `;
    return locations;
  } catch (error) {
    console.error('Error fetching wedding locations:', error);
    throw error;
  }
}

export async function createWeddingLocation(location: {
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  directions?: string;
  specialInstructions?: string;
  mapUrl?: string;
  mapPhoto?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      INSERT INTO wedding_locations (name, address, contact_phone, contact_email, directions, special_instructions, map_url, map_photo, sort_order)
      VALUES (${location.name}, ${location.address}, ${location.contactPhone || null}, ${location.contactEmail || null}, ${location.directions || null}, ${location.specialInstructions || null}, ${location.mapUrl || null}, ${location.mapPhoto || null}, ${location.sortOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating wedding location:', error);
    throw error;
  }
}

export async function updateWeddingLocation(id: number, location: {
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  directions?: string;
  specialInstructions?: string;
  mapUrl?: string;
  mapPhoto?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      UPDATE wedding_locations 
      SET name = ${location.name}, address = ${location.address}, contact_phone = ${location.contactPhone || null}, 
          contact_email = ${location.contactEmail || null}, directions = ${location.directions || null}, 
          special_instructions = ${location.specialInstructions || null}, map_url = ${location.mapUrl || null}, 
          map_photo = ${location.mapPhoto || null}, sort_order = ${location.sortOrder || 0}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating wedding location:', error);
    throw error;
  }
}

export async function deleteWeddingLocation(id: number) {
  try {
    const result = await sql`DELETE FROM wedding_locations WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error deleting wedding location:', error);
    throw error;
  }
}

// Prenup Photos operations
export async function getAllPrenupPhotos(): Promise<any[]> {
  try {
    const photos = await sql`
      SELECT * FROM prenup_photos 
      ORDER BY sort_order ASC, created_at ASC
    `;
    return photos;
  } catch (error) {
    console.error('Error fetching prenup photos:', error);
    throw error;
  }
}

export async function createPrenupPhoto(photo: {
  photoUrl: string;
  caption?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      INSERT INTO prenup_photos (photo_url, caption, sort_order)
      VALUES (${photo.photoUrl}, ${photo.caption || null}, ${photo.sortOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating prenup photo:', error);
    throw error;
  }
}

export async function updatePrenupPhoto(id: number, photo: {
  photoUrl: string;
  caption?: string;
  sortOrder?: number;
}) {
  try {
    const result = await sql`
      UPDATE prenup_photos 
      SET photo_url = ${photo.photoUrl}, caption = ${photo.caption || null}, 
          sort_order = ${photo.sortOrder || 0}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating prenup photo:', error);
    throw error;
  }
}

export async function deletePrenupPhoto(id: number) {
  try {
    const result = await sql`DELETE FROM prenup_photos WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error deleting prenup photo:', error);
    throw error;
  }
}

export async function createMultiplePrenupPhotos(photos: Array<{ photoUrl: string; caption?: string; sortOrder?: number }>) {
  try {
    const results = [];
    for (const photo of photos) {
      const result = await createPrenupPhoto(photo);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error('Error creating multiple prenup photos:', error);
    throw error;
  }
}