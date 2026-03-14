"use client"

import { useState } from "react"

function removePawns(fen:string){

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

        }else if(ch === "p" || ch === "P"){
          empty++

        }else{

          if(empty>0){
            result += empty
            empty = 0
          }

          result += ch
        }

      }

      if(empty>0) result += empty

      return result || "8"

    })
    .join("/")

  parts[0] = cleaned

  return parts.join(" ")
}


export function FenCleaner(){

  const [fen,setFen] = useState("")
  const [removePawn,setRemovePawn] = useState(false)
  const [result,setResult] = useState("")


  function processFen(){

    if(!fen) return

    let output = fen

    if(removePawn){
      output = removePawns(fen)
    }

    setResult(output)

  }

  return(

<div className="space-y-6 mt-10">

<h1 className="text-2xl font-bold">
FEN Cleaner
</h1>

<textarea
className="w-full border p-3 rounded"
placeholder="Paste FEN here..."
value={fen}
onChange={e=>setFen(e.target.value)}
/>


<label className="flex items-center gap-2">

<input
type="checkbox"
checked={removePawn}
onChange={(e)=>setRemovePawn(e.target.checked)}
/>

Remove all pawns

</label>


<button
onClick={processFen}
className="bg-black text-white px-4 py-2 rounded"
>
Clean FEN
</button>


{result && (

<div className="border p-3 rounded bg-gray-50">

<div className="font-semibold mb-2">
Result FEN
</div>

<div className="text-sm break-all">
{result}
</div>

</div>

)}

</div>

  )
}
