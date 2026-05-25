import { encodePNG } from "../image/encodePNG"
import { createSceneFromGLTF } from "../gltf/createSceneFromGLTF"
import {
  loadGLTFWithResourcesFromURL,
  type LoadGLTFWithResourcesFromURLOptions,
} from "../gltf/loadGLTFWithResourcesFromURL"
import { pureImageFactory } from "../image/pureImageFactory"
import type { RenderOptionsInput } from "./getDefaultRenderOptions"
import { renderDrawCalls } from "./renderDrawCalls"

export interface RenderGLTFToPNGFromURLOptions
  extends RenderOptionsInput,
    LoadGLTFWithResourcesFromURLOptions {}

export async function renderGLTFToPNGFromURL(
  url: string,
  options: RenderGLTFToPNGFromURLOptions = {},
): Promise<Uint8Array> {
  const { fetchImpl, ...renderOptions } = options
  const { gltf, resources } = await loadGLTFWithResourcesFromURL(url, {
    fetchImpl,
  })
  const scene = createSceneFromGLTF(gltf, resources)
  const { bitmap } = renderDrawCalls(
    scene.drawCalls,
    renderOptions,
    pureImageFactory,
  )
  return encodePNG(bitmap)
}
