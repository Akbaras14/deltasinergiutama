"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  Sprout,
  Menu,
} from "lucide-react";
import {
  availableStock,
  orderLabels,
  type NurserySnapshot,
} from "@dsu/contracts";
import { createDemoService, localDate, rupiah } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/ui/feedback";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";

/** Read-only demo foundation; role navigation is not real authentication. */
export function NurseryPortal({ portal }: { portal: string }) {
  const [data, setData] = useState<NurserySnapshot | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [scenario, setScenario] = useState<"normal" | "empty" | "error">(
    "normal",
  );
  const [retry, setRetry] = useState(0);
  const [view, setView] = useState("overview");
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const admin = portal === "admin",
    worker = portal === "petugas",
    account = portal === "akun",
    internal = admin || worker;
  useEffect(() => {
    let active = true;
    createDemoService(scenario)
      .read()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Gagal memuat data",
          );
      });
    return () => {
      active = false;
    };
  }, [scenario, retry]);
  const batches = (data?.batches ?? []).filter(
    (batch) => !worker || batch.assignedTo === "petugas-demo",
  );
  const filtered = batches.filter(
    (batch) =>
      (batch.species + batch.id + batch.location)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!category || batch.category === category),
  );
  const totals = batches.reduce(
    (sum, b) => ({
      physical: sum.physical + b.physical,
      approved: sum.approved + b.approved,
      reserved: sum.reserved + b.reserved,
    }),
    { physical: 0, approved: 0, reserved: 0 },
  );
  const title = admin
    ? view === "inventory"
      ? "Inventory tanaman"
      : "Ringkasan nursery"
    : worker
      ? view === "observations"
        ? "Riwayat monitoring"
        : "Batch ditugaskan"
      : account
        ? "Pesanan saya"
        : "Katalog tanaman";
  const nav = admin
    ? [
        { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
        { id: "inventory", label: "Inventory tanaman", icon: Package },
      ]
    : [
        { id: "overview", label: "Batch ditugaskan", icon: Sprout },
        {
          id: "observations",
          label: "Riwayat monitoring",
          icon: ClipboardList,
        },
      ];
  return (
    <div className={internal ? "app-shell" : "store-shell"}>
      {internal && (
        <aside className="sidebar">
          <Link href="/" className="brand">
            <strong>CV. Delta Sinergi Utama</strong>
            <span>Sistem Informasi Nursery</span>
          </Link>
          <div className="sidebar-label">
            {admin ? "ADMINISTRASI" : "AREA PETUGAS"}
          </div>
          <nav aria-label="Navigasi portal">
            {nav.map((item) => (
              <button
                key={item.id}
                aria-current={view === item.id ? "page" : undefined}
                className={view === item.id ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setView(item.id);
                  setMenu(false);
                  setQuery("");
                  setSelected(null);
                }}
              >
                <item.icon size={19} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <span className="badge">Mode Demo</span>
            <p>Data simulasi untuk pengembangan dan pengujian.</p>
            <Link href="/">
              <ArrowLeft size={16} /> Pilihan portal
            </Link>
          </div>
        </aside>
      )}
      <div className="workspace">
        <header className="topbar">
          {internal ? (
            <>
              <Drawer open={menu} onOpenChange={setMenu}>
                <DrawerTrigger
                  className="mobile-menu"
                  aria-label="Buka navigasi"
                >
                  <Menu />
                </DrawerTrigger>
                <DrawerContent side="left">
                  <DrawerHeader>
                    <DrawerTitle>
                      Navigasi {admin ? "admin" : "petugas"}
                    </DrawerTitle>
                    <DrawerDescription>
                      CV. Delta Sinergi Utama · Mode Demo
                    </DrawerDescription>
                  </DrawerHeader>
                  <nav aria-label="Navigasi ponsel" className="px-4">
                    {nav.map((item) => (
                      <button
                        key={item.id}
                        className={
                          view === item.id ? "nav-item active" : "nav-item"
                        }
                        onClick={() => {
                          setView(item.id);
                          setMenu(false);
                          setSelected(null);
                          setQuery("");
                        }}
                      >
                        <item.icon size={19} />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </DrawerContent>
              </Drawer>
              <span>
                Nursery{" "}
                <span className="muted">/ {admin ? "Admin" : "Petugas"}</span>
              </span>
            </>
          ) : (
            <>
              <Link className="brand" href="/">
                <strong>CV. Delta Sinergi Utama</strong>
                <span>Sistem Informasi Nursery</span>
              </Link>
              <nav className="store-nav" aria-label="Navigasi pelanggan">
                <Link href="/katalog">Katalog</Link>
                <Link href="/akun">Pesanan saya</Link>
              </nav>
            </>
          )}
          <span className="user-label">
            {admin ? "Admin" : worker ? "Petugas" : "Pelanggan"} · Demo
          </span>
        </header>
        <main id="main" className="page-content">
          <div className="notice">
            <span>
              <strong>Mode Demo</strong> · Data simulasi, bukan kondisi aktual
              CV. DSU.
            </span>
            <details>
              <summary>Skenario tampilan</summary>
              <label>
                Respons data
                <select
                  value={scenario}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (
                      value === "normal" ||
                      value === "empty" ||
                      value === "error"
                    ) {
                      setData(null);
                      setError("");
                      setScenario(value);
                    }
                  }}
                >
                  <option value="normal">Normal</option>
                  <option value="empty">Data kosong</option>
                  <option value="error">Gagal dimuat</option>
                </select>
              </label>
            </details>
          </div>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {internal ? "OPERASIONAL NURSERY" : "TANAMAN PILIHAN DSU"}
              </div>
              <h1>{title}</h1>
              <p>
                {admin
                  ? "Pantau persediaan dan ketersediaan tanaman per batch."
                  : worker
                    ? "Pengamatan manual untuk batch dalam penugasan Anda."
                    : account
                      ? "Riwayat pesanan untuk akun pelanggan demo."
                      : "Temukan tanaman siap jual untuk kebutuhan taman Anda."}
              </p>
            </div>
            <span className="period">
              Dataset simulasi
              <br />
              <strong>23 September 2026 · WIB</strong>
            </span>
          </div>
          {error ? (
            <ErrorState
              message={error}
              onRetry={() => {
                setData(null);
                setError("");
                setRetry((v) => v + 1);
              }}
            />
          ) : !data ? (
            <LoadingState />
          ) : (
            <>
              {internal && view !== "observations" && (
                <>
                  <div className="stock-summary">
                    {[
                      {
                        label: "Stok fisik",
                        value: totals.physical,
                        note: "Seluruh tanaman tercatat",
                      },
                      {
                        label: "Siap jual disetujui",
                        value: totals.approved,
                        note: "Telah disetujui admin",
                      },
                      {
                        label: "Terreservasi",
                        value: totals.reserved,
                        note: "Dialokasikan ke pesanan",
                      },
                      {
                        label: "Tersedia dipesan",
                        value: availableStock(totals),
                        note: "Siap jual dikurangi reservasi",
                      },
                    ].map((stat, index) => (
                      <div
                        className={index === 3 ? "stat highlighted" : "stat"}
                        key={stat.label}
                      >
                        <span>{stat.label}</span>
                        <strong>
                          {stat.value.toLocaleString("id-ID")}{" "}
                          <small>tanaman</small>
                        </strong>
                        <p>{stat.note}</p>
                      </div>
                    ))}
                  </div>
                  <section className="panel">
                    <div className="panel-title">
                      <div>
                        <h2>
                          {worker
                            ? "Batch dalam penugasan"
                            : "Persediaan per batch"}
                        </h2>
                        <p>
                          {batches.length} batch ·{" "}
                          {worker
                            ? "Hanya batch tugas Anda"
                            : "Semua lokasi nursery"}
                        </p>
                      </div>
                      <Package size={22} />
                    </div>
                    <div className="filters">
                      <label className="search">
                        <Search size={18} />
                        <span className="sr-only">Cari batch</span>
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Cari tanaman, kode, atau lokasi…"
                        />
                      </label>
                      <label>
                        <span className="sr-only">Kategori tanaman</span>
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                        >
                          <option value="">Semua kategori</option>
                          {Array.from(
                            new Set(batches.map((b) => b.category)),
                          ).map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {filtered.length ? (
                      <div
                        className="table-scroll"
                        role="region"
                        aria-label="Stok per batch"
                        tabIndex={0}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th>Tanaman / batch</th>
                              <th>Lokasi</th>
                              <th className="number">Fisik</th>
                              <th className="number">Siap jual</th>
                              <th className="number">Reservasi</th>
                              <th className="number">Tersedia</th>
                              <th>Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((batch) => (
                              <tr key={batch.id}>
                                <td>
                                  <strong>{batch.species}</strong>
                                  <span className="cell-sub">
                                    {batch.id} · {batch.category}
                                  </span>
                                </td>
                                <td>{batch.location}</td>
                                <td className="number">{batch.physical}</td>
                                <td className="number">{batch.approved}</td>
                                <td className="number">{batch.reserved}</td>
                                <td className="number">
                                  <span
                                    className={
                                      availableStock(batch)
                                        ? "badge success"
                                        : "badge"
                                    }
                                  >
                                    {availableStock(batch)}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="detail-button"
                                    aria-label={`Lihat ${batch.id}`}
                                    onClick={() =>
                                      setSelected(
                                        selected === batch.id ? null : batch.id,
                                      )
                                    }
                                  >
                                    <ArrowUpRight size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty">
                        <h3>Tidak ada batch ditemukan</h3>
                        <p>Coba kata pencarian atau kategori lain.</p>
                      </div>
                    )}
                    <div className="panel-footer">
                      Menampilkan {filtered.length} dari {batches.length} batch
                      · Satuan: tanaman
                    </div>
                  </section>
                  {selected &&
                    batches
                      .filter((b) => b.id === selected)
                      .map((b) => (
                        <section className="panel detail-panel" key={b.id}>
                          <h2>
                            {b.species} · {b.id}
                          </h2>
                          <p>
                            {b.location} · Ditanam {localDate(b.plantedAt)}
                          </p>
                          <p>
                            Stok tersedia berasal dari persetujuan admin,
                            dikurangi reservasi aktif.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setSelected(null)}
                          >
                            Tutup detail
                          </Button>
                        </section>
                      ))}
                </>
              )}
              {worker && view === "observations" && (
                <section className="panel">
                  <div className="panel-title">
                    <h2>Hasil pengamatan terbaru</h2>
                  </div>
                  {data.observations.filter((o) =>
                    batches.some((b) => b.id === o.batchId),
                  ).length ? (
                    data.observations
                      .filter((o) => batches.some((b) => b.id === o.batchId))
                      .map((o) => (
                        <article className="observation" key={o.id}>
                          <span className="badge success">{o.condition}</span>
                          <h3>
                            {o.batchId} · {localDate(o.observedAt)}
                          </h3>
                          <p>
                            {o.method} · {o.sampleCount} sampel · WIB
                          </p>
                          <p>
                            Rata-rata tinggi:{" "}
                            {(
                              o.measurements.reduce(
                                (sum, m) => sum + m.value,
                                0,
                              ) / o.sampleCount
                            ).toFixed(1)}{" "}
                            cm
                          </p>
                          <p className="muted">
                            Rata-rata sampel tidak mewakili ukuran pasti seluruh
                            tanaman. Identitas individu tidak dilacak antarsesi.
                          </p>
                        </article>
                      ))
                  ) : (
                    <div className="empty">Belum ada pengamatan tersimpan.</div>
                  )}
                </section>
              )}
              {!internal && !account && (
                <>
                  <div className="catalog-intro">
                    <ShoppingBag size={20} />
                    <span>
                      Pengambilan di nursery · Transfer manual · Verifikasi oleh
                      admin
                    </span>
                  </div>
                  <div className="filters">
                    <label className="search">
                      <Search size={18} />
                      <span className="sr-only">Cari tanaman</span>
                      <input
                        placeholder="Cari tanaman…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="product-grid">
                    {data.products
                      .filter(
                        (p) =>
                          p.published &&
                          p.name.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((p) => {
                        const available = data.batches
                          .filter((b) => p.batchIds.includes(b.id))
                          .reduce((sum, b) => sum + availableStock(b), 0);
                        return (
                          <article className="product-card" key={p.id}>
                            <div className="photo-placeholder">
                              <Sprout size={36} />
                              <span>Foto tanaman belum tersedia</span>
                            </div>
                            <div className="product-body">
                              <span className="eyebrow">{p.category}</span>
                              <h2>{p.name}</h2>
                              <p>{p.description}</p>
                              <strong className="price">
                                {rupiah(p.price)}
                              </strong>
                              <span className="badge success">
                                {available} tanaman tersedia
                              </span>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                  {!data.products.some(
                    (p) =>
                      p.published &&
                      p.name.toLowerCase().includes(query.toLowerCase()),
                  ) && (
                    <div className="empty">
                      <h2>Tanaman belum ditemukan</h2>
                      <p>Coba nama tanaman lain.</p>
                    </div>
                  )}
                </>
              )}
              {account && (
                <section className="panel">
                  <div className="panel-title">
                    <h2>Riwayat pesanan simulasi</h2>
                  </div>
                  {data.orders
                    .filter((o) => o.customerId === "pelanggan-demo")
                    .map((o) => (
                      <article className="observation" key={o.id}>
                        <span className="badge">{orderLabels[o.status]}</span>
                        <h3>{o.id}</h3>
                        <p>
                          {localDate(o.createdAt)} · {rupiah(o.total)}
                        </p>
                        <p>
                          Pengambilan di nursery. Bukti pembayaran harus
                          diverifikasi admin.
                        </p>
                      </article>
                    ))}
                  {!data.orders.some(
                    (o) => o.customerId === "pelanggan-demo",
                  ) && <div className="empty">Belum ada pesanan.</div>}
                </section>
              )}
              {admin && view === "overview" && (
                <div className="info-grid">
                  <section className="panel info-panel">
                    <ClipboardList size={22} />
                    <h2>Monitoring pertumbuhan</h2>
                    <p>
                      {data.observations.length} observasi pada dataset
                      simulasi. Pencatatan petugas tidak otomatis mengubah saldo
                      stok.
                    </p>
                  </section>
                  <section className="panel info-panel">
                    <ShoppingBag size={22} />
                    <h2>Pesanan menunggu verifikasi</h2>
                    <p>
                      <strong>
                        {
                          data.orders.filter(
                            (o) => o.status === "PAYMENT_REVIEW",
                          ).length
                        }{" "}
                        pesanan
                      </strong>{" "}
                      memerlukan pemeriksaan bukti transfer oleh admin.
                    </p>
                  </section>
                </div>
              )}
            </>
          )}
          <footer className="page-footer">
            CV. Delta Sinergi Utama{" "}
            <span>Inventory · Monitoring · Online Order</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
