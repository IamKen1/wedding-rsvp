import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllWeddingEvents, 
  createWeddingEvent, 
  updateWeddingEvent, 
  deleteWeddingEvent,
  initializeDatabase 
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// GET - Get all wedding events
export async function GET() {
  try {
    await initializeDatabase();
    const events = await getAllWeddingEvents();
    
    const transformedEvents = events.map((event: any) => ({
      id: event.id,
      eventName: event.event_name,
      eventTime: event.event_time,
      location: event.location,
      description: event.description,
      icon: event.icon,
      color: event.color,
      sortOrder: event.sort_order,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }));
    
    return NextResponse.json(transformedEvents, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching wedding events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding events' },
      { status: 500 }
    );
  }
}

// POST - Create a new wedding event
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const eventData = await request.json();
    
    const newEvent = {
      eventName: eventData.eventName,
      eventTime: eventData.eventTime,
      location: eventData.location,
      description: eventData.description,
      icon: eventData.icon,
      color: eventData.color,
      sortOrder: eventData.sortOrder
    };
    
    const result = await createWeddingEvent(newEvent);
    
    return NextResponse.json({ 
      success: true, 
      event: {
        id: result.id,
        eventName: result.event_name,
        eventTime: result.event_time,
        location: result.location,
        description: result.description,
        icon: result.icon,
        color: result.color,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating wedding event:', error);
    return NextResponse.json(
      { error: 'Failed to create wedding event' },
      { status: 500 }
    );
  }
}

// PUT - Update a wedding event
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    const eventData = await request.json();
    
    const updatedEvent = {
      eventName: eventData.eventName,
      eventTime: eventData.eventTime,
      location: eventData.location,
      description: eventData.description,
      icon: eventData.icon,
      color: eventData.color,
      sortOrder: eventData.sortOrder
    };
    
    const result = await updateWeddingEvent(parseInt(id), updatedEvent);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      event: {
        id: result.id,
        eventName: result.event_name,
        eventTime: result.event_time,
        location: result.location,
        description: result.description,
        icon: result.icon,
        color: result.color,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating wedding event:', error);
    return NextResponse.json(
      { error: 'Failed to update wedding event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a wedding event
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteWeddingEvent(parseInt(id));
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wedding event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting wedding event:', error);
    return NextResponse.json(
      { error: 'Failed to delete wedding event' },
      { status: 500 }
    );
  }
}