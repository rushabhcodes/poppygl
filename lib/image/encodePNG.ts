import type { BitmapLike } from "./createUint8Bitmap"
import { PassThrough } from "readable-stream"
import * as PImage from "pureimage"

export async function encodePNG(image: BitmapLike): Promise<Uint8Array> {
  const passThrough = new PassThrough()
  const chunks: Uint8Array[] = []

  passThrough.on("data", (chunk: any) => {
    chunks.push(chunk instanceof Uint8Array ? chunk : Uint8Array.from(chunk))
  })

  const resultPromise = new Promise<Uint8Array>((resolve, reject) => {
    passThrough.on("end", () => {
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const png = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        png.set(chunk, offset)
        offset += chunk.length
      }
      resolve(png)
    })
    passThrough.on("error", reject)
  })

  await PImage.encodePNGToStream(image as any, passThrough as any)
  return await resultPromise
}
