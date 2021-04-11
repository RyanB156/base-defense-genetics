import { Organism } from "./genetics/organism";
import { ArrayHelper, MathHelper } from "./helpers";
import { Unzipper, Zipper } from '../domain/genetics/delegates'

export class Wall {
  static width: number = 20;
  static height: number = 20;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Base extends Organism {
  walls: Wall[];
  static xBoundary: number;
  static yBoundary: number;

  constructor(count: number, xBoundary: number, yBoundary: number, walls: Wall[]=undefined) {
    super();
    Base.xBoundary = xBoundary;
    Base.yBoundary = yBoundary;

    if (walls === undefined) {
      this.walls = ArrayHelper.init(count, _ => {
        let x = MathHelper.randInt(5, xBoundary - Wall.width - 5);
        let y = MathHelper.randInt(5, yBoundary - Wall.height - 5);
        return new Wall(x, y);
      });
    } else {
      this.walls = walls;
    }
    
  }

  static unzip: Unzipper = (dna: number[]): Base => {
    if (dna.length % 2 !== 0) {
      throw Error('Invalid dna for wall');
    }
    let walls: Wall[] = ArrayHelper.init(dna.length / 2, i => new Wall(2 * i, 2 * i + 1));
    return new Base(walls.length, Base.xBoundary, Base.yBoundary, walls);
  };

  static zip: Zipper = (base: Base): number[] => {
    let data: number[] = [];
    base.walls.forEach(w => {
      data.push(w.x);
      data.push(w.y);
    });
    return data;
  };
}