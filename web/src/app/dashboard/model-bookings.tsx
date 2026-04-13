"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/booking";
import type { Booking } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700",
  confirmed: "bg-green-600/10 text-green-700",
  declined: "bg-red-500/10 text-red-600",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-outline-variant/20 text-primary/50",
};

function formatMoney(n: number | null) {
  if (n == null) return null;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export function ModelBookings({ bookings }: { bookings: Booking[] }) {
  const [isPending, startTransition] = useTransition();
  const pending = bookings.filter((b) => b.status === "pending");
  const rest = bookings.filter((b) => b.status !== "pending");

  function handleStatus(bookingId: string, status: string) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
    });
  }

  return (
    <div className={isPending ? "opacity-60" : ""}>
      {/* Pending bookings first — highlighted */}
      {pending.length > 0 ? (
        <div className="mb-6">
          <p className="mb-3 font-label text-[0.5625rem] uppercase tracking-widest text-yellow-700">
            Requires your response
          </p>
          <div className="space-y-3">
            {pending.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                showActions
                onAccept={() => handleStatus(b.id, "confirmed")}
                onDecline={() => handleStatus(b.id, "declined")}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Other bookings */}
      {rest.length > 0 ? (
        <div className="space-y-3">
          {rest.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-dashed border-outline-variant/30 py-12 text-center md:py-16">
          <span className="material-symbols-outlined text-5xl text-primary/15">
            event_available
          </span>
          <p className="max-w-xs font-body text-sm text-primary/40">
            No booking requests yet. Once clients find your profile,
            their requests will appear here.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function BookingCard({
  booking: b,
  showActions = false,
  onAccept,
  onDecline,
}: {
  booking: Booking;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const stColor = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
  const money = formatMoney(b.budget);

  return (
    <div
      className={`border p-5 transition-colors md:p-6 ${
        showActions
          ? "border-yellow-500/30 bg-yellow-500/[0.03]"
          : "border-outline-variant/15 hover:bg-surface-container-low/50"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-headline text-sm font-bold uppercase tracking-tight">
              {b.client_name}
            </span>
            <span className={`shrink-0 px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest ${stColor}`}>
              {b.status}
            </span>
            {money ? (
              <span className="font-headline text-sm font-bold text-secondary">
                {money}
              </span>
            ) : null}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
            <span>{b.event_type}</span>
            {b.event_date ? (
              <span>{new Date(b.event_date).toLocaleDateString()}</span>
            ) : null}
            {b.event_location ? <span>{b.event_location}</span> : null}
            {b.hours ? <span>{b.hours}h</span> : null}
            <span>{b.client_email}</span>
          </div>

          {b.message ? (
            <p className="mt-2 font-body text-xs leading-relaxed text-primary/50">
              {b.message}
            </p>
          ) : null}
        </div>

        {/* Actions or date */}
        <div className="flex shrink-0 items-center gap-2">
          {showActions ? (
            <>
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex items-center gap-1 bg-green-600 px-4 py-2 font-label text-[0.5rem] uppercase tracking-widest text-white transition-colors hover:bg-green-700"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Accept
              </button>
              <button
                type="button"
                onClick={onDecline}
                className="inline-flex items-center gap-1 border border-red-500/30 px-4 py-2 font-label text-[0.5rem] uppercase tracking-widest text-red-600 transition-colors hover:bg-red-500/10"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Decline
              </button>
            </>
          ) : (
            <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/20">
              {new Date(b.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
