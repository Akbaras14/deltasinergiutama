import { test, expect } from "@playwright/test";
test("mobile drawer supports keyboard close and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/petugas");
  const trigger = page.getByRole("button", { name: "Buka navigasi" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Riwayat monitoring" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Riwayat monitoring" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("customer history starts empty in a new demo session", async ({
  page,
}) => {
  await page.goto("/akun");
  await expect(
    page.getByRole("heading", { name: "Belum ada pesanan" }),
  ).toBeVisible();
});
test("admin stock, search, detail and response states", async ({ page }) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Ringkasan nursery" }),
  ).toBeVisible();
  await expect(page.getByText("605", { exact: false }).first()).toBeVisible();
  await page.getByRole("textbox", { name: "Cari batch" }).fill("Monstera");
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByRole("button", { name: "Lihat BT-26001" }).click();
  await expect(
    page.getByRole("button", { name: "Tutup detail" }),
  ).toBeVisible();
  await page.getByText("Skenario tampilan").click();
  await page.getByLabel("Respons data").selectOption("empty");
  await expect(page.getByText("Tidak ada batch ditemukan")).toBeVisible();
  await page.getByLabel("Respons data").selectOption("error");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "gagal dimuat",
  );
  await page.getByRole("button", { name: "Coba lagi" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  await page.getByLabel("Respons data").selectOption("normal");
  await expect(page.getByRole("row")).toHaveCount(2);
});
test("petugas only sees assigned batches and sample context", async ({
  page,
}) => {
  await page.goto("/petugas");
  await expect(
    page.getByText("BT-26001", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText("Tabebuya rosea")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Inventory tanaman" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Riwayat monitoring" }).click();
  await expect(page.getByText("Sampel acak · 3 sampel · WIB")).toBeVisible();
});
test("catalog shows available stock rather than physical stock", async ({
  page,
}) => {
  await page.goto("/katalog");
  await expect(page.getByText("68 tanaman tersedia")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Cari tanaman" })
    .fill("tidak ditemukan");
  await expect(
    page.getByRole("heading", { name: "Tanaman belum ditemukan" }),
  ).toBeVisible();
});
test("responsive layouts and screenshots", async ({ page }) => {
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["admin", "petugas", "katalog"]) {
      await page.goto(`/${route}`);
      await expect(page.getByText("Memuat data nursery…")).toHaveCount(0);
      await expect(
        page.locator(".stock-summary, .shop-products").first(),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `docs/testing/${route}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
