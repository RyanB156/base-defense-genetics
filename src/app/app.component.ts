import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MathHelper } from 'src/domain/helpers';
import { ArrayHelper } from 'src/domain/helpers';
import { Base, Wall } from '../domain/base';
import { RNA } from '../domain/genetics/rna';
import { DecelBreeder } from '../domain/genetics/decel-breeder';

import * as breederConfig from './breeder-config.json';
import { FitnessFunction } from 'src/domain/genetics/delegates';
import { Evolution } from '../domain/genetics/evolution';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'base-defense';

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  base: Base;
  wallCount: number = 50;
  width: number;
  height: number;

  constructor() {
    this.width = window.innerWidth - 25;
    this.height = window.innerHeight - 25;
    this.base = new Base(20, this.width, this.height);

    console.log(this.width, this.height);
  }

  ngAfterViewInit(): void {
    this.myCanvas.nativeElement.width = this.width;
    this.myCanvas.nativeElement.height = this.height;
    this.draw();
  }

  drawWall(wall: Wall): void {
    let context = this.myCanvas.nativeElement.getContext('2d');
    console.log(wall);
    context.rect(wall.x, wall.y, Wall.width, Wall.height);
    context.stroke();
  }

  run() {
    const rna: RNA = new RNA(Base.unzip, Base.zip);
  // const breeder: Breeder = new Breeder(rna, 0.2, 10);
  const decelBreeder: DecelBreeder = new DecelBreeder(rna, breederConfig.mutateChance, breederConfig.maxMutateAmount,
    breederConfig.generationCount, breederConfig.crossoverChance);

  
  const f: FitnessFunction = (base: Base): number => {
    let wallCount: number = base.walls.length;
    let dist: number = 0;
    base.walls.forEach(w => dist += Math.sqrt(w.x * w.x + w.y * w.y));
    return dist / wallCount;
  }

  // const evolution: Evolution = new Evolution(rna, breeder, f);
  const evolution: Evolution = new Evolution(rna, decelBreeder, f);
  let bases = ArrayHelper.init(50, () => new Base(this.wallCount, this.width, this.height));
  // console.log('people: ', people);

  for (let i = 0; i < breederConfig.generationCount; i++) {
    decelBreeder.setGeneration(i);
    evolution.setOrganisms(bases);
    evolution.startEpoch();
    bases = (evolution.endEpoch() as Base[]);
    // console.log('bases: ', bases);
    console.log('avg: ', evolution.avgFitness(bases));
    console.log('worst: ', bases[0], ' best: ', bases[bases.length - 1]);

    if (f(bases[0]) === f(bases[bases.length - 1])) {
      console.log('\nConverged at generation ', i);
      break;
    }
  }
  }

  draw() {
    let context = this.myCanvas.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);

    context.strokeStyle = 'red';

    this.base.walls.forEach(wall => {
      console.log(wall);
      context.rect(wall.x, wall.y, Wall.width, Wall.height);
      context.stroke();
    });
  }
}
