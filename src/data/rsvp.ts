// Client-safe data layer - uses API calls instead of direct database access

export interface GuestInvitation {
  invitationCode: string;
  name: string;
  email?: string;
  allocatedSeats: number;
  notes?: string;
}

export interface RSVPData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  willAttend: string;
  numberOfGuests: number;
  dietaryRequirements?: string;
  songRequest?: string;
  message: string;
  timestamp: string;
  invitationCode?: string;
}

// Helper function to determine if we're on the server
const isServer = typeof window === 'undefined';

// Guest operations - these now use API calls on client side
export async function getAllGuests(): Promise<GuestInvitation[]> {
  if (!isServer) {
    // Client-side: use API call
    try {
      const response = await fetch('/api/admin/guests');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch guests');
    } catch (error) {
      console.error('Error getting guests:', error);
      return [];
    }
  }
  
  // Server-side: use direct database import
  try {
    const { getAllGuests: dbGetAllGuests } = await import('../lib/db');
    const guests = await dbGetAllGuests();
    return guests.map((guest: any) => ({
      invitationCode: guest.invitationCode,
      name: guest.name,
      email: guest.email || undefined,
      allocatedSeats: guest.allocatedSeats,
      notes: guest.notes || undefined
    }));
  } catch (error) {
    console.error('Error getting guests:', error);
    return [];
  }
}

export async function getGuestByInvitationCode(invitationCode: string): Promise<GuestInvitation | null> {
  if (!isServer) {
    // Client-side: use API call
    try {
      const response = await fetch(`/api/guest?id=${encodeURIComponent(invitationCode)}`);
      if (response.ok) {
        const data = await response.json();
        return data.guest || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting guest by invitation code:', error);
      return null;
    }
  }

  // Server-side: use direct database import
  try {
    const { getGuestByInvitationCode: dbGetGuestByInvitationCode } = await import('../lib/db');
    const guest = await dbGetGuestByInvitationCode(invitationCode);
    if (!guest) return null;
    
    return {
      invitationCode: guest.invitationCode,
      name: guest.name,
      email: guest.email || undefined,
      allocatedSeats: guest.allocatedSeats,
      notes: guest.notes || undefined
    };
  } catch (error) {
    console.error('Error getting guest by invitation code:', error);
    return null;
  }
}

export async function addGuest(guest: Omit<GuestInvitation, 'invitationCode'> & { invitationCode?: string }): Promise<GuestInvitation> {
  if (!isServer) {
    // Client-side: use API call
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guest)
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.guest;
      }
      throw new Error('Failed to add guest');
    } catch (error) {
      console.error('Error adding guest:', error);
      throw error;
    }
  }

  // Server-side: use direct database import
  try {
    const { createGuest } = await import('../lib/db');
    const invitationCode = guest.invitationCode || generateRandomCode();
    
    const newGuest = {
      invitationCode,
      name: guest.name,
      email: guest.email,
      allocatedSeats: guest.allocatedSeats,
      notes: guest.notes
    };
    
    const result = await createGuest(newGuest);
    return {
      invitationCode: result.invitation_code,
      name: result.name,
      email: result.email,
      allocatedSeats: result.allocated_seats,
      notes: result.notes
    };
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
}

export async function deleteGuest(invitationCode: string): Promise<boolean> {
  if (!isServer) {
    // Client-side: use API call
    try {
      const response = await fetch(`/api/admin/guests?id=${encodeURIComponent(invitationCode)}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting guest:', error);
      return false;
    }
  }

  // Server-side: use direct database import
  try {
    const { deleteGuest: dbDeleteGuest } = await import('../lib/db');
    const result = await dbDeleteGuest(invitationCode);
    return !!result;
  } catch (error) {
    console.error('Error deleting guest:', error);
    return false;
  }
}

function generateRandomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// RSVP operations
export async function getAllRSVPs(): Promise<RSVPData[]> {
  if (!isServer) {
    // Client-side: use API call
    try {
      const response = await fetch('/api/admin/rsvps');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch RSVPs');
    } catch (error) {
      console.error('Error getting RSVPs:', error);
      return [];
    }
  }

  // Server-side: use direct database import
  try {
    const { getAllRSVPs: dbGetAllRSVPs } = await import('../lib/db');
    const rsvps = await dbGetAllRSVPs();
    return rsvps.map((rsvp: any) => ({
      id: rsvp.id.toString(),
      name: rsvp.name,
      email: rsvp.email,
      phone: rsvp.phone,
      willAttend: rsvp.willAttend,
      numberOfGuests: rsvp.numberOfGuests,
      dietaryRequirements: rsvp.dietaryRequirements,
      songRequest: rsvp.songRequest,
      message: rsvp.message,
      timestamp: rsvp.createdAt,
      invitationCode: rsvp.invitationCode
    }));
  } catch (error) {
    console.error('Error getting RSVPs:', error);
    return [];
  }
}

export async function saveRSVP(rsvpData: Omit<RSVPData, 'id' | 'timestamp'>): Promise<RSVPData> {
  // This function is primarily used by API routes on the server
  if (!isServer) {
    // Client-side should use the API endpoint directly
    throw new Error('saveRSVP should not be called from client side');
  }

  try {
    console.log('saveRSVP called with data:', rsvpData);
    
    const { createRSVP, initializeDatabase } = await import('../lib/db');
    await initializeDatabase();
    
    const dbData = {
      name: rsvpData.name,
      email: rsvpData.email || undefined,
      phone: rsvpData.phone || undefined,
      willAttend: rsvpData.willAttend,
      numberOfGuests: rsvpData.numberOfGuests,
      dietaryRequirements: rsvpData.dietaryRequirements || undefined,
      songRequest: rsvpData.songRequest || undefined,
      message: rsvpData.message,
      invitationCode: rsvpData.invitationCode || undefined
    };
    
    console.log('Calling createRSVP with:', dbData);
    
    const result = await createRSVP(dbData);
    
    console.log('Database result:', result);
    
    const transformedResult = {
      id: result.id.toString(),
      name: result.name,
      email: result.email || undefined,
      phone: result.phone || undefined,
      willAttend: result.will_attend,
      numberOfGuests: result.number_of_guests,
      dietaryRequirements: result.dietary_requirements || undefined,
      songRequest: result.song_request || undefined,
      message: result.message,
      timestamp: result.created_at,
      invitationCode: result.invitation_code || undefined
    };
    
    console.log('Transformed result:', transformedResult);
    
    return transformedResult;
  } catch (error) {
    console.error('Error in saveRSVP:', error);
    console.error('Input data was:', rsvpData);
    throw error;
  }
}

// Legacy sync functions for backward compatibility (these will be deprecated)
export function saveAllGuests(_guests: GuestInvitation[]) {
  console.warn('saveAllGuests is deprecated. Use database operations instead.');
} 