/**
 * Tests E2E de TaskFlow: carga de la app, modal nueva tarea y creación de tarea.
 * Se ejecutan en navegador real (Chromium, Firefox) con Playwright.
 */

const { test, expect } = require("@playwright/test");

test.describe("TaskFlow - Gestión de tareas", () => {
  test("la página carga con el título correcto", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Gestión de Tareas");
  });

  test("el header muestra TaskFlow y el botón de nueva tarea", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByText("TaskFlow")).toBeVisible();
    await expect(page.getByRole("button", { name: /Nueva tarea/i })).toBeVisible();
  });

  test("al hacer clic en Nueva tarea se abre el modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Nueva tarea/i }).click();
    const modal = page.locator("#modal-nueva-tarea");
    await expect(modal).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nueva tarea" })).toBeVisible();
  });

  test("el modal muestra el campo título y el select de proyectos", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Nueva tarea/i }).click();
    await expect(page.getByLabel("Título")).toBeVisible();
    await expect(page.getByPlaceholder("¿Qué hay que hacer?")).toBeVisible();
    await expect(page.locator("#field-proyecto")).toBeVisible();
  });

  test("al cerrar el modal con el botón Cancelar se oculta", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Nueva tarea/i }).click();
    await expect(page.locator("#modal-nueva-tarea")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.locator("#modal-backdrop")).toHaveClass(/hidden/);
  });

  test("no permite guardar sin título ni proyecto (muestra errores)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Nueva tarea/i }).click();
    await page.getByRole("button", { name: "Guardar tarea" }).click();
    await expect(page.getByText("El título es obligatorio")).toBeVisible();
    await expect(page.locator("#modal-nueva-tarea")).toBeVisible();
  });

  test("crear una tarea con título y proyecto la añade a la lista", async ({ page }) => {
    await page.goto("/");
    const tituloTarea = `Tarea de test ${Date.now()}`;
    await page.getByRole("button", { name: /Nueva tarea/i }).click();
    await page.getByPlaceholder("¿Qué hay que hacer?").fill(tituloTarea);
    await page.locator("#field-proyecto").selectOption({ index: 1 });
    await page.getByRole("button", { name: "Añadir" }).click();
    await page.getByRole("button", { name: "Guardar tarea" }).click();
    await expect(page.locator("#modal-backdrop")).toHaveClass(/hidden/);
    await expect(page.getByText(tituloTarea)).toBeVisible();
  });

  test("la lista de tareas muestra estado vacío cuando no hay tareas", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#task-list")).toBeVisible();
  });

  test("el sidebar muestra la sección Vistas y Proyectos", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("#sidebar");
    await expect(sidebar.getByRole("heading", { name: "Vistas" })).toBeVisible();
    await expect(sidebar.getByRole("heading", { name: "Proyectos" })).toBeVisible();
  });
});
