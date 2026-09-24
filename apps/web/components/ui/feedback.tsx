"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Empty collection feedback; optional action should explain the next useful step. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="empty">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
/** Recoverable request failure. Retry is explicitly triggered by the user. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="empty" role="alert">
      <h2>Data belum dapat ditampilkan</h2>
      <p>{message}</p>
      <Button onClick={onRetry}>Coba lagi</Button>
    </section>
  );
}
/** Announces pending reads without displaying invented data. */
export function LoadingState() {
  return (
    <section aria-busy="true">
      <p role="status">Memuat data nursery…</p>
      <Skeleton className="h-32 my-5" />
      <Skeleton className="h-32 my-5" />
    </section>
  );
}
