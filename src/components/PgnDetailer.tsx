"use client"

import { useState } from "react"
import * as XLSX from "xlsx"

const INITIAL_FEN =
"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"


function parseHeaders(pgn:string){

  const headers:any = {}

  const regex = /\[(\w+)\s+"([^"]*)"\]/g

  let match

  while((match = regex.exec(pgn))){
    headers[match[1]] = match[2]
  }

  return headers
}


function splitGames(text:string){

  const normalized = text.replace(/\r\n/g,"\n")

  return normalized.split(/\n\n(?=\[)/).filter(g => g.includes("["))
}


function removeBlackPiecesFromFen(fen:string){

  const parts = fen.split(" ")

  const placement = parts[0]

  const cleaned = placement
    .split("/")
    .map(rank => {

      let empty = 0
      let result = ""

      for(const ch of rank){

        if(/\d/.test(ch)){
          empty += parseInt(ch)

        }else if(ch === ch.toLowerCase()){
          empty++

        }else{

          if(empty > 0){
            result += empty
            empty = 0
          }

          result += ch
        }
      }

      if(empty > 0) result += empty

      return result || "8"

    })
    .join("/")

  parts[0] = cleaned

  return parts.join(" ")
}


export function PgnDetailer(){

  const [pgn,setPgn] = useState("")
  const [rows,setRows]:any = useState([])


  function processPGN(){

    const games = splitGames(pgn)

    const result = games.map((game,i)=>{

      const headers = parseHeaders(game)

      const title =
        headers.Event ||
        (headers.White && headers.Black
          ? `${headers.White} vs ${headers.Black}`
          : `Game ${i+1}`)

      const chapter =
        headers.Chapter ||
        headers.Round ||
        ""

      const fen =
        headers.FEN ||
        INITIAL_FEN

      const fenNoBlack =
        removeBlackPiecesFromFen(fen)

      return{
        title,
        chapter,
        fen,
        fenNoBlack
      }

    })

    setRows(result)
  }


  function downloadExcel(){

    const data = [
      ["Title","Chapter","FEN","FEN without black pieces"],
      ...rows.map((r:any)=>[
        r.title,
        r.chapter,
        r.fen,
        r.fenNoBlack
      ])
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb,ws,"PGN")

    XLSX.writeFile(wb,"pgn_output.xlsx")
  }


  return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
PGN Parser
</h1>


<textarea
className="w-full h-40 border p-3 rounded"
placeholder="Paste PGN here..."
value={pgn}
onChange={e=>setPgn(e.target.value)}
/>


<div className="flex gap-3">

<button
onClick={processPGN}
className="bg-black text-white px-4 py-2 rounded"
>
Parse PGN
</button>


<button
onClick={downloadExcel}
className="border px-4 py-2 rounded"
>
Download Excel
</button>

</div>



<div className="overflow-x-auto">

<table className="w-full border">

<thead className="bg-gray-200">

<tr>

<th className="p-2">Title</th>
<th>Chapter</th>
<th>FEN</th>
<th>FEN without black pieces</th>

</tr>

</thead>


<tbody>

{rows.map((r:any,i:number)=>(

<tr key={i} className="border-t">

<td className="p-2">{r.title}</td>
<td>{r.chapter}</td>
<td className="text-xs">{r.fen}</td>
<td className="text-xs">{r.fenNoBlack}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

  )
}
