"use client";

import { useMemo, useState, useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/booking";
import type { Booking } from "@/types/database";

type StatusFilter = "all" | "pending" | "confirmed" | "declined" | "completed";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "declined", label: "Declined" },
  { id: "completed", label: "Completed" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700",
  confirmed: "bg-green-600/10 text-green-700",
  declined: "bg-red-500/10 text-red-600",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-outline-variant/20 text-primary/50",
};

export function AdminBookings({
  bookings,
  modelNames,
  pendingCount,
}: {
  bookings: Booking[];
  modelNames: Record<string, string>;
  pendingCount: number;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const uniqueModels = useMemo(() => {
    const ids = [...new Set(bookings.map((b) => b.model_id))];
    return ids.map((id) => ({ id, name: modelNames[id] ?? "Unknown" })).sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings, modelNames]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (modelFilter !== "all" && b.model_id !== modelFilter) return false;
      return true;
    });
  }, [bookings, statusFilter, modelFilter]);

  function handleStatus(bookingId: string, status: string) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
    });
  }

  return (
    <>
      <div className="mb-8 flex items-baseline justify-between md:mb-12">
        <h2 className="font-headline text-2xl font-black uppercase tracking-tighter md:text-4xl">
          Bookings
        </h2>
        {pendingCount > 0 ? (
          <span className="bg-yellow-500/10 px-3 py-1 font-label text-[0.5625rem] uppercase tracking-widest text-yellow-700">
            {pendingCount} pending
          </span>
        ) : (
          <span className="font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
            {bookings.length} total
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="hide-scrollbar flex gap-4 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={
                statusFilter === f.id
                  ? "whitespace-nowrap border-b-2 border-primary pb-2 font-label text-[0.625rem] uppercase tracking-widest"
                  : "whitespace-nowrap pb-2 font-label text-[0.625rem] uppercase tracking-widest opacity-40 transition-opacity hover:opacity-100"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {uniqueModels.length > 1 ? (
          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="border border-outline-variant/25 bg-transparent px-3 py-2 font-label text-[0.625rem] uppercase tracking-widest focus:border-secondary focus:outline-none"
          >
            <option value="all">All Models</option>
            {uniqueModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {/* Bookings list */}
      <div className={`space-y-3 ${isPending ? "opacity-60" : ""}`}>
        {filtered.length === 0 ? (
          <p className="py-12 text-center font-body text-sm text-primary/40">
            No bookings match this filter.
          </p>
        ) : (
          filtered.map((b) => {
            const modelName =
              (b.model_profiles as { nombre?: string } | null)?.nombre ??
              modelNames[b.model_id] ??
              "Model";
            const stColor = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;

            return (
              <div
                key={b.id}
                className="border border-outline-variant/15 p-5 transition-colors hover:bg-surface-container-low/50 md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {/* Header row */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-headline text-sm font-bold uppercase tracking-tight">
                        {b.client_name}
                      </span>
                      <span className="font-label text-[0.5rem] uppercase tracking-widest text-primary/30">→</span>
                      <span className="font-headline text-sm font-bold uppercase tracking-tight text-secondary">
                        {modelName}
                      </span>
                      <span className={`px-2 py-0.5 font-label text-[0.5rem] uppercase tracking-widest ${stColor}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-label text-[0.5625rem] uppercase tracking-widest text-primary/40">
                      <span>{b.event_type}</span>
                      {b.event_date ? (
                        <span>{new Date(b.event_date).toLocaleDateString()}</span>
                      ) : null}
                      {b.event_location ? <span>{b.event_location}</span> : null}
                      {b.hours ? <span>{b.hours}h</span> : null}
                      {b.budget ? (
                        <span className="font-bold text-secondary">${b.budget.toLocaleString("en-US")}</span>
                      ) : null}
                      <span>{b.client_email}</span>
                    </div>

                    {b.message ? (
                      <p className="mt-2 font-body text-xs leading-relaxed text-primary/50">
                        {b.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {b.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatus(b.id, "confirmed")}
                          className="inline-flex items-center gap-1 bg-green-600 px-4 py-2 font-label text-[0.5rem] uppercase tracking-widest text-white transition-colors hover:bg-green-700"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatus(b.id, "declined")}
                          className="inline-flex items-center gap-1 border border-red-500/30 px-4 py-2 font-label text-[0.5rem] uppercase tracking-widest text-red-600 transition-colors hover:bg-red-500/10"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                          Decline
                        </button>
                      </>
                    ) : b.status === "confirmed" ? (
                      <button
                        type="button"
                        onClick={() => handleStatus(b.id, "completed")}
                        className="inline-flex items-center gap-1 border border-primary/20 px-4 py-2 font-label text-[0.5rem] uppercase tracking-widest text-primary transition-colors hover:bg-primary/10"
                      >
                        <span className="material-symbols-outlined text-sm">done_all</span>
                        Complete
                      </button>
                    ) : null}
                    <span className="ml-2 font-label text-[0.5rem] uppercase tracking-widest text-primary/20">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
