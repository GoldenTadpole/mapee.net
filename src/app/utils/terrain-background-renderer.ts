type TerrainTile = 'water' | 'sand' | 'grass' | 'dirt' | 'stone' | 'snow';

const TERRAIN_COLORS: Record<TerrainTile, [number, number, number]> = {
  water: [32, 75, 128],
  sand: [150, 136, 86],
  grass: [56, 101, 46],
  dirt: [83, 58, 38],
  stone: [91, 96, 92],
  snow: [164, 174, 172]
};

export class TerrainBackgroundRenderer {
  private readonly seed = Math.floor(Math.random() * 4294967295);
  private readonly zoom = 1.15;
  private readonly tileSize = 10;
  private readonly permutation = this.buildPermutation(this.seed);
  private readonly seedOffsetX = (this.seed & 4095) * 0.03;
  private readonly seedOffsetY = ((this.seed >>> 12) & 4095) * 0.03;

  draw(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.imageSmoothingEnabled = false;

    const columns = Math.ceil(width / this.tileSize) + 1;
    const rows = Math.ceil(height / this.tileSize) + 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        this.drawTile(context, x, y, columns, rows);
      }
    }
  }

  private drawTile(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    columns: number,
    rows: number
  ): void {
    const terrainX = x / this.zoom + this.seedOffsetX;
    const terrainY = y / this.zoom + this.seedOffsetY;
    const warpX = (this.fractalNoise(terrainX * 0.026 + 120, terrainY * 0.026 - 80, 3) - 0.5) * 34;
    const warpY = (this.fractalNoise(terrainX * 0.026 - 45, terrainY * 0.026 + 160, 3) - 0.5) * 34;
    const continent = this.fractalNoise((terrainX + warpX) * 0.018, (terrainY + warpY) * 0.018, 5);
    const islandChain = this.fractalNoise((terrainX - warpY) * 0.034 + 70, (terrainY + warpX) * 0.02 - 110, 3);
    const coastline = this.fractalNoise(terrainX * 0.11 + 80, terrainY * 0.11 - 30, 3);
    const landShape = continent * 0.78 + islandChain * 0.22 + (coastline - 0.5) * 0.12;
    const islandMask = this.smoothStep(0.49, 0.64, landShape);
    const elevation = this.fractalNoise(terrainX * 0.064, terrainY * 0.064, 5) * 0.28 * islandMask;
    const mountain = this.fractalNoise(terrainX * 0.034 - 40, terrainY * 0.034 + 55, 4) * 0.24 * islandMask;
    const shore = this.fractalNoise(terrainX * 0.12 + 80, terrainY * 0.12 - 30, 3) * 0.05;
    const distanceX = Math.abs(x / Math.max(1, columns - 1) - 0.5) * 2;
    const distanceY = Math.abs(y / Math.max(1, rows - 1) - 0.5) * 2;
    const edgeFade = Math.max(distanceX, distanceY) * 0.1;
    const height = 0.31 + islandMask * 0.54 + elevation + mountain + shore * islandMask - edgeFade;
    const slope =
      this.fractalNoise((terrainX - 1) * 0.064, (terrainY - 1) * 0.064, 3) -
      this.fractalNoise((terrainX + 1) * 0.064, (terrainY + 1) * 0.064, 3);
    const tile = this.getTerrainTile(height);

    context.fillStyle = this.getAltitudeColor(tile, height, slope);
    context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
  }

  private getAltitudeColor(tile: TerrainTile, height: number, slope: number): string {
    const [red, green, blue] = TERRAIN_COLORS[tile];
    const normalizedHeight = this.clamp((height - 0.32) / 0.62, 0, 1);
    const altitudeShade = this.lerp(0.68, 1.2, normalizedHeight);
    const slopeShade = this.clamp(1 + slope * 0.78, 0.78, 1.16);
    const waterShade = tile === 'water' ? this.lerp(0.62, 0.94, normalizedHeight) : altitudeShade;
    const shade = waterShade * slopeShade;

    return `rgb(${this.toColorChannel(red * shade)}, ${this.toColorChannel(green * shade)}, ${this.toColorChannel(blue * shade)})`;
  }

  private getTerrainTile(height: number): TerrainTile {
    if (height < 0.42) {
      return 'water';
    }

    if (height < 0.49) {
      return 'sand';
    }

    if (height < 0.62) {
      return 'grass';
    }

    if (height < 0.72) {
      return 'dirt';
    }

    if (height < 0.82) {
      return 'stone';
    }

    return 'snow';
  }

  private fractalNoise(x: number, y: number, octaves: number): number {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let octave = 0; octave < octaves; octave++) {
      total += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total / maxValue;
  }

  private noise(x: number, y: number): number {
    const left = Math.floor(x) & 255;
    const top = Math.floor(y) & 255;
    const localX = x - Math.floor(x);
    const localY = y - Math.floor(y);
    const fadeX = this.fade(localX);
    const fadeY = this.fade(localY);
    const topLeft = this.permutation[this.permutation[left] + top];
    const topRight = this.permutation[this.permutation[left + 1] + top];
    const bottomLeft = this.permutation[this.permutation[left] + top + 1];
    const bottomRight = this.permutation[this.permutation[left + 1] + top + 1];
    const upper = this.lerp(
      this.gradient(topLeft, localX, localY),
      this.gradient(topRight, localX - 1, localY),
      fadeX
    );
    const lower = this.lerp(
      this.gradient(bottomLeft, localX, localY - 1),
      this.gradient(bottomRight, localX - 1, localY - 1),
      fadeX
    );

    return (this.lerp(upper, lower, fadeY) + 1) / 2;
  }

  private buildPermutation(seed: number): number[] {
    const values = Array.from({ length: 256 }, (_, index) => index);
    let state = seed;

    for (let index = values.length - 1; index > 0; index--) {
      state = (state * 1664525 + 1013904223) >>> 0;
      const swapIndex = state % (index + 1);
      [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
    }

    return [...values, ...values];
  }

  private fade(value: number): number {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  private lerp(start: number, end: number, amount: number): number {
    return start + amount * (end - start);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private smoothStep(edgeStart: number, edgeEnd: number, value: number): number {
    const amount = this.clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);

    return amount * amount * (3 - 2 * amount);
  }

  private toColorChannel(value: number): number {
    return Math.round(this.clamp(value, 0, 255));
  }

  private gradient(hash: number, x: number, y: number): number {
    switch (hash & 3) {
      case 0:
        return x + y;
      case 1:
        return -x + y;
      case 2:
        return x - y;
      default:
        return -x - y;
    }
  }
}
