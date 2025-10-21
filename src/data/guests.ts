// Guest invitation data
export interface GuestInvitation {
  invitationCode: string;
  name: string;
  email?: string;
  allocatedSeats: number;
  notes?: string;
}

// Sample guest data - you can expand this
export const guestInvitations: GuestInvitation[] = [
  {
    invitationCode: 'K8X9M2P7',
    name: 'The Santos Family',
    email: 'santos.family@email.com',
    allocatedSeats: 4,
    notes: 'Parents + 2 children'
  },
  {
    invitationCode: 'R3N5Q8L4',
    name: 'Maria Clara Fernandez',
    email: 'maria.clara@email.com', 
    allocatedSeats: 2,
    notes: 'Maid of Honor + partner'
  },
  {
    invitationCode: 'T7B9X1M6',
    name: 'Miguel Angelo Santos',
    email: 'miguel@email.com',
    allocatedSeats: 1,
    notes: 'Best Man'
  },
  {
    invitationCode: 'W4P2Y8Z5',
    name: 'Mr. & Mrs. Ricardo dela Cruz',
    allocatedSeats: 2,
    notes: 'Principal Sponsors - no email available'
  },
  {
    invitationCode: 'A9C6F3H8',
    name: 'College Friends Group',
    allocatedSeats: 6,
    notes: 'Juan, Paolo, Gabriel, Isabella, Sofia, Andrea - no group email'
  }
];

// Helper function to get guest by invitation ID
export function getGuestByInvitationId(invitationId: string): GuestInvitation | null {
  return guestInvitations.find(guest => guest.invitationCode === invitationId) || null;
}

// Helper function to generate invitation URL
export function generateInvitationUrl(baseUrl: string, invitationId: string): string {
  return `${baseUrl}?invitation=${invitationId}`;
}