"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  async function fetchEvent() {
    try {
      console.log('Fetching event with ID:', eventId);
      const res = await fetch(`/api/events/${eventId}`);
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || "Failed to fetch event");
      }

      const eventData = await res.json();
      console.log('Event data received:', eventData);
      setEvent(eventData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!event || !confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");

      router.push("/events");
    } catch (err) {
      alert("Failed to delete event");
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
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
                  <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition-all duration-200">
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

        <main className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading event...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !event) {
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
                  <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition-all duration-200">
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

        <main className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                {error || "Event Not Found"}
              </h1>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

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
                <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition-all duration-200">
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

      {/* Main Content */}
      <main className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/events"
                className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {event.title}
              </h1>
            </div>
            <p className="text-slate-600">Event details and information</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-slate-200/50">
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{event.title}</h2>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Starts</p>
                      <p className="text-lg text-slate-900">{formatDate(event.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Ends</p>
                      <p className="text-lg text-slate-900">{formatDate(event.endDate)}</p>
                    </div>
                  </div>

                  {event.isRecurring && (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">Recurring</p>
                        <p className="text-lg text-slate-900 capitalize">{event.frequency}</p>
                        {event.frequency === "weekly" && event.daysOfWeek.length > 0 && (
                          <p className="text-sm text-slate-600">({event.daysOfWeek.join(", ")})</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Created</p>
                      <p className="text-lg text-slate-900">{formatDate(event.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Last Updated</p>
                      <p className="text-lg text-slate-900">{formatDate(event.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Description</h3>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <p className="text-slate-700 leading-relaxed break-words overflow-wrap-anywhere">{event.description}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  Delete Event
                </button>

                <div className="flex space-x-4">
                  <Link
                    href="/events"
                    className="px-6 py-3 border border-slate-200 text-black rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
                  >
                    Back to Events
                  </Link>
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                  >
                    Edit Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}