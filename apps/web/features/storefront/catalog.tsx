"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ImageOff,
  Leaf,
  MapPin,
  Search,
  ShoppingBag,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  TreePine,
  Users,
  WalletCards,
  Headphones,
  CalendarCheck,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { rupiah } from "@/lib/demo";
import { useShop } from "./provider";
import type { ShopProduct } from "./service";
import { productPhotos } from "./product-photos";

export function ProductPhoto({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const photo = productPhotos[name];
  const [failed, setFailed] = useState(false);
  if (photo && !failed) {
    return (
      <div className={`shop-photo ${large ? "large" : ""}`}>
        <Image
          src={photo.src}
          alt={`Foto ilustrasi ${name}`}
          fill
          sizes={large ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 33vw"}
          className="shop-plant-image"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div
      className={`shop-photo ${large ? "large" : ""}`}
      role="img"
      aria-label={`Foto ${name} belum tersedia`}
    >
      <ImageOff size={large ? 48 : 32} strokeWidth={1} />
      <span>Foto tanaman belum tersedia</span>
      <small>PRODUK SIMULASI</small>
    </div>
  );
}
export function ProductCard({ product }: { product: ShopProduct }) {
  const { service, sync } = useShop();
  function add() {
    try {
      service.add(product.id, 1);
      sync();
      toast.success(`${product.name} ditambahkan ke keranjang.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambah tanaman.",
      );
    }
  }
  return (
    <article className="shop-product">
      <Link
        href={`/katalog/${product.id}`}
        className="shop-product-image"
        aria-label={`Lihat detail ${product.name}`}
      >
        <ProductPhoto name={product.name} />
        <span className={`shop-stock ${product.available ? "" : "sold-out"}`}>
          {product.available ? "Siap jual" : "Stok habis"}
        </span>
        <span className="shop-image-arrow">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="shop-product-info">
        <p className="shop-category">{product.category}</p>
        <Link href={`/katalog/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="shop-availability">
          {product.available} tanaman tersedia
        </p>
        <div className="shop-product-bottom">
          <strong>
            {rupiah(product.price)}
            <small>/ tanaman</small>
          </strong>
          <button
            onClick={add}
            className="shop-add"
            disabled={!product.available}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingBag size={18} />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </article>
  );
}
export function HomeContent() {
  const { state } = useShop();
  return (
    <>
      {/* --- Hero Section (full-width with image background) --- */}
      <section className="shop-hero">
        <figure className="shop-hero-bg">
          <Image
            src="/images/nursery-editorial.jpg"
            alt="Ilustrasi tanaman hijau di nursery"
            fill
            sizes="100vw"
            priority
          />
        </figure>
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <h1>
            Semua yang Anda Butuhkan
            <br />
            untuk{" "}
            <em className="shop-hero-script">Ruang Hijau</em>
          </h1>
          <span className="shop-hero-divider" />
          <p>
            Tips terpercaya, sumber daya berkualitas, dan layanan lokal untuk
            membantu tanaman Anda tumbuh subur sepanjang tahun.
          </p>
          <div className="shop-hero-actions">
            <Link href="/katalog" className="shop-button">
              Jelajahi Tanaman <Leaf size={18} />
            </Link>
            <a href="#cara-pesan" className="shop-button secondary">
              Lihat Layanan <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* --- 4 Feature Cards (icon bar) --- */}
      <section className="shop-features-bar">
        <div className="shop-features-inner">
          {[
            {
              icon: MapPin,
              title: "Temukan Nursery",
              text: "Temukan nursery dan taman layanan terdekat.",
            },
            {
              icon: CreditCard,
              title: "Kartu Layanan",
              text: "Akses layanan dan lacak riwayat Anda.",
            },
            {
              icon: CalendarCheck,
              title: "Acara & Workshop",
              text: "Ikuti workshop dan acara komunitas tanaman.",
            },
            {
              icon: Headphones,
              title: "Bantuan",
              text: "Dapatkan bantuan dari pakar perawatan tanaman kami.",
            },
          ].map((item) => (
            <div className="shop-feature-card" key={item.title}>
              <div className="shop-feature-icon">
                <item.icon size={24} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Grow Together Section --- */}
      <section className="shop-grow">
        <div className="shop-grow-inner">
          <div className="shop-grow-left">
            <span className="shop-eyebrow">
              <Leaf size={14} /> Tumbuh Bersama
            </span>
            <h2>
              Komunitas Anda,
              <br />
              Taman Anda
            </h2>
            <p>
              Terhubung dengan para pecinta tanaman lokal, berbagi pengetahuan,
              dan bangun ruang hijau yang lebih sehat bersama.
            </p>
            <div className="shop-grow-features">
              <div className="shop-grow-feature">
                <Users size={22} />
                <div>
                  <strong>Lebih Kuat Bersama</strong>
                  <p>Bergabung dengan komunitas yang peduli alam dan kelestarian.</p>
                </div>
              </div>
              <div className="shop-grow-feature">
                <Sprout size={22} />
                <div>
                  <strong>Berbagi & Belajar</strong>
                  <p>Tukar tips, bibit, dan pengalaman dengan sesama pencinta tanaman.</p>
                </div>
              </div>
            </div>
            <Link href="/katalog" className="shop-button">
              Selengkapnya <ArrowRight size={18} />
            </Link>
          </div>
          <div className="shop-grow-right">
            <figure className="shop-grow-image">
              <Image
                src="/images/nursery-editorial.jpg"
                alt="Komunitas berkebun bersama"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </figure>
            <div className="shop-grow-card">
              <Leaf size={18} />
              <div>
                <strong>Ciptakan Hari Esok yang Lebih Hijau</strong>
                <p>
                  Setiap tanaman yang kita tanam hari ini menjadi langkah
                  menuju masa depan yang lebih bersih dan hijau.
                </p>
              </div>
            </div>
            <div className="shop-grow-cta-card">
              <div className="shop-grow-cta-icon">
                <TreePine size={22} />
              </div>
              <div>
                <strong>Mulai Taman Komunitas Anda</strong>
                <p>
                  Kami akan memandu Anda langkah demi langkah untuk memulai dan
                  mengelola taman di area Anda.
                </p>
                <Link href="/katalog" className="shop-text-link">
                  Mulai Sekarang <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Services / Products Section (4 cards) --- */}
      <section className="shop-section">
        <div className="shop-section-heading shop-section-center">
          <div>
            <span className="shop-eyebrow">
              <Leaf size={14} /> Koleksi Kami
            </span>
            <h2>Layanan & Tanaman Profesional</h2>
          </div>
        </div>
        <div className="shop-products shop-products-4">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* --- How to Order Steps --- */}
      <section className="shop-steps" id="cara-pesan">
        <div>
          <span className="shop-eyebrow">MUDAH DARI AWAL</span>
          <h2>
            Dari pilihan Anda,
            <br />
            ke taman di rumah.
          </h2>
          <p>Tiga langkah untuk memesan tanaman.</p>
        </div>
        <ol>
          {[
            {
              title: "Pilih tanaman",
              text: "Jelajahi katalog, periksa ketersediaan, dan masukkan pilihan ke keranjang.",
            },
            {
              title: "Konfirmasi & bayar",
              text: "Lengkapi data pengambilan. Bukti transfer akan diperiksa oleh admin.",
            },
            {
              title: "Ambil di nursery",
              text: "Pantau status pesanan dan ambil tanaman setelah berstatus Siap Diambil.",
            },
          ].map((item, index) => (
            <li key={item.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
export function CatalogContent() {
  const { state } = useShop();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua tanaman");
  const [sort, setSort] = useState("name");
  const products = state.products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        (category === "Semua tanaman" || p.category === category),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : a.name.localeCompare(b.name),
    );
  return (
    <section className="shop-section shop-catalog">
      <div className="shop-breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>Katalog
      </div>
      <div className="shop-section-heading">
        <div>
          <span className="shop-eyebrow">PILIHAN UNTUK RUANG ANDA</span>
          <h1>Katalog tanaman</h1>
          <p>Temukan tanaman siap jual, dari nursery untuk taman Anda.</p>
        </div>
        <span className="shop-count">
          {state.products.length} tanaman dalam koleksi
        </span>
      </div>
      <div className="shop-catalog-tools">
        <label className="shop-search">
          <Search size={20} />
          <span className="sr-only">Cari tanaman</span>
          <input
            placeholder="Cari nama tanaman…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="shop-sort">
          <SlidersHorizontal size={18} />
          <span className="sr-only">Urutkan tanaman</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Nama A–Z</option>
            <option value="low">Harga terendah</option>
            <option value="high">Harga tertinggi</option>
          </select>
        </label>
      </div>
      <div className="shop-categories" aria-label="Kategori tanaman">
        {[
          "Semua tanaman",
          "Tanaman hias",
          "Pohon pelindung",
          "Tanaman pagar",
        ].map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {category === item && <Check size={15} />} {item}
          </button>
        ))}
      </div>
      <div className="shop-results" aria-live="polite">
        Menampilkan {products.length} tanaman{query && ` untuk "${query}"`}
      </div>
      {products.length ? (
        <div className="shop-products">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <Search size={36} />
          <h2>Tanaman belum ditemukan</h2>
          <p>Coba nama tanaman atau kategori lainnya.</p>
          <button
            className="shop-button secondary"
            onClick={() => {
              setQuery("");
              setCategory("Semua tanaman");
            }}
          >
            Reset pencarian
          </button>
        </div>
      )}
    </section>
  );
}
export function DetailContent({ id }: { id: string }) {
  const { state, service, sync } = useShop();
  const product = state.products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  if (!product)
    return (
      <div className="shop-empty">
        <h1>Tanaman tidak ditemukan</h1>
        <p>Produk mungkin belum dipublikasikan.</p>
        <Link href="/katalog" className="shop-button">
          Kembali ke katalog
        </Link>
      </div>
    );
  function add() {
    if (!product) return;
    try {
      service.add(product.id, quantity);
      sync();
      setAdded(true);
      setError("");
      toast.success("Tanaman ditambahkan ke keranjang.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal menambah tanaman.",
      );
    }
  }
  return (
    <section className="shop-section">
      <div className="shop-breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <Link href="/katalog">Katalog</Link>
        <span>/</span>
        {product.name}
      </div>
      <div className="shop-detail">
        <div>
          <ProductPhoto name={product.name} large />
          {productPhotos[product.name] && (
            <p className="shop-photo-credit">
              Foto ilustrasi · {" "}
              <a href={productPhotos[product.name].source} target="_blank" rel="noreferrer">
                {productPhotos[product.name].author} / Wikimedia Commons
              </a>{" "}
              · <a href={productPhotos[product.name].license} target="_blank" rel="noreferrer">Lisensi foto</a>
              . Tampilan dipotong sesuai bingkai; bukan foto stok nursery.
            </p>
          )}
        </div>
        <div className="shop-detail-info">
          <span className="shop-eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="shop-detail-price">
            {rupiah(product.price)}
            <small>/ tanaman</small>
          </p>
          <span className="shop-available">
            <Check size={16} />
            {product.available} tanaman tersedia
          </span>
          <p className="shop-description">{product.description}</p>
          <p className="shop-caption">
            Foto dan spesifikasi ukuran aktual belum tersedia. Informasi ini
            merupakan contoh untuk simulasi pemesanan.
          </p>
          <label htmlFor="plant-quantity" className="shop-field-label">
            Jumlah tanaman
          </label>
          <div className="shop-detail-actions">
            <div className="shop-quantity">
              <button
                aria-label="Kurangi jumlah"
                disabled={quantity <= 1}
                onClick={() => setQuantity((v) => v - 1)}
              >
                −
              </button>
              <input
                id="plant-quantity"
                type="number"
                min={1}
                max={product.available}
                step={1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  setAdded(false);
                }}
                aria-describedby={error ? "quantity-error" : undefined}
              />
              <button
                aria-label="Tambah jumlah"
                disabled={quantity >= product.available}
                onClick={() => setQuantity((v) => v + 1)}
              >
                +
              </button>
            </div>
            <button
              className="shop-button"
              onClick={add}
              disabled={!product.available}
            >
              <ShoppingBag size={18} />
              Tambah ke keranjang
            </button>
          </div>
          {error && (
            <p className="shop-error" id="quantity-error" role="alert">
              {error}
            </p>
          )}
          {added && (
            <p className="shop-success" role="status">
              Ditambahkan. <Link href="/keranjang">Lihat keranjang →</Link>
            </p>
          )}
          <div className="shop-pickup-note">
            <MapPin size={22} />
            <div>
              <strong>Pengambilan di nursery</strong>
              <p>
                Pesanan dapat diambil setelah pembayaran terverifikasi dan
                tanaman siap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
