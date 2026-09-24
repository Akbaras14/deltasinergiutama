import {
  availableStock,
  type NurseryReadService,
  type NurserySnapshot,
  type Product,
  type CustomerContact,
  type OrderStatus,
} from "@dsu/contracts";

export interface ShopProduct extends Product {
  available: number;
}
export interface BasketLine {
  productId: string;
  quantity: number;
  unitPrice: number;
  name: string;
}
export interface ShopOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: BasketLine[];
  total: number;
  contact: CustomerContact;
}
export interface ShopState {
  products: ShopProduct[];
  cart: BasketLine[];
  orders: ShopOrder[];
}
export interface CustomerService {
  read(): Promise<ShopState>;
  snapshot(): ShopState;
  add(productId: string, quantity: number): ShopState;
  update(productId: string, quantity: number): ShopState;
  remove(productId: string): ShopState;
  checkout(contact: CustomerContact, key: string): Promise<ShopOrder>;
  submitProof(orderId: string, file: { type: string; size: number }): ShopState;
}

/** Validates customer input in the mock boundary. Production must repeat validation server-side. */
export function contactErrors(
  contact: CustomerContact,
): Partial<Record<keyof CustomerContact, string>> {
  const errors: Partial<Record<keyof CustomerContact, string>> = {};
  if (contact.name.trim().length < 2 || contact.name.trim().length > 100)
    errors.name = "Isi nama penerima, 2–100 karakter.";
  if (!/^(?:\+62|0)[0-9]{8,13}$/.test(contact.phone.replace(/[\s-]/g, "")))
    errors.phone = "Gunakan nomor Indonesia yang valid, misalnya 081234567890.";
  if (contact.address.trim().length < 8 || contact.address.trim().length > 500)
    errors.address = "Isi alamat kontak, 8–500 karakter.";
  return errors;
}

/** Session-only mock customer service. Owns quotes/reservations; no database or real payments. */
export function createCustomerService(
  reader: NurseryReadService,
): CustomerService {
  const state: ShopState = { products: [], cart: [], orders: [] };
  let busy = false;
  const requests = new Map<string, ShopOrder>();
  const reserved = new Map<string, number>();
  const snapshot = () => structuredClone(state);
  function catalog(source: NurserySnapshot): ShopProduct[] {
    return source.products
      .filter((p) => p.published)
      .map((p) => ({
        ...p,
        available: Math.max(
          0,
          source.batches
            .filter((b) => p.batchIds.includes(b.id))
            .reduce((sum, b) => sum + availableStock(b), 0) -
            (reserved.get(p.id) ?? 0),
        ),
      }));
  }
  function quantity(productId: string, value: number) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) throw new Error("Tanaman tidak lagi tersedia di katalog.");
    if (!Number.isSafeInteger(value) || value < 1)
      throw new Error("Jumlah harus berupa bilangan bulat minimal 1.");
    if (value > product.available)
      throw new Error(
        `Stok ${product.name} tersedia ${product.available} tanaman.`,
      );
    return product;
  }
  return {
    snapshot,
    async read() {
      state.products = catalog(await reader.read());
      return snapshot();
    },
    add(id, count) {
      if (busy) throw new Error("Tunggu proses checkout selesai.");
      const existing = state.cart.find((i) => i.productId === id);
      const next = (existing?.quantity ?? 0) + count;
      if (!Number.isSafeInteger(count) || count < 1)
        throw new Error("Jumlah harus minimal 1.");
      const p = quantity(id, next);
      if (existing) existing.quantity = next;
      else
        state.cart.push({
          productId: id,
          quantity: count,
          unitPrice: p.price,
          name: p.name,
        });
      return snapshot();
    },
    update(id, count) {
      if (busy) throw new Error("Tunggu proses checkout selesai.");
      quantity(id, count);
      const line = state.cart.find((i) => i.productId === id);
      if (!line) throw new Error("Tanaman tidak ada di keranjang.");
      line.quantity = count;
      return snapshot();
    },
    remove(id) {
      if (busy) throw new Error("Tunggu proses checkout selesai.");
      state.cart = state.cart.filter((i) => i.productId !== id);
      return snapshot();
    },
    async checkout(contact, key) {
      const previous = requests.get(key);
      if (previous) return structuredClone(previous);
      if (busy) throw new Error("Checkout sedang diproses.");
      if (!key) throw new Error("Referensi checkout tidak valid.");
      if (Object.keys(contactErrors(contact)).length)
        throw new Error("Periksa data penerima sebelum melanjutkan.");
      if (!state.cart.length) throw new Error("Keranjang masih kosong.");
      busy = true;
      try {
        state.products = catalog(await reader.read());
        let changed = false;
        for (const line of state.cart) {
          const product = quantity(line.productId, line.quantity);
          if (line.unitPrice !== product.price) {
            line.unitPrice = product.price;
            changed = true;
          }
        }
        if (changed)
          throw new Error(
            "Harga tanaman berubah. Periksa total terbaru, lalu konfirmasi ulang.",
          );
        const total = state.cart.reduce(
          (sum, line) => sum + line.quantity * line.unitPrice,
          0,
        );
        if (!Number.isSafeInteger(total) || total < 0)
          throw new Error("Total pesanan tidak valid.");
        const order: ShopOrder = {
          id: `SIM-${String(state.orders.length + 1).padStart(4, "0")}`,
          createdAt: new Date().toISOString(),
          status: "PENDING_PAYMENT",
          items: structuredClone(state.cart),
          total,
          contact: {
            name: contact.name.trim(),
            phone: contact.phone.trim(),
            address: contact.address.trim(),
          },
        };
        for (const line of state.cart) {
          reserved.set(
            line.productId,
            (reserved.get(line.productId) ?? 0) + line.quantity,
          );
          const p = state.products.find((p) => p.id === line.productId);
          if (p) p.available -= line.quantity;
        }
        state.orders.unshift(order);
        state.cart = [];
        requests.set(key, structuredClone(order));
        return structuredClone(order);
      } finally {
        busy = false;
      }
    },
    submitProof(id, file) {
      if (
        !["image/jpeg", "image/png", "application/pdf"].includes(file.type) ||
        file.size <= 0 ||
        file.size > 5 * 1024 * 1024
      )
        throw new Error(
          "Pilih JPG, PNG, atau PDF dengan ukuran maksimal 5 MB.",
        );
      const order = state.orders.find((o) => o.id === id);
      if (!order) throw new Error("Pesanan tidak ditemukan.");
      if (order.status !== "PENDING_PAYMENT")
        throw new Error("Bukti pesanan ini sudah menunggu verifikasi.");
      order.status = "PAYMENT_REVIEW";
      return snapshot();
    },
  };
}
