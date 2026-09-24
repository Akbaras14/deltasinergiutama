"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  FileUp,
  MapPin,
  ShoppingBag,
  Trash2,
  WalletCards,
} from "lucide-react";
import { orderLabels, type CustomerContact } from "@dsu/contracts";
import { rupiah, localDate } from "@/lib/demo";
import { useShop } from "./provider";
import { contactErrors } from "./service";
import { ProductPhoto } from "./catalog";

export function EmptyCart() {
  return (
    <div className="shop-empty">
      <ShoppingBag size={42} strokeWidth={1.2} />
      <span className="shop-eyebrow">PILIHAN ANDA MENUNGGU</span>
      <h1>Keranjang masih kosong</h1>
      <p>Mulai dengan menemukan tanaman untuk ruang Anda.</p>
      <Link href="/katalog" className="shop-button">
        Jelajahi tanaman <ArrowRight size={18} />
      </Link>
    </div>
  );
}
export function OrderSummary({
  checkout = false,
  pending = false,
}: {
  checkout?: boolean;
  pending?: boolean;
}) {
  const { state } = useShop();
  const total = state.cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  return (
    <aside className="shop-summary">
      <h2>Ringkasan pesanan</h2>
      {state.cart.map((item) => (
        <div className="shop-summary-line" key={item.productId}>
          <span>
            {item.name}
            <small>
              {item.quantity} × {rupiah(item.unitPrice)}
            </small>
          </span>
          <strong>{rupiah(item.quantity * item.unitPrice)}</strong>
        </div>
      ))}
      <div className="shop-summary-row">
        <span>Pengambilan di nursery</span>
        <span>Tanpa ongkir</span>
      </div>
      <div className="shop-total">
        <span>Total</span>
        <strong>{rupiah(total)}</strong>
      </div>
      {checkout ? (
        <button
          type="submit"
          form="checkout-form"
          className="shop-button"
          disabled={pending}
        >
          {pending ? "Memproses simulasi…" : "Buat pesanan simulasi"}
          <ArrowRight size={18} />
        </button>
      ) : (
        <Link href="/checkout" className="shop-button">
          Lanjut ke checkout <ArrowRight size={18} />
        </Link>
      )}
      <p className="shop-caption">
        <ShieldText />{" "}
        {checkout
          ? "Pesanan ini hanya simulasi, tidak meminta transfer uang nyata."
          : "Stok belum direservasi selama tanaman berada di keranjang."}
      </p>
    </aside>
  );
}
function ShieldText() {
  return <Check size={14} aria-hidden="true" />;
}
export function CartContent() {
  const { state, service, sync } = useShop();
  const [error, setError] = useState("");
  if (!state.cart.length) return <EmptyCart />;
  function update(id: string, count: number) {
    try {
      service.update(id, count);
      sync();
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Jumlah tidak valid.");
    }
  }
  return (
    <section className="shop-section">
      <div className="shop-breadcrumb">
        <Link href="/katalog">Katalog</Link>
        <span>/</span>Keranjang
      </div>
      <div className="shop-section-heading">
        <div>
          <span className="shop-eyebrow">PILIHAN ANDA</span>
          <h1>Keranjang tanaman</h1>
          <p>
            {state.cart.length} jenis tanaman, satu langkah lebih dekat ke taman
            Anda.
          </p>
        </div>
        <Link className="shop-text-link" href="/katalog">
          Lanjut berbelanja <ArrowRight size={18} />
        </Link>
      </div>
      {error && (
        <p role="alert" className="shop-error">
          {error}
        </p>
      )}
      <div className="shop-checkout-grid">
        <div className="shop-cart-list">
          {state.cart.map((item) => (
            <article className="shop-cart-line" key={item.productId}>
              <div className="shop-cart-photo">
                <ProductPhoto name={item.name} />
              </div>
              <div className="shop-cart-item">
                <Link href={`/katalog/${item.productId}`}>
                  <h2>{item.name}</h2>
                </Link>
                <p>{rupiah(item.unitPrice)} / tanaman</p>
                <div className="shop-quantity">
                  <button
                    aria-label={`Kurangi ${item.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() => update(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    aria-label={`Jumlah ${item.name}`}
                    value={item.quantity}
                    onChange={(e) =>
                      update(item.productId, Number(e.target.value))
                    }
                  />
                  <button
                    aria-label={`Tambah ${item.name}`}
                    onClick={() => update(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="shop-cart-end">
                <strong>{rupiah(item.unitPrice * item.quantity)}</strong>
                <button
                  aria-label={`Hapus ${item.name}`}
                  onClick={() => {
                    service.remove(item.productId);
                    sync();
                    setError("");
                  }}
                >
                  <Trash2 size={17} />
                  <span>Hapus</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <OrderSummary />
      </div>
    </section>
  );
}
export function CheckoutContent() {
  const { state, service, sync } = useShop();
  const router = useRouter();
  const [contact, setContact] = useState<CustomerContact>({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerContact, string>>
  >({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const key = useRef("");
  if (!state.cart.length) return <EmptyCart />;
  async function submit(event: FormEvent) {
    event.preventDefault();
    const next = contactErrors(contact);
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`customer-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    if (!confirmed) {
      setError(
        "Centang konfirmasi pengambilan dan simulasi sebelum melanjutkan.",
      );
      return;
    }
    if (pending) return;
    setPending(true);
    setError("");
    if (!key.current) key.current = crypto.randomUUID();
    try {
      await service.checkout(contact, key.current);
      sync();
      router.push("/akun");
    } catch (e) {
      sync();
      setError(
        e instanceof Error ? e.message : "Pesanan belum berhasil dibuat.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="shop-section">
      <div className="shop-breadcrumb">
        <Link href="/keranjang">Keranjang</Link>
        <span>/</span>Checkout
      </div>
      <div className="shop-section-heading">
        <div>
          <span className="shop-eyebrow">LANGKAH TERAKHIR</span>
          <h1>Konfirmasi pesanan</h1>
          <p>
            Lengkapi data penerima dan periksa kembali pilihan tanaman Anda.
          </p>
        </div>
      </div>
      <div className="shop-checkout-grid">
        <form
          id="checkout-form"
          className="shop-checkout-form"
          onSubmit={submit}
          noValidate
        >
          <section className="shop-form-section">
            <h2>
              <span>01</span>Data penerima
            </h2>
            <p>Gunakan data contoh untuk mencoba simulasi.</p>
            {(
              [
                {
                  key: "name",
                  label: "Nama penerima",
                  placeholder: "Contoh: Andi Pratama",
                  type: "text",
                },
                {
                  key: "phone",
                  label: "Nomor telepon",
                  placeholder: "Contoh: 081234567890",
                  type: "tel",
                },
                {
                  key: "address",
                  label: "Alamat kontak",
                  placeholder: "Contoh: Jalan Melati No. 10, Bandung",
                  type: "text",
                },
              ] as const
            ).map((field) => (
              <label className="shop-field" key={field.key}>
                {field.label}
                <span aria-hidden="true"> *</span>
                <input
                  id={`customer-${field.key}`}
                  type={field.type}
                  value={contact[field.key]}
                  autoComplete="off"
                  disabled={pending}
                  required
                  placeholder={field.placeholder}
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={
                    errors[field.key] ? `error-${field.key}` : undefined
                  }
                  onChange={(e) =>
                    setContact({ ...contact, [field.key]: e.target.value })
                  }
                />
                {errors[field.key] && (
                  <small className="shop-error" id={`error-${field.key}`}>
                    {errors[field.key]}
                  </small>
                )}
              </label>
            ))}
          </section>
          <section className="shop-form-section">
            <h2>
              <span>02</span>Metode pengambilan
            </h2>
            <div className="shop-option">
              <MapPin size={24} />
              <div>
                <strong>Ambil di nursery</strong>
                <p>
                  Lokasi dan jadwal dikonfirmasi admin setelah pesanan siap.
                  Tidak ada pengiriman pada demo ini.
                </p>
              </div>
              <Check size={18} />
            </div>
          </section>
          <section className="shop-form-section">
            <h2>
              <span>03</span>Pembayaran
            </h2>
            <div className="shop-option">
              <WalletCards size={24} />
              <div>
                <strong>Transfer bank manual</strong>
                <p>
                  Bukti pembayaran diperiksa admin. Pada simulasi ini, jangan
                  melakukan transfer uang.
                </p>
              </div>
            </div>
          </section>
          <label className="shop-check">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={pending}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span>
              Saya memahami pesanan ini merupakan simulasi dengan pengambilan di
              nursery.
            </span>
          </label>
          {error && (
            <p className="shop-error" role="alert">
              {error}
            </p>
          )}
        </form>
        <OrderSummary checkout pending={pending} />
      </div>
    </section>
  );
}
export function OrdersContent() {
  const { state, service, sync } = useShop();
  const [error, setError] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  return (
    <section className="shop-section">
      <div className="shop-breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>Pesanan saya
      </div>
      <div className="shop-section-heading">
        <div>
          <span className="shop-eyebrow">AKUN PELANGGAN DEMO</span>
          <h1>Pesanan saya</h1>
          <p>Ikuti perjalanan pesanan tanaman Anda.</p>
        </div>
        <Link className="shop-text-link" href="/katalog">
          Kembali ke katalog <ArrowRight size={18} />
        </Link>
      </div>
      {error && (
        <p className="shop-error" role="alert">
          {error}
        </p>
      )}
      {!state.orders.length ? (
        <div className="shop-empty">
          <ShoppingBag size={40} />
          <h2>Belum ada pesanan</h2>
          <p>Pesanan dari checkout simulasi akan muncul di sini.</p>
          <Link href="/katalog" className="shop-button">
            Temukan tanaman
          </Link>
        </div>
      ) : (
        state.orders.map((order) => (
          <article className="shop-order" key={order.id}>
            <header>
              <div>
                <span className="shop-eyebrow">{order.id} · SIMULASI</span>
                <p>{localDate(order.createdAt)} · WIB</p>
              </div>
              <span className="shop-order-status">
                <Clock3 size={16} />
                {orderLabels[order.status]}
              </span>
            </header>
            <div className="shop-order-items">
              {order.items.map((item) => (
                <div key={item.productId}>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} × {rupiah(item.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
            <div className="shop-order-footer">
              <span>
                Pengambilan oleh <strong>{order.contact.name}</strong>
              </span>
              <strong>{rupiah(order.total)}</strong>
              <button
                className="shop-button secondary"
                onClick={() => {
                  setActive(active === order.id ? null : order.id);
                  setProofFile(null);
                  setError("");
                }}
              >
                {active === order.id ? "Tutup detail" : "Detail pembayaran"}
              </button>
            </div>
            {active === order.id && (
              <section className="shop-payment">
                <h2>Pembayaran transfer manual</h2>
                <p>
                  Ini pesanan simulasi. Rekening perusahaan belum tersedia;
                  jangan melakukan transfer. Gunakan berkas contoh untuk mencoba
                  unggah bukti.
                </p>
                {order.status === "PENDING_PAYMENT" ? (
                  <div className="shop-upload">
                    <FileUp size={22} />
                    <strong>Pilih bukti pembayaran contoh</strong>
                    <span>JPG, PNG, atau PDF · Maksimal 5 MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      aria-label={`Bukti pembayaran ${order.id}`}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setProofFile(file);
                        setError("");
                      }}
                    />
                    {proofFile && (
                      <>
                        <span>Berkas dipilih: {proofFile.name}</span>
                        <button
                          className="shop-button"
                          onClick={() => {
                            try {
                              service.submitProof(order.id, proofFile);
                              sync();
                              setProofFile(null);
                              setError("");
                            } catch (cause) {
                              setError(
                                cause instanceof Error
                                  ? cause.message
                                  : "Berkas tidak valid.",
                              );
                            }
                          }}
                        >
                          Kirim bukti simulasi
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="shop-success" role="status">
                    <Check size={18} /> Bukti contoh diterima. Status menunggu
                    verifikasi admin, belum lunas.
                  </div>
                )}
                <p className="shop-caption">
                  Berkas tidak diunggah atau disimpan ke server. Data demo
                  hilang saat halaman dimuat ulang.
                </p>
              </section>
            )}
          </article>
        ))
      )}
    </section>
  );
}
