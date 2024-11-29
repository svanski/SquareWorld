'use client'

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";

const neutralColors = ["bg-neutral-600", "bg-neutral-700", "bg-neutral-800", "bg-neutral-900", "bg-neutral-950"]
const redColors = ["bg-red-100", "bg-red-20", "bg-red-200", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", 'bg-red-800', 'bg-red-900', 'bg-red-950']
const greenColors = ["bg-green-100", "bg-green-20", "bg-green-200", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", 'bg-green-800', 'bg-green-900', 'bg-green-950']

type Person = {
  prevX: number;
  prevY: number;

  currentX: number;
  currentY: number;

  color: string;
}

export default function Home() {

  const [worldSize, setWorldSize] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);

  const [world, setWorld] = useState<string[][]>([]);
  const peopleRef = useRef<Person[]>([]);


  function onCerateWorldClick() {
    const w: Array<string[]> = [];
    for (let i = 0; i < worldSize; i++) {
      const row = [];
      for (let j = 0; j < worldSize; j++) {
        row.push('bg-white');
      }
      w.push(row);
    }

    setWorld(w);
  }

  function addPersonClick() {
    // Example usage:
    const x = getRandomNumberBetween(0, worldSize - 1);
    const y = getRandomNumberBetween(0, worldSize - 1);

    peopleRef.current.push({
      prevX: x,
      prevY: y,
      currentX: x,
      currentY: y,
      color: neutralColors[0]
    });
    renderWorld();
  }

  function getRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function moveClicekd() {
    for (const p of peopleRef.current) {
      p.prevX = p.currentX;
      p.prevY = p.currentY

      const nextDirection = getRandomNumberBetween(0, 3);
      switch (nextDirection) {
        case 0://Up
          p.currentY = p.currentY + 1 >= worldSize ? p.currentY : p.currentY + 1;
          break;
        case 1://Left
          p.currentX = p.currentX - 1 < 0 ? p.currentX : p.currentX - 1;
          break;
        case 2: // Right
          p.currentX = p.currentX + 1 >= worldSize ? p.currentX : p.currentX + 1;
          break;
        case 3: // Down 
          p.currentY = p.currentY - 1 < 0 ? p.currentY : p.currentY - 1;
          break;
      }
    }
    renderWorld();
  }

  function renderWorld() {
    for (let p of peopleRef.current) {
      world[p.prevY][p.prevX] = 'bg-white';
      world[p.currentY][p.currentX] = p.color;
    }
    setWorld([...world]);
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  return (
    <div>
      <TextField id="outlined-basic" label="WorldSize" variant="outlined" onChange={(ev) => setWorldSize(Number.parseInt(ev.target.value ?? '0'))} />
      <TextField id="outlined-basic" label="People Count" variant="outlined" onChange={(ev) => setPeopleCount(Number.parseInt(ev.target.value ?? '0'))} />
      <Button onClick={onCerateWorldClick}>Crete</Button>
      <Button onClick={addPersonClick}>Add Person</Button>
      <Button onClick={moveClicekd}>Move</Button>
      <div>

        {world.map((arr, index) => {
          return <div className="flex flex-row" key={index}>{
            arr.map((v, i) => {
              return <div key={i} className={`border border-black w-10 h-10 ${v}`}></div>
            })
          }</div>
        })}
      </div>
    </div>

  );
}
