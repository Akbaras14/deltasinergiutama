import { Storefront, type CustomerView } from "./storefront";
/** Keeps simulation behind the existing explicit production demo opt-in. */
export function CustomerPage({
  view,
  id,
}: {
  view: CustomerView;
  id?: string;
}) {
  if (process.env.NODE_ENV === "production" && process.env.DSU_DEMO !== "true")
    return (
      <main id="main" className="welcome">
        <h1>Katalog belum tersedia</h1>
        <p>Layanan pelanggan belum diaktifkan.</p>
      </main>
    );
  return <Storefront view={view} id={id} />;
}
