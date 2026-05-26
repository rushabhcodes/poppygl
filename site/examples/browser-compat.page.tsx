import React, { useEffect, useState } from "react"
import { renderGLTFToPNGBuffer } from "../../lib"

type CompatState =
  | { status: "running" }
  | {
      status: "done"
      globalsBeforeImport: {
        hasBufferGlobal: boolean
        hasProcessGlobal: boolean
      }
      inMemory: {
        isUint8Array: boolean
        constructorName: string
        length: number
      }
      url: {
        isUint8Array: boolean
        constructorName: string
        length: number
      }
      browserPathError: string
    }
  | {
      status: "error"
      message: string
      stack?: string
    }

const renderOptions = {
  width: 96,
  height: 72,
  grid: { size: 8 },
  camPos: [8, 6, 8] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
}

export default function BrowserCompatPage() {
  const [state, setState] = useState<CompatState>({ status: "running" })

  useEffect(() => {
    const run = async () => {
      try {
        const globalsBeforeImport = {
          hasBufferGlobal: typeof globalThis.Buffer !== "undefined",
          hasProcessGlobal: typeof globalThis.process !== "undefined",
        }

        const emptyGLTF = JSON.stringify({
          asset: { version: "2.0" },
          scenes: [{ nodes: [] }],
          scene: 0,
        })

        const inMemoryPng = await renderGLTFToPNGBuffer(
          emptyGLTF,
          renderOptions,
        )
        const urlPng = await renderGLTFToPNGBuffer(
          "/tests/basics/soic8.gltf",
          renderOptions,
        )

        let browserPathError = ""
        try {
          await renderGLTFToPNGBuffer("tests/basics/soic8.gltf", renderOptions)
        } catch (error) {
          browserPathError =
            error instanceof Error ? error.message : String(error)
        }

        setState({
          status: "done",
          globalsBeforeImport,
          inMemory: {
            isUint8Array: inMemoryPng instanceof Uint8Array,
            constructorName: inMemoryPng.constructor.name,
            length: inMemoryPng.length,
          },
          url: {
            isUint8Array: urlPng instanceof Uint8Array,
            constructorName: urlPng.constructor.name,
            length: urlPng.length,
          },
          browserPathError,
        })
      } catch (error) {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    }

    run()
  }, [])

  return (
    <main style={{ fontFamily: "monospace", padding: 16 }}>
      <h1>Browser Compatibility Fixture</h1>
      <pre data-testid="compat-state">{JSON.stringify(state, null, 2)}</pre>
    </main>
  )
}
