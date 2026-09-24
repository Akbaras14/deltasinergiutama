# UML awal — diturunkan dari PRD v2.0

Rancangan untuk F00.01–03, bukan klaim validasi lapangan.

```mermaid
flowchart LR
  A[ADMIN] --> I[Master dan ledger inventory]
  A --> T[Penugasan batch]
  T --> P[PETUGAS]
  P --> M[Observasi manual per sampel]
  M --> R[Pengajuan siap jual]
  R --> V[Persetujuan ADMIN]
  V --> K[Katalog dipublikasikan ADMIN]
  C[PELANGGAN] --> K
  K --> O[Checkout dan reservasi]
  O --> B[Unggah bukti transfer]
  B --> D[Verifikasi ADMIN]
  D --> F[Pengambilan dan pengeluaran stok]
  M --> Q[Laporan temuan]
  Q --> I
```

```mermaid
stateDiagram-v2
  [*] --> PENDING_PAYMENT
  PENDING_PAYMENT --> PAYMENT_REVIEW
  PAYMENT_REVIEW --> PAID
  PAID --> PROCESSING
  PROCESSING --> READY_FOR_PICKUP
  READY_FOR_PICKUP --> COMPLETED
  PAYMENT_REVIEW --> PAYMENT_REJECTED
  PAYMENT_REJECTED --> PENDING_PAYMENT: tenggat masih berlaku
  PENDING_PAYMENT --> EXPIRED
  PAYMENT_REVIEW --> EXPIRED
  PENDING_PAYMENT --> CANCELLED
  PAYMENT_REVIEW --> CANCELLED
```

Pengurangan stok fisik hanya saat pemenuhan atomik. Pelepasan reservasi tidak menambah fisik. Refund setelah pembayaran mengikuti kebijakan terpisah dengan audit.
