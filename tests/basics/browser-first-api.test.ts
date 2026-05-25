import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import {
  createSceneFromGLTF,
  encodePNG,
  pureImageFactory,
  renderGLTFToPNGFromGLB,
  renderGLTFToPNGFromURL,
  renderSceneFromGLTF,
} from "../../lib/index.ts"

const PNG_SIGNATURE = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
])

function expectPngBytes(bytes: Uint8Array) {
  expect(bytes).toBeInstanceOf(Uint8Array)
  expect(bytes).not.toBeInstanceOf(Buffer)
  expect(Array.from(bytes.subarray(0, PNG_SIGNATURE.length))).toEqual(
    Array.from(PNG_SIGNATURE),
  )
}

test("encodePNG returns plain Uint8Array", async () => {
  const scene = createSceneFromGLTF({ asset: { version: "2.0" } }, {
    buffers: [],
    images: [],
  })
  const { bitmap } = renderSceneFromGLTF(
    scene,
    { width: 16, height: 16 },
    pureImageFactory,
  )

  const png = await encodePNG(bitmap)

  expectPngBytes(png)
})

test("renderGLTFToPNGFromGLB returns plain Uint8Array", async () => {
  const glbPath = fileURLToPath(
    new URL("../fixtures/assets/arduino-uno.glb", import.meta.url),
  )
  const glb = await readFile(glbPath)

  const png = await renderGLTFToPNGFromGLB(glb, {
    width: 128,
    height: 96,
  })

  expectPngBytes(png)
})

test("renderGLTFToPNGFromURL returns plain Uint8Array", async () => {
  const gltfJson = JSON.stringify({ asset: { version: "2.0" } })
  const sourceBytes = new TextEncoder().encode(gltfJson)

  const png = await renderGLTFToPNGFromURL("https://example.com/empty.gltf", {
    width: 32,
    height: 24,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      url: "https://example.com/empty.gltf",
      arrayBuffer: async () => sourceBytes.slice().buffer as ArrayBuffer,
    }),
  })

  expectPngBytes(png)
})
