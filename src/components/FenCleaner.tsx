"use client"

import { useState } from "react"

function removePawns(fen: string) {
  const parts = fen.split(" ")
  const placement = parts[0]

  const cleaned = placement
    .split("/")
    .map(rank => {

      let empty = 0
      let result = ""

      for (const ch of rank) {

        if (/\d/.test(ch)) {
          empty += parseInt(ch)

        } else if (ch === "p" || ch === "P") {
          empty++

        } else {

          if (empty > 0) {
            result += empty
            empty = 0
          }

          result += ch
        }
      }

      if (empty > 0) result += empty

      return result || "8"

    })
    .join("/")

  parts[0] = cleaned
  return parts.join(" ")
}


export function FenCleaner() {

  const [input, setInput] = useState("")
  const [rows, setRows]: any = useState([])
  const [removePawn, setRemovePawn] = useState(true)


  function process() {

    const lines = input.split("\n")
    const result: any[] = []

    lines.forEach(line => {

      const trimmed = line.trim()
      if (!trimmed) return

      // works with TAB or SPACE
      const parts = trimmed.split(/\s+/)

      if (parts.length < 2) return

      const id = parts[0]
      const fen = parts.slice(1).join(" ")

      // skip if no pawn
      if (!fen.includes("p") && !fen.includes("P")) return

      const cleanedFen = removePawns(fen)

      result.push({
        id: id,
        fen: cleanedFen
      })

    })

    setRows(result)

  }


  return (

    <div className="space-y-6 mt-10">

      <h1 className="text-2xl font-bold">
        Bulk FEN Pawn Remover
      </h1>

      <textarea
        className="w-full h-40 border p-3 rounded"
        placeholder="Paste ID and FEN here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={removePawn}
          onChange={(e) => setRemovePawn(e.target.checked)}
        />

        Remove all pawns

      </label>


      <button
        onClick={process}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Process
      </button>


      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-2">ID</th>
              <th>FEN without pawns</th>
            </tr>

          </thead>

          <tbody>

            {rows.map((r: any, i: number) => (

              <tr key={i} className="border-t">

                <td className="p-2">{r.id}</td>
                <td className="text-xs break-all">{r.fen}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}
