'use client'

import { useState } from 'react'
import axios from 'axios'

interface TrackingEvent {
  event_type: string
  data: Record<string, any>
}

export function TrackingEvents() {
  const [eventType, setEventType] = useState('')
  const [eventData, setEventData] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data: TrackingEvent = {
        event_type: eventType,
        data: JSON.parse(eventData)
      }
      await axios.post('http://localhost:8000/track', data)
      alert('Event tracked successfully!')
    } catch (error) {
      console.error('Error tracking event:', error)
      alert('Error tracking event')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Event </label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Event Data (JSON)</label>
          <textarea
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Track Event
        </button>
      </form>
    </div>
  )
}
