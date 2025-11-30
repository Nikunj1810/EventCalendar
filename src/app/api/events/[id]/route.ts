import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventId = parseInt(id, 10)
    console.log('DELETE request for event ID:', eventId)

    if (!id || isNaN(eventId)) {
      console.error('Invalid ID provided:', id)
      return NextResponse.json({ error: 'Valid event ID is required' }, { status: 400 })
    }

    // Check if event exists
    console.log('Checking if event exists...')
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      console.error('Event not found:', id)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    console.log('Event found, deleting...', existingEvent.title)

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId }
    })

    console.log('Event deleted successfully')
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Event deletion error:', error)
    return NextResponse.json({
      error: 'Failed to delete event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('GET request for event ID:', id)
    const eventId = parseInt(id, 10)

    if (isNaN(eventId)) {
      console.error('Invalid event ID:', id)
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    console.log('Fetching event with ID:', eventId)
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      console.error('Event not found with ID:', eventId)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    console.log('Event found:', event.title)
    return NextResponse.json(event)
  } catch (error) {
    console.error('Event fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventId = parseInt(id, 10)
    const body = await request.json()

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title,
        description: body.description || null,
        startDate: new Date(body.startDate + 'Z'), // Treat as UTC to prevent timezone shift
        endDate: new Date(body.endDate + 'Z'), // Treat as UTC to prevent timezone shift
        isRecurring: body.isRecurring || false,
        frequency: body.frequency || null,
        daysOfWeek: body.daysOfWeek || [],
      }
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Event update error:', error)
    return NextResponse.json({
      error: 'Failed to update event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}