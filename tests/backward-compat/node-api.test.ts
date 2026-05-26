import { expect, test } from "bun:test"
import {
  encodePNGToBuffer,
  pureImageFactory,
  renderGLTFToPNGBuffer,
} from "../../lib"

function expectPngSignature(bytes: Uint8Array) {
  expect(bytes[0]).toBe(0x89)
  expect(bytes[1]).toBe(0x50)
  expect(bytes[2]).toBe(0x4e)
  expect(bytes[3]).toBe(0x47)
}

test("root renderGLTFToPNGBuffer keeps supporting filesystem paths in Node", async () => {
  const pngBuffer = await renderGLTFToPNGBuffer("./tests/basics/soic8.gltf", {
    width: 96,
    height: 96,
  })

  expect(Buffer.isBuffer(pngBuffer)).toBe(true)
  expect(pngBuffer.length).toBeGreaterThan(100)
  expectPngSignature(pngBuffer)
})

test("encodePNGToBuffer keeps returning a Node Buffer at runtime", async () => {
  const image = pureImageFactory(2, 2)
  const pngBuffer = await encodePNGToBuffer(image)

  expect(Buffer.isBuffer(pngBuffer)).toBe(true)
  expect(pngBuffer.length).toBeGreaterThan(10)
  expectPngSignature(pngBuffer)
})
