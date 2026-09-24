import { test } from "node:test";
import assert from "node:assert/strict";
import type { NurserySnapshot } from "@dsu/contracts";
import { createCustomerService } from "./service";
function fixture(): NurserySnapshot {
  return {
    batches: [
      {
        id: "b1",
        species: "Monstera",
        category: "Hias",
        location: "A",
        plantedAt: "2026-01-01",
        assignedTo: "staff",
        physical: 10,
        approved: 3,
        reserved: 1,
      },
    ],
    products: [
      {
        id: "p1",
        name: "Monstera",
        category: "Hias",
        description: "Simulasi",
        price: 85000,
        batchIds: ["b1"],
        published: true,
      },
    ],
    orders: [],
    observations: [],
  };
}
const contact = {
  name: "Pelanggan Demo",
  phone: "081234567890",
  address: "Jalan Contoh Nomor 10",
};
test("ORD-02: cart does not reserve and rejects invalid/excess quantities", async () => {
  const service = createCustomerService({ read: async () => fixture() });
  await service.read();
  service.add("p1", 1);
  assert.equal(service.snapshot().products[0].available, 2);
  assert.throws(() => service.add("p1", 2));
  assert.throws(() => service.update("p1", 1.5));
  assert.throws(() => service.update("p1", 0));
  assert.throws(() => service.add("p1", -1));
  service.remove("p1");
  assert.equal(service.snapshot().cart.length, 0);
});
test("ORD-03 / ORD-05: checkout retry creates one reservation and proof is not paid", async () => {
  const service = createCustomerService({ read: async () => fixture() });
  await service.read();
  service.add("p1", 2);
  const first = await service.checkout(contact, "retry-key");
  const repeated = await service.checkout(contact, "retry-key");
  assert.equal(first.id, repeated.id);
  assert.equal(service.snapshot().orders.length, 1);
  assert.equal(service.snapshot().products[0].available, 0);
  assert.equal(first.total, 170000);
  assert.equal(first.status, "PENDING_PAYMENT");
  assert.throws(() =>
    service.submitProof(first.id, { type: "text/html", size: 500 }),
  );
  assert.throws(() =>
    service.submitProof(first.id, { type: "image/png", size: 6 * 1024 * 1024 }),
  );
  service.submitProof(first.id, { type: "image/png", size: 100 });
  assert.equal(service.snapshot().orders[0].status, "PAYMENT_REVIEW");
  assert.throws(() =>
    service.submitProof(first.id, { type: "image/png", size: 100 }),
  );
});
test("ORD-03: stock and prices are rechecked at checkout; failed checkout retains cart", async () => {
  const source = fixture();
  const service = createCustomerService({
    read: async () => structuredClone(source),
  });
  await service.read();
  service.add("p1", 2);
  source.batches[0].reserved = 2;
  await assert.rejects(service.checkout(contact, "stock"), /tersedia 1/);
  assert.equal(service.snapshot().cart.length, 1);
  assert.equal(service.snapshot().orders.length, 0);
  source.batches[0].reserved = 1;
  source.products[0].price = 90000;
  await assert.rejects(
    service.checkout(contact, "price"),
    /Harga tanaman berubah/,
  );
  assert.equal(service.snapshot().cart[0].unitPrice, 90000);
  const order = await service.checkout(contact, "price");
  assert.equal(order.total, 180000);
});
test("ORD-04: contact validation and empty cart cannot create orders", async () => {
  const service = createCustomerService({ read: async () => fixture() });
  await service.read();
  await assert.rejects(service.checkout(contact, "empty"), /kosong/);
  service.add("p1", 1);
  await assert.rejects(
    service.checkout({ ...contact, phone: "123" }, "bad"),
    /data penerima/,
  );
  assert.equal(service.snapshot().orders.length, 0);
});
