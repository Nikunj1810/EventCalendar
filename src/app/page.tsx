"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  frequency?: string;
  daysOfWeek: string[];
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      console.log("Fetching events...");
      const res = await fetch("/api/events");
      console.log("Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Events fetched:", data);
        setEvents(data);
      } else {
        const errorData = await res.json();
        console.error("API error:", errorData);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // For non-recurring events, check if date falls within the event period
      if (!event.isRecurring) {
        return date >= new Date(eventStart.toDateString()) && date <= new Date(eventEnd.toDateString());
      }
      
      // For recurring events, check if this date matches the recurrence pattern
      return isRecurringEventOnDate(event, date);
    });
  };

  const isRecurringEventOnDate = (event: Event, date: Date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    // Don't show recurring events before their start date or after their end date
    if (date < new Date(eventStart.toDateString()) || date > new Date(eventEnd.toDateString())) {
      return false;
    }
    
    switch (event.frequency) {
      case 'daily':
        return true; // Show on every day between start and end date
        
      case 'weekly':
        if (event.daysOfWeek && event.daysOfWeek.length > 0) {
          // Check if current date's day of week matches any of the specified days
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const currentDayName = dayNames[date.getDay()];
          return event.daysOfWeek.includes(currentDayName);
        } else {
          // If no specific days, repeat on the same day of week as the original event
          return date.getDay() === eventStart.getDay();
        }
        
      case 'monthly':
        // Repeat on the same date of each month
        return date.getDate() === eventStart.getDate();
        
      default:
        // For non-recurring or unknown frequency, show only on the original dates
        return date >= new Date(eventStart.toDateString()) && date <= new Date(eventEnd.toDateString());
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-0 flex-1 bg-slate-50 border border-slate-200"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-0 flex-1 border border-slate-200 p-2 bg-white hover:bg-slate-50 transition-colors flex flex-col ${isToday ? 'bg-blue-50 border-blue-300' : ''
            }`}
        >
          <div className={`text-sm font-medium mb-1 flex-shrink-0 ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
            {day}
          </div>
          <div className="space-y-1 flex-1 overflow-hidden">
            {dayEvents.slice(0, 2).map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block text-xs p-1 bg-blue-100 text-blue-800 rounded truncate hover:bg-blue-200 transition-colors"
                title={event.title}
              >
                {event.title}
              </Link>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-slate-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EventCal
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-900 border-b-2 border-blue-500">
                  Calendar
                </Link>
                <Link href="/events" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition-all duration-200">
                  All Events
                </Link>
                <Link href="/events/new" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition-all duration-200">
                  Create Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Calendar */}
      <main className="p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">
                  Event Calendar
                </h1>
                <p className="text-slate-600 text-sm">Manage your events and schedule</p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/events"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View All Events
                </Link>
                <Link
                  href="/events/new"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Link>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-4 border border-slate-200/50 flex-1 flex flex-col min-h-0">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Previous month"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Next month"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0 mb-2 flex-shrink-0">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            {loading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-7 grid-rows-6 gap-0 flex-1 min-h-0">
                {renderCalendarGrid()}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}