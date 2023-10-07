// @ts-check
import { test, expect } from "@playwright/test";

test("Page has loaded", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000");

    await expect(page).toHaveTitle("Toast Tests");
});

test("All test elements have loaded and toast container can be successfully mounted", async ({
    page,
}) => {
    await page.goto("http://127.0.0.1:3000");

    const toast_trigger = page.getByTestId("toast-trigger");
    const mount_toast_trigger = page.getByTestId("mount-toast");
    const toast_container = page.getByTestId("toast-container");

    expect(await toast_trigger.isVisible()).toBe(true);
    expect(await mount_toast_trigger.isVisible()).toBe(true);

    expect(await toast_trigger.textContent()).toBe("Show toast");
    expect(await mount_toast_trigger.textContent()).toBe(
        "Mount toast container",
    );

    await mount_toast_trigger.click();

    const toast_holder = page.getByTestId("toast-holder");

    expect(await toast_container.getAttribute("id")).toBe("toast-container");
    expect(await toast_container.getAttribute("title")).toBe("Notifications");

    expect(await toast_holder.getAttribute("id")).toBe("toast-holder");
});

test("Check if toast can be rendered successfully.", async ({
    page,
}, test_info) => {
    await page.goto("http://127.0.0.1:3000");

    const mount_toast_trigger = page.getByTestId("mount-toast");
    const toast_trigger = page.getByTestId("toast-trigger");

    await mount_toast_trigger.click();
    await toast_trigger.click();

    const toast = page.locator("[role='alert']");

    await toast.waitFor({
        state: "attached",
    });

    const screenshot = await toast.screenshot();

    await test_info.attach(
        "A screenshot to see if a toast rendered successfully",
        {
            body: screenshot,
            contentType: "image/png",
        },
    );

    expect(await toast.isVisible()).toBe(true);
    expect(await toast.textContent()).toBe("Hello, World!");

    await toast.waitFor({
        state: "detached",
    });

    expect(await toast.isVisible()).toBe(false);
});
