'use client'

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export default function Home() {

  const [worldSize, setWorldSize] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);

  const [world, setWorld] = useState<number[][]>([]);


  function onCerateWorldClick() {
    const w = [];
    for (let i = 0; i < worldSize; i++) {
      const row = [];
      for (let j = 0; j < worldSize; j++) {
        row.push(0);
      }
      w.push(row);
    }

    setWorld(w);
  }

  return (
    <div>
      <TextField id="outlined-basic" label="WorldSize" variant="outlined" onChange={(ev) => setWorldSize(Number.parseInt(ev.target.value ?? '0'))} />
      <TextField id="outlined-basic" label="People Count" variant="outlined" onChange={(ev) => setPeopleCount(Number.parseInt(ev.target.value ?? '0'))} />
      <Button onClick={onCerateWorldClick}>Crete</Button>
      <div>{JSON.stringify({ worldSize, peopleCount })}</div>
      {world.map((arr, index) => {
        return <div className="flex flex-row" key={index}>{
          arr.map((v, i) => {
            return <div key={i} className="border border-black w-10 h-10">{v}</div>
          })
        }</div>
      })}
    </div>

  );
}
