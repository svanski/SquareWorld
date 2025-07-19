import { Controller, Get, Post, Body } from '@nestjs/common';
import { SimulationService } from './simulation.service';

export interface Person {
  id: string;
  desireToReplicate: number;
  parents: string[];
  prevX: number;
  prevY: number;
  currentX: number;
  currentY: number;
  color: string;
}

export interface World {
  size: number;
  grid: string[][];
  people: Person[];
}

@Controller('api/simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('create-world')
  createWorld(@Body() body: { size: number }): World {
    return this.simulationService.createWorld(body.size);
  }

  @Post('add-person')
  addPerson(@Body() body: { worldSize: number; parentOneId?: string; parentTwoId?: string }): Person {
    return this.simulationService.addPerson(body.worldSize, body.parentOneId, body.parentTwoId);
  }

  @Post('move-people')
  movePeople(@Body() body: { people: Person[]; worldSize: number }): Person[] {
    return this.simulationService.movePeople(body.people, body.worldSize);
  }

  @Post('add-rewards')
  addRewards(@Body() body: { world: string[][]; worldSize: number; count: number }): string[][] {
    return this.simulationService.addRewards(body.world, body.worldSize, body.count);
  }

  @Get('health')
  getHealth(): string {
    return 'Simulation API is healthy!';
  }
}
