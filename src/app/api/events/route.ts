import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Event } from '@prisma/client'

export async function GET() {
  try {
    const events = await prisma.event.findMany()

    // Debug logging
    events.forEach((event: Event) => {
      if (event.title === 'birthday') {
        console.log('Birthday event from DB:');
        console.log('startDate:', event.startDate);
        console.log('startDate ISO:', event.startDate.toISOString());
      }
    });

    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const event = await prisma.event.create({
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
    return NextResponse.json(event)
  } catch (error) {
    console.error('Event creation error:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Event with this title and start time already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}