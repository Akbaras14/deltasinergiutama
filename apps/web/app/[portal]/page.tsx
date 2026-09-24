import { notFound } from "next/navigation";
import { NurseryPortal } from "@/components/nursery-portal";
export default async function Page({
  params,
}: {
  params: Promise<{ portal: string }>;
}) {
  const { portal } = await params;
  if (!["admin", "petugas", "katalog", "akun"].includes(portal)) notFound();
  if (process.env.NODE_ENV === "production" && process.env.DSU_DEMO !== "true")
    return (
      <main id="main" className="welcome">
        <h1>Portal belum tersedia</h1>
        <p>Layanan produksi belum diaktifkan.</p>
      </main>
    );
  return <NurseryPortal portal={portal} />;
}
