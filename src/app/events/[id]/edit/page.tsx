"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  async function fetchEvent() {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");

      const eventData = await res.json();
      setEvent(eventData);

      // Populate form fields
      setTitle(eventData.title);
      setDescription(eventData.description || "");
      setIsRecurring(eventData.isRecurring);
      setFrequency(eventData.frequency || "");
      setDaysOfWeek(eventData.daysOfWeek || []);

      // Parse start date/time
      const startDateTime = new Date(eventData.startDate);
      setStartDate(startDateTime.toISOString().split('T')[0]);
      setStartTime(startDateTime.toTimeString().slice(0, 5));

      // Parse end date/time
      const endDateTime = new Date(eventData.endDate);
      setEndDate(endDateTime.toISOString().split('T')[0]);
      setEndTime(endDateTime.toTimeString().slice(0, 5));

    } catch (err) {
      setMessage("Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create dates without timezone conversion
      const startDateTime = new Date(startDate + (startTime ? `T${startTime}:00` : "T00:00:00"));
      const endDateTime = new Date(endDate + (endTime ? `T${endTime}:00` : "T23:59:59"));

      const startDateStr = startDateTime.getFullYear() + '-' +
        String(startDateTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(startDateTime.getDate()).padStart(2, '0') + 'T' +
        String(startDateTime.getHours()).padStart(2, '0') + ':' +
        String(startDateTime.getMinutes()).padStart(2, '0') + ':' +
        String(startDateTime.getSeconds()).padStart(2, '0');

      const endDateStr = endDateTime.getFullYear() + '-' +
        String(endDateTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(endDateTime.getDate()).padStart(2, '0') + 'T' +
        String(endDateTime.getHours()).padStart(2, '0') + ':' +
        String(endDateTime.getMinutes()).padStart(2, '0') + ':' +
        String(endDateTime.getSeconds()).padStart(2, '0');

      const payload = {
        title,
        description,
        startDate: startDateStr,
        endDate: endDateStr,
        isRecurring,
        frequency: isRecurring && frequency ? frequency : null,
        daysOfWeek: isRecurring && daysOfWeek.length ? daysOfWeek : null,
      };

      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err?.error || "Failed to update event");
        return;
      }

      setMessage("Event updated successfully!");
      setTimeout(() => {
        router.push("/events");
      }, 1500);
    } catch (err) {
      setMessage("Network error");
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading event...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!event) {
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
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Event Not Found</h1>
              <Link href="/events" className="text-blue-600 hover:text-blue-700">
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
        <div className="max-w-2xl mx-auto">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Edit Event</h1>
            </div>
            <p className="text-slate-600">Update event details</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Event Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date/Time Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Options */}
              <div className="pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-sm text-black font-medium">Recurring event</span>
                </label>

                {isRecurring && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Frequency</label>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as any)}
                        className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {frequency === "weekly" && (
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Days of week</label>
                        <div className="grid grid-cols-4 gap-3">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <label key={d} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={daysOfWeek.includes(d)}
                                onChange={(e) => {
                                  if (e.target.checked) setDaysOfWeek((s) => [...s, d]);
                                  else setDaysOfWeek((s) => s.filter((x) => x !== d));
                                }}
                                className="mr-2 w-4 h-4"
                              />
                              <span className="text-sm text-black font-medium">{d}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block w-full border border-slate-200 rounded-lg px-4 py-3 text-black placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Add event details..."
                />
              </div>

              {/* Message */}
              {message && (
                <div className={`text-sm font-medium ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Link
                  href="/events"
                  className="px-6 py-3 border border-slate-200 text-black rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}