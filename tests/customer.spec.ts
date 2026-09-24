import { test, expect } from "@playwright/test";

test("customer journey: detail, cart, checkout validation and payment review", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("link", { name: "Jelajahi tanaman", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Lihat detail Monstera deliciosa" })
    .click();
  await page.getByLabel("Jumlah tanaman").fill("999");
  await page
    .getByRole("button", { name: "Tambah ke keranjang", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "tersedia 68",
  );
  await page.getByLabel("Jumlah tanaman").fill("2");
  await page
    .getByRole("button", { name: "Tambah ke keranjang", exact: true })
    .click();
  await page.getByRole("link", { name: "Lihat keranjang" }).click();
  await expect(
    page.getByRole("heading", { name: "Keranjang tanaman" }),
  ).toBeVisible();
  await expect(page.getByLabel("Jumlah Monstera deliciosa")).toHaveValue("2");
  await page.getByRole("link", { name: "Lanjut ke checkout" }).click();
  await page.getByRole("button", { name: "Buat pesanan simulasi" }).click();
  await expect(
    page.getByText("Isi nama penerima, 2–100 karakter."),
  ).toBeVisible();
  await page.getByLabel("Nama penerima").fill("Pelanggan Demo");
  await page.getByLabel("Nomor telepon").fill("081234567890");
  await page.getByLabel("Alamat kontak").fill("Jalan Contoh Nomor 10, Bandung");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Buat pesanan simulasi" }).click();
  await expect(
    page.getByRole("heading", { name: "Pesanan saya" }),
  ).toBeVisible();
  await expect(
    page.getByText("Menunggu pembayaran", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Detail pembayaran" }).click();
  await page
    .getByLabel("Bukti pembayaran SIM-0001")
    .setInputFiles({
      name: "contoh.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("simulation"),
    });
  await page.getByRole("button", { name: "Kirim bukti simulasi" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "maksimal 5 MB",
  );
  await page
    .getByLabel("Bukti pembayaran SIM-0001")
    .setInputFiles({
      name: "contoh.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 demo"),
    });
  await page.getByRole("button", { name: "Kirim bukti simulasi" }).click();
  await expect(
    page.getByText("Menunggu verifikasi", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke katalog" }).click();
  await expect(page.getByText("66 tanaman tersedia")).toBeVisible();
  expect(errors).toEqual([]);
});
test("category filtering, sorting and empty cart recovery", async ({
  page,
}) => {
  await page.goto("/katalog");
  await page.getByRole("button", { name: "Tanaman pagar" }).click();
  await expect(
    page.getByRole("heading", { name: "Tanaman belum ditemukan" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset pencarian" }).click();
  await page.getByLabel("Urutkan tanaman").selectOption("low");
  await expect(page.locator(".shop-product").first()).toContainText(
    "Philodendron",
  );
  await page
    .getByRole("button", { name: "Tambah Philodendron selloum ke keranjang" })
    .click();
  await page.getByRole("link", { name: "Keranjang, 1 tanaman" }).click();
  await page
    .getByRole("button", { name: "Hapus Philodendron selloum" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Keranjang masih kosong" }),
  ).toBeVisible();
});
test("customer pages remain within mobile, tablet and desktop viewports", async ({
  page,
}) => {
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/katalog",
      "/katalog/monstera",
      "/keranjang",
      "/akun",
    ]) {
      await page.goto(route);
      await expect(page.getByText("Memuat data nursery…")).toHaveCount(0);
      await expect(page.locator(".shop-main h1").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      if (route === "/" || route === "/katalog/monstera")
        await page.screenshot({
          path: `docs/testing/customer-${route === "/" ? "home" : "detail"}-${width}.png`,
          fullPage: true,
        });
    }
  }
});
