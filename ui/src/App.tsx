import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState, useEffect } from "react";
import { logAnalyticsEvent } from "./firebase";
import ServerHealth from "./components/ServerHealth";

const redColors = ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", 'bg-red-800', 'bg-red-900', 'bg-red-950']
const greenColors = ["bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", 'bg-green-800', 'bg-green-900', 'bg-green-950'].reverse()

const GOOD_COLOR = 'bg-green-400';
const BAD_COLOR = 'bg-red-400';

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

function App() {
  const [worldSize, setWorldSize] = useState(20);
  const [replicationThreashold, setReplicationThreashold] = useState(99);
  const [world, setWorld] = useState<string[][]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simulationRef = useRef<boolean>(false);
  const peopleRef = useRef<Person[]>([]);

  // Track app initialization
  useEffect(() => {
    logAnalyticsEvent('app_initialized', {
      timestamp: new Date().toISOString()
    });
  }, []);

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
    
    // Track world creation
    logAnalyticsEvent('world_created', {
      world_size: worldSize,
      replication_threshold: replicationThreashold
    });
  }

  function addPersonClick(parentOneId?: string, parentTwoId?: string) {
    // Example usage:
    const x = getRandomNumberBetween(0, worldSize - 1);
    const y = getRandomNumberBetween(0, worldSize - 1);

    const newPerson = {
      id: `${Date.now()}-${Math.random().toString().substring(2)}`,
      desireToReplicate: getRandomNumberBetween(0, 100),
      parents: [parentOneId, parentTwoId].filter(p => p !== undefined) as string[],
      prevX: x,
      prevY: y,
      currentX: x,
      currentY: y,
      color: 'bg-black'
    };

    peopleRef.current.push(newPerson);
    renderWorld();

    // Track person addition
    logAnalyticsEvent('person_added', {
      person_id: newPerson.id,
      has_parents: newPerson.parents.length > 0,
      parent_count: newPerson.parents.length,
      total_population: peopleRef.current.length,
      desire_to_replicate: newPerson.desireToReplicate
    });
  }

  function getRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function startSimulationClicked() {
    if (simulationRunning) {
      // Stop simulation
      simulationRef.current = false;
      setSimulationRunning(false);
      
      logAnalyticsEvent('simulation_stopped', {
        population: peopleRef.current.length,
        world_size: worldSize
      });
      return;
    }

    // Start simulation
    simulationRef.current = true;
    setSimulationRunning(true);
    
    logAnalyticsEvent('simulation_started', {
      population: peopleRef.current.length,
      world_size: worldSize,
      replication_threshold: replicationThreashold
    });

    let generations = 0;
    const startTime = Date.now();

    while (simulationRef.current) {
      await sleep(10);
      movePeople();

      let replicationsThisRound = 0;
      for (let i = 0; i < peopleRef.current.length - 1; i++) {
        for (let j = i + 1; j < peopleRef.current.length; j++) {
          const p1 = peopleRef.current[i];
          const p2 = peopleRef.current[j];
          if (p1.currentX === p2.currentX && p1.currentY === p2.currentY) {
            const shouldReplicate = p1.desireToReplicate > replicationThreashold && p2.desireToReplicate > replicationThreashold;
            if (shouldReplicate) {
              addPersonClick(p1.id, p2.id);
              replicationsThisRound++;
            }
          }
        }
      }

      generations++;
      
      // Log periodic simulation stats
      if (generations % 100 === 0) {
        logAnalyticsEvent('simulation_milestone', {
          generations: generations,
          population: peopleRef.current.length,
          replications_this_round: replicationsThisRound,
          simulation_duration_ms: Date.now() - startTime
        });
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
    for (const p of peopleRef.current) {
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
    let goodRewards = 0;
    let badRewards = 0;
    
    for (let i = 0; i < 10; i++) {
      const isGoodReward = getRandomNumberBetween(0, 1) === 0;
      world[getRandomNumberBetween(0, worldSize - 1)][getRandomNumberBetween(0, worldSize - 1)] = isGoodReward ? GOOD_COLOR : BAD_COLOR;
      
      if (isGoodReward) {
        goodRewards++;
      } else {
        badRewards++;
      }
    }
    
    setWorld([...world]);
    
    // Track reward addition
    logAnalyticsEvent('rewards_added', {
      good_rewards: goodRewards,
      bad_rewards: badRewards,
      total_rewards: 10,
      world_size: worldSize
    });
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Square World Simulation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <TextField 
              id="world-size" 
              label="World Size" 
              variant="outlined" 
              defaultValue={worldSize} 
              onChange={(ev) => setWorldSize(Number.parseInt(ev.target.value ?? '0'))}
              fullWidth
              size="small"
            />
          </div>
          <div>
            <TextField 
              id="replication-threshold" 
              label="Replication Threshold %" 
              variant="outlined" 
              defaultValue={replicationThreashold} 
              onChange={(ev) => setReplicationThreashold(Number.parseInt(ev.target.value ?? '0'))}
              fullWidth
              size="small"
            />
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded border">
          <span className="text-lg font-semibold text-blue-800">People Count: {peopleRef.current.length}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="contained" color="primary" onClick={onCerateWorldClick}>
            Create The Universe
          </Button>
          <Button variant="contained" color="secondary" onClick={() => addPersonClick()}>
            Add Person
          </Button>
          <Button variant="contained" color="success" onClick={addRewardClick}>
            Add Reward
          </Button>
          <Button variant="contained" color="warning" onClick={startSimulationClicked}>
            {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
        </div>
        
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
          <div className="inline-block">
            {world.map((arr, index) => {
              return <div className="flex flex-row" key={index}>{
                arr.map((v, i) => {
                  return <div key={i} className={`border border-gray-400 w-8 h-8 ${v}`}></div>
                })
              }</div>
            })}
          </div>
        </div>
      </div>
      <ServerHealth />
    </div>
  );
}

export default App;
