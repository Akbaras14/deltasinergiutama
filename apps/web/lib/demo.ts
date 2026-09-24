import type { NurseryReadService, NurserySnapshot } from "@dsu/contracts";
/** Deterministic simulated data; never represents company inventory. */
const seed: NurserySnapshot = {
  batches: [
    {
      id: "BT-26001",
      species: "Monstera deliciosa",
      category: "Tanaman hias",
      location: "Area A · Naungan",
      plantedAt: "2026-06-10",
      assignedTo: "petugas-demo",
      physical: 120,
      approved: 80,
      reserved: 12,
    },
    {
      id: "BT-26002",
      species: "Philodendron selloum",
      category: "Tanaman hias",
      location: "Area A · Naungan",
      plantedAt: "2026-07-02",
      assignedTo: "petugas-demo",
      physical: 85,
      approved: 40,
      reserved: 5,
    },
    {
      id: "BT-26003",
      species: "Tabebuya rosea",
      category: "Pohon pelindung",
      location: "Area B · Terbuka",
      plantedAt: "2026-05-15",
      assignedTo: "petugas-lain",
      physical: 160,
      approved: 60,
      reserved: 0,
    },
    {
      id: "BT-26004",
      species: "Syzygium myrtifolium",
      category: "Tanaman pagar",
      location: "Area C · Pembibitan",
      plantedAt: "2026-08-12",
      assignedTo: "petugas-demo",
      physical: 240,
      approved: 0,
      reserved: 0,
    },
  ],
  observations: [
    {
      id: "OBS-001",
      batchId: "BT-26001",
      observedBy: "petugas-demo",
      observedAt: "2026-09-22T08:00:00+07:00",
      method: "Sampel acak",
      sampleCount: 3,
      measurements: [
        { sampleNumber: 1, parameter: "Tinggi", unit: "cm", value: 42 },
        { sampleNumber: 2, parameter: "Tinggi", unit: "cm", value: 45 },
        { sampleNumber: 3, parameter: "Tinggi", unit: "cm", value: 39 },
      ],
      condition: "Sehat",
      notes: "Data simulasi; bukan standar agronomis.",
    },
  ],
  products: [
    {
      id: "monstera",
      name: "Monstera deliciosa",
      category: "Tanaman hias",
      description:
        "Tanaman berdaun lebar untuk area teduh. Data produk simulasi.",
      price: 85000,
      batchIds: ["BT-26001"],
      published: true,
    },
    {
      id: "philodendron",
      name: "Philodendron selloum",
      category: "Tanaman hias",
      description: "Tanaman hias untuk penataan taman. Data produk simulasi.",
      price: 65000,
      batchIds: ["BT-26002"],
      published: true,
    },
    {
      id: "tabebuya",
      name: "Tabebuya rosea",
      category: "Pohon pelindung",
      description: "Bibit pohon untuk area terbuka. Data produk simulasi.",
      price: 125000,
      batchIds: ["BT-26003"],
      published: true,
    },
  ],
  orders: [
    {
      id: "DSU-260923-001",
      customerId: "pelanggan-demo",
      status: "PAYMENT_REVIEW",
      createdAt: "2026-09-23T09:00:00+07:00",
      total: 170000,
    },
  ],
};
/** Creates an isolated mock reader with optional failure/empty states for UI validation. */
export function createDemoService(
  scenario: "normal" | "empty" | "error" = "normal",
): NurseryReadService {
  return {
    async read() {
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (scenario === "error")
        throw new Error("Data simulasi gagal dimuat. Silakan coba lagi.");
      return scenario === "empty"
        ? { batches: [], observations: [], products: [], orders: [] }
        : structuredClone(seed);
    },
  };
}
export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
export const localDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));

/* ========== Demo users for role-based login ========== */
import type { Role } from "@dsu/contracts";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

const demoUsers: DemoUser[] = [
  {
    id: "admin-demo",
    name: "Admin DSU",
    email: "admin@dsu.id",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: "petugas-demo",
    name: "Petugas Nursery",
    email: "petugas@dsu.id",
    password: "petugas123",
    role: "PETUGAS",
  },
  {
    id: "pelanggan-demo",
    name: "Budi Santoso",
    email: "budi@email.com",
    password: "budi1234",
    role: "PELANGGAN",
  },
];

/** Authenticate against demo users. Returns matched user or null. */
export function demoLogin(email: string, password: string): DemoUser | null {
  return (
    demoUsers.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    ) ?? null
  );
}

/** Returns the list of demo users (for displaying login hints). */
export function getDemoUsers(): DemoUser[] {
  return demoUsers;
}
