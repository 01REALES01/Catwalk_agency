"use client";

import { useActionState, useState } from "react";
import { createBooking, type BookingActionState } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: BookingActionState = {};

const EVENT_TYPES = [
  { value: "editorial", label: "Editorial Shoot" },
  { value: "runway", label: "Runway / Fashion Show" },
  { value: "commercial", label: "Commercial / Advertising" },
  { value: "catalog", label: "Catalog / E-commerce" },
  { value: "other", label: "Other" },
];

export function BookingForm({
  modelId,
  modelName,
  clientEmail,
}: {
  modelId: string;
  modelName: string;
  clientEmail?: string;
}) {
  const [state, formAction] = useActionState(createBooking, initial);
  const [sent, setSent] = useState(false);

  if (state.ok && !sent) setSent(true);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">
          check_circle
        </span>
        <h3 className="font-headline text-2xl font-bold uppercase tracking-tight">
          Booking Requested
        </h3>
        <p className="max-w-sm font-body text-sm text-primary/60">
          Your booking request for {modelName} has been submitted. The agency
          will review it and get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="font-label text-[0.625rem] uppercase tracking-widest text-secondary transition-colors hover:text-primary"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="model_id" value={modelId} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client_name">Your Name</Label>
          <Input
            id="client_name"
            name="client_name"
            required
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_email">Email</Label>
          <Input
            id="client_email"
            name="client_email"
            type="email"
            required
            defaultValue={clientEmail}
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type</Label>
          <select
            id="event_type"
            name="event_type"
            className="flex h-12 w-full border border-outline-variant/25 bg-transparent px-4 py-3 font-body text-sm text-on-surface transition-colors focus:border-secondary focus:outline-none"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">Date</Label>
          <Input id="event_date" name="event_date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_location">Location</Label>
          <Input
            id="event_location"
            name="event_location"
            placeholder="City or venue"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your project, requirements, or any specific details..."
        />
      </div>

      {state.error ? (
        <p className="font-body text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" variant="secondary" size="lg" className="w-full">
        Send Booking Request
      </Button>
    </form>
  );
}
