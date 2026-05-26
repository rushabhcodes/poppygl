import { expect, test } from "@playwright/test"

// Enable this when the root browser entrypoint is browser-safe and backward-compatible.
test.skip("browser root export renders without Node globals and rejects filesystem paths separately", async ({
  page,
}) => {
  const fixtureId = encodeURIComponent(
    JSON.stringify({ path: "site/examples/browser-compat.page.tsx" }),
  )

  await page.goto(`/renderer.html?fixtureId=${fixtureId}&locked=true`)

  await expect(
    page.getByRole("heading", { name: "Browser Compatibility Fixture" }),
  ).toBeVisible()

  await expect
    .poll(async () => {
      return await page.getByTestId("compat-state").textContent()
    })
    .not.toContain('"status": "running"')

  const result = JSON.parse(
    (await page.getByTestId("compat-state").textContent()) ?? "null",
  )
  expect(result.status).toBe("done")

  expect(result.globalsBeforeImport.hasBufferGlobal).toBe(false)
  expect(result.globalsBeforeImport.hasProcessGlobal).toBe(false)

  expect(result.inMemory.isUint8Array).toBe(true)
  expect(result.inMemory.constructorName).toBe("Uint8Array")
  expect(result.inMemory.length).toBeGreaterThan(100)

  expect(result.url.isUint8Array).toBe(true)
  expect(result.url.constructorName).toBe("Uint8Array")
  expect(result.url.length).toBeGreaterThan(100)

  expect(result.browserPathError).toContain(
    "could not parse the input as GLTF JSON",
  )
  expect(result.browserPathError).toContain("fetchable URL")
})
