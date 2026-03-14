"use client"

import { useState } from "react"
import * as XLSX from "xlsx"

const INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

function parsePgnHeaders(pgn: string) {
  const headers: any = {}
  const regex = /\[(\w+)\s+"([^"]*)"\]/g
  let match

  while ((match = regex.exec(pgn))) {
    headers[match[1]] = match[2]
  }

  return headers
}

function splitGames(text: string) {
  return text.split(/\n\n(?=\[)/).filter((g) => g.includes("["))
}

function getPieceNotation(fen: string) {
  const board = fen.split(" ")[0]
  const ranks = board.split("/")
  const files = ["a","b","c","d","e","f","g","h"]

  const white:any[]=[]
  const black:any[]=[]
  const pawns:any[]=[]

  const label:any={
    K:"K",Q:"Q",R:"R",B:"B",N:"N",
    k:"K",q:"Q",r:"R",b:"B",n:"N"
  }

  for(let r=0;r<8;r++){
    let file=0

    for(const ch of ranks[r]){
      if(/\d/.test(ch)){
        file+=parseInt(ch)
      }else{
        const sq=files[file]+(8-r)

        if(ch==="P") white.push(sq)
        else if(ch==="p") pawns.push(sq)
        else if(label[ch]){
          if(ch===ch.toUpperCase())
            white.push(label[ch]+sq)
          else
            black.push(label[ch]+sq)
        }

        file++
      }
    }
  }

  return {
    white:white.join(" "),
    black:black.join(" "),
    pawns:pawns.join(" ")
  }
}

export function PgnDetailer(){

  const [pgn,setPgn]=useState("")
  const [rows,setRows]:any=useState([])

  function process(){

    const games=splitGames(pgn)

    const result=games.map((g,i)=>{

      const headers=parsePgnHeaders(g)

      const title=headers.Event||`Game ${i+1}`
      const chapter=headers.Round||""

      const fen=headers.FEN||INITIAL_FEN

      const pieces=getPieceNotation(fen)

      return{
        index:i+1,
        title,
        chapter,
        fen,
        ...pieces
      }

    })

    setRows(result)
  }

  function downloadExcel(){

    const data=[
      ["#","Title","Chapter","FEN","White","Black","Black Pawns"],
      ...rows.map((r:any)=>[
        r.index,
        r.title,
        r.chapter,
        r.fen,
        r.white,
        r.black,
        r.pawns
      ])
    ]

    const ws=XLSX.utils.aoa_to_sheet(data)
    const wb=XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb,ws,"PGN")

    XLSX.writeFile(wb,"pgn_details.xlsx")
  }

  return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
PGN Detailer
</h1>

<textarea
className="w-full h-40 border p-3 rounded"
placeholder="Paste PGN here..."
value={pgn}
onChange={e=>setPgn(e.target.value)}
/>

<div className="flex gap-3">

<button
onClick={process}
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
<th className="p-2">#</th>
<th>Title</th>
<th>Chapter</th>
<th>FEN</th>
<th>White</th>
<th>Black</th>
<th>Pawns</th>
</tr>

</thead>

<tbody>

{rows.map((r:any)=>(
<tr key={r.index} className="border-t">

<td className="p-2">{r.index}</td>
<td>{r.title}</td>
<td>{r.chapter}</td>
<td className="text-xs">{r.fen}</td>
<td>{r.white}</td>
<td>{r.black}</td>
<td>{r.pawns}</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

  )
}