'use client'

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";

const redColors = ["bg-violet-100", "bg-violet-20", "bg-violet-200", "bg-violet-400", "bg-violet-500", "bg-violet-600", "bg-violet-700", 'bg-violet-800', 'bg-violet-900', 'bg-violet-950']
const greenColors = ["bg-green-100", "bg-green-20", "bg-green-200", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", 'bg-green-800', 'bg-green-900', 'bg-green-950'].reverse()

const GOOD_COLOR = 'bg-green-950';
const BAD_COLOR = 'bg-red-950';

const allColors = [...redColors, 'bg-black', ...greenColors];

type Person = {

  id: string;

  desireToReplicate: number;
  parents: string[];

  prevX: number;
  prevY: number;

  currentX: number;
  currentY: number;

  color: string;
}

export default function Home() {

  const [worldSize, setWorldSize] = useState(20);
  const [replicationThreashold, setReplicationThreashold] = useState(99);

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
    peopleRef.current = [];
  }

  function addPersonClick(parentOneId?: string, parentTwoId?: string) {
    // Example usage:
    const x = getRandomNumberBetween(0, worldSize - 1);
    const y = getRandomNumberBetween(0, worldSize - 1);

    peopleRef.current.push({
      id: `${Date.now()}-${Math.random().toString().substring(2)}`,
      desireToReplicate: getRandomNumberBetween(0, 100),
      parents: [parentOneId, parentTwoId].filter(p => p !== undefined) as string[],
      prevX: x,
      prevY: y,
      currentX: x,
      currentY: y,
      color: 'bg-black'
    });
    renderWorld();
  }

  function getRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function startSimulationClicked() {
    while (true) {
      await sleep(10);
      movePeople();

      for (let i = 0; i < peopleRef.current.length - 1; i++) {
        for (let j = i + 1; j < peopleRef.current.length; j++) {
          const p1 = peopleRef.current[i];
          const p2 = peopleRef.current[j];
          if (p1.currentX === p2.currentX && p1.currentY === p2.currentY) {
            const shouldReplicate = p1.desireToReplicate > replicationThreashold && p2.desireToReplicate > replicationThreashold;
            if (shouldReplicate) {
              addPersonClick(p1.id, p2.id);
            }
          }

        }
      }
    }
  }

  function movePeople() {
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

      if (world[p.currentY][p.currentX] === GOOD_COLOR) {
        p.color = allColors.indexOf(p.color) + 1 >= allColors.length ? p.color : allColors[allColors.indexOf(p.color) + 1];
      }
      else if (world[p.currentY][p.currentX] === BAD_COLOR) {
        p.color = allColors.indexOf(p.color) - 1 < 0 ? p.color : allColors[allColors.indexOf(p.color) - 1];
      }

      world[p.prevY][p.prevX] = 'bg-white';
      world[p.currentY][p.currentX] = p.color;
    }
    setWorld([...world]);
  }

  function addRewardClick() {
    for (let i = 0; i < 10; i++) {
      world[getRandomNumberBetween(0, worldSize - 1)][getRandomNumberBetween(0, worldSize - 1)] = getRandomNumberBetween(0, 1) === 0 ? GOOD_COLOR : BAD_COLOR;
    }
    setWorld([...world]);
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  return (
    <div style={{ margin: '20px' }}>
      <TextField id="outlined-basic" label="WorldSize" variant="outlined" defaultValue={worldSize} onChange={(ev) => setWorldSize(Number.parseInt(ev.target.value ?? '0'))} />
      <TextField id="outlined-basic" label="Replication Threashold %" variant="outlined" defaultValue={replicationThreashold} onChange={(ev) => setReplicationThreashold(Number.parseInt(ev.target.value ?? '0'))} />
      <InputLabel>People Count:{peopleRef.current.length}</InputLabel>
      <Button onClick={onCerateWorldClick}>Create The Universe</Button>
      <Button onClick={() => addPersonClick()}>Add Person</Button>
      <Button onClick={addRewardClick}>Add Reward</Button>
      <Button onClick={startSimulationClicked}>Start Simulation</Button>
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
