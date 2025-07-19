import { Injectable } from '@nestjs/common';
import { Person, World } from './simulation.controller';

@Injectable()
export class SimulationService {
  private readonly GOOD_COLOR = 'bg-green-950';
  private readonly BAD_COLOR = 'bg-red-950';

  createWorld(size: number): World {
    const grid: string[][] = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push('bg-white');
      }
      grid.push(row);
    }

    return {
      size,
      grid,
      people: [],
    };
  }

  addPerson(worldSize: number, parentOneId?: string, parentTwoId?: string): Person {
    const x = this.getRandomNumberBetween(0, worldSize - 1);
    const y = this.getRandomNumberBetween(0, worldSize - 1);

    return {
      id: `${Date.now()}-${Math.random().toString().substring(2)}`,
      desireToReplicate: this.getRandomNumberBetween(0, 100),
      parents: [parentOneId, parentTwoId].filter(p => p !== undefined) as string[],
      prevX: x,
      prevY: y,
      currentX: x,
      currentY: y,
      color: 'bg-black'
    };
  }

  movePeople(people: Person[], worldSize: number): Person[] {
    return people.map(person => {
      const newPerson = { ...person };
      newPerson.prevX = newPerson.currentX;
      newPerson.prevY = newPerson.currentY;

      const nextDirection = this.getRandomNumberBetween(0, 3);
      switch (nextDirection) {
        case 0: // Up
          newPerson.currentY = newPerson.currentY + 1 >= worldSize ? newPerson.currentY : newPerson.currentY + 1;
          break;
        case 1: // Left
          newPerson.currentX = newPerson.currentX - 1 < 0 ? newPerson.currentX : newPerson.currentX - 1;
          break;
        case 2: // Right
          newPerson.currentX = newPerson.currentX + 1 >= worldSize ? newPerson.currentX : newPerson.currentX + 1;
          break;
        case 3: // Down 
          newPerson.currentY = newPerson.currentY - 1 < 0 ? newPerson.currentY : newPerson.currentY - 1;
          break;
      }

      return newPerson;
    });
  }

  addRewards(world: string[][], worldSize: number, count: number): string[][] {
    const newWorld = world.map(row => [...row]);
    
    for (let i = 0; i < count; i++) {
      const x = this.getRandomNumberBetween(0, worldSize - 1);
      const y = this.getRandomNumberBetween(0, worldSize - 1);
      newWorld[y][x] = this.getRandomNumberBetween(0, 1) === 0 ? this.GOOD_COLOR : this.BAD_COLOR;
    }
    
    return newWorld;
  }

  private getRandomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
