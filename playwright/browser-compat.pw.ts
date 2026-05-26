import { expect, test } from "@playwright/test"

// Enable this when the root browser entrypoint is browser-safe and backward-compatible.
test.skip("browser root export renders without Node globals and rejects filesystem paths separately", async ({
  page,
}) => {
  await page.goto("/playwright/browser-compat.html")

  await expect
    .poll(async () => {
      return await page.evaluate(
        () =>
          (window as Window & { __poppyglCompat?: any }).__poppyglCompat
            ?.status ?? null,
      )
    })
    .not.toBe("running")

  const result = await page.evaluate(
    () => (window as Window & { __poppyglCompat?: any }).__poppyglCompat,
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
