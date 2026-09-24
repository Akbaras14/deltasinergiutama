"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  LogIn,
  LogOut,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Leaf,
} from "lucide-react";
import { ErrorState, LoadingState } from "@/components/ui/feedback";
import {
  clearSession,
  subscribeSession,
  hasSession,
  hasServerSession,
} from "@/lib/session";
import { useShop } from "./provider";
import { CatalogContent, DetailContent, HomeContent } from "./catalog";
import { CartContent, CheckoutContent, OrdersContent } from "./purchase";
import { LoginContent } from "./login";
import "./storefront.css";
export type CustomerView =
  "home" | "catalog" | "detail" | "cart" | "checkout" | "orders" | "login";

/** Customer storefront layout; all displayed data and actions belong to the demo service. */
export function Storefront({ view, id }: { view: CustomerView; id?: string }) {
  const { state, loading, error, refresh, reset } = useShop();
  const pathname = usePathname();
  const count = state.cart.reduce((sum, line) => sum + line.quantity, 0);
  const session = useSyncExternalStore(
    subscribeSession,
    hasSession,
    hasServerSession,
  );
  return (
    <div className="shop">
      <div className="shop-announcement">
        <span>
          <Leaf size={12} /> Selamat datang di CV. Delta Sinergi Utama
        </span>
        <span className="shop-announcement-info">
          <span className="shop-announcement-hours">
            Sen – Sab: 08.00 – 17.00 WIB
          </span>
          <span className="shop-announcement-dot">·</span>
          <span className="shop-announcement-phone">
            <Phone size={12} /> (021) 123-4567
          </span>
        </span>
      </div>
      <header className="shop-header">
        <div className="shop-header-inner">
          <Link
            href="/"
            className="shop-brand"
            aria-label="CV. Delta Sinergi Utama — Beranda"
          >
            <strong>
              CV. Delta Sinergi Utama<span>.</span>
            </strong>
            <small>NURSERY & TANAMAN</small>
          </Link>
          <nav className="shop-nav" aria-label="Navigasi pelanggan">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              Beranda
            </Link>
            <Link
              href="/katalog"
              aria-current={
                pathname.startsWith("/katalog") ? "page" : undefined
              }
            >
              Katalog tanaman
            </Link>
            <Link href="/#cara-pesan">Cara pesan</Link>
            <Link
              href="/akun"
              aria-current={pathname === "/akun" ? "page" : undefined}
            >
              Pesanan saya
            </Link>
          </nav>
          <div className="shop-header-actions">
            <Link
              href="/keranjang"
              className="shop-cart-link"
              aria-label={`Keranjang, ${count} tanaman`}
            >
              <ShoppingBag size={20} />
              <span className="shop-cart-label">Keranjang</span>
              <span className="shop-cart-count">{count}</span>
            </Link>
            {session ? (
              <button
                type="button"
                className="shop-login-link"
                onClick={() => {
                  clearSession();
                  reset();
                }}
              >
                <LogOut size={18} />
                <span>Keluar</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="shop-login-link"
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                <LogIn size={18} />
                <span>Masuk</span>
              </Link>
            )}
            {session && (
              <Link href="/katalog" className="shop-cta-button">
                Pesan Sekarang <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </header>
      <main id="main" className="shop-main">
        {view === "login" ? (
          <LoginContent />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : loading ? (
          <div className="shop-section">
            <LoadingState />
          </div>
        ) : view === "home" ? (
          <HomeContent />
        ) : view === "catalog" ? (
          <CatalogContent />
        ) : view === "detail" ? (
          <DetailContent id={id ?? ""} />
        ) : view === "cart" ? (
          <CartContent />
        ) : view === "checkout" ? (
          <CheckoutContent />
        ) : (
          <OrdersContent />
        )}
      </main>
      <section className="shop-newsletter">
        <div className="shop-newsletter-inner">
          <div className="shop-newsletter-text">
            <Leaf size={20} />
            <div>
              <strong>Dapatkan Info Terbaru tentang Tanaman & Penawaran</strong>
              <p>
                Berlangganan newsletter kami dan jangan lewatkan informasi
                terbaru!
              </p>
            </div>
          </div>
          <div className="shop-newsletter-form">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              aria-label="Masukkan email untuk berlangganan"
            />
            <button className="shop-button">
              Berlangganan <Mail size={16} />
            </button>
          </div>
        </div>
      </section>
      <footer className="shop-footer">
        <div className="shop-footer-top">
          <div>
            <Link href="/" className="shop-brand">
              <strong>
                CV. Delta Sinergi Utama<span>.</span>
              </strong>
              <small>NURSERY & TANAMAN</small>
            </Link>
            <p>
              Kami bersemangat membantu Anda menumbuhkan ruang yang lebih hijau
              dan komunitas yang lebih kuat.
            </p>
          </div>
          <div>
            <h2>Tautan Cepat</h2>
            <Link href="/">Beranda</Link>
            <Link href="/katalog">Katalog tanaman</Link>
            <Link href="/#cara-pesan">Cara pesan</Link>
            <Link href="/keranjang">Keranjang</Link>
          </div>
          <div>
            <h2>Informasi</h2>
            <Link href="/#cara-pesan">Panduan pemesanan</Link>
            <span>Transfer bank manual</span>
            <span>Pengambilan di nursery</span>
            <span>FAQ</span>
          </div>
          <div>
            <h2>Hubungi Kami</h2>
            <span className="shop-footer-contact">
              <Phone size={14} /> (021) 123-4567
            </span>
            <span className="shop-footer-contact">
              <Mail size={14} /> info@dsu-nursery.id
            </span>
            <span className="shop-footer-contact">
              <MapPin size={14} /> Jl. Tanaman Hijau No. 12, Bandung
            </span>
          </div>
        </div>
        <div className="shop-footer-bottom">
          <span>
            © 2026 CV. Delta Sinergi Utama. Seluruh hak cipta dilindungi.
          </span>
          <span>Demo sesi ini · Muat ulang untuk mengatur ulang data</span>
          <Link href="/admin">Portal internal</Link>
        </div>
      </footer>
    </div>
  );
}
