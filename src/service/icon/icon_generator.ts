import * as Jimp from 'jimp';
import * as crypto from 'crypto';
import { Complex } from 'src/service/icon/complex';
import { Injectable } from '@nestjs/common';
import constants from 'src/shared/const/iconGen';

@Injectable()
export class ImageGen {
  public generateImage(email: string): Promise<Buffer> {
    const hash = this.generateHash(email);

    const img = new Jimp(constants.imageSize, constants.imageSize);

    const colorSeed = parseInt(hash.substring(0, constants.hashDigitsToAccount));
    const randGen = this.random(colorSeed);

    const filledColor = this.getRandomColor(randGen);

    const offset = () => this.toParamRange(randGen());
    const JuliaSetPointOffset = new Complex(offset(), offset());

    const scale = new Complex(constants.scaleMultiplier, 0);

    img.scan(0, 0, constants.imageSize, constants.imageSize, (x, y, offset) => {
      const pointInJuliaSet = new Complex(x - constants.halfSize, y - constants.halfSize).multiply(scale);
      const pointIntensity = this.evaluateJuliaSetPoint(pointInJuliaSet, JuliaSetPointOffset);
      const color = this.interpolateThreeColors(
        constants.emptyColor,
        filledColor,
        constants.emptyColor,
        pointIntensity
      );
      this.setPixelColor(color, img, offset);
    });

    return img.getBufferAsync(Jimp.MIME_JPEG);
  }

  private fractalFunc(z: Complex, c: Complex): Complex {
    return z.pow2().add(c);
  }

  private evaluateJuliaSetPoint(z: Complex, c: Complex): number {
    let res = z;
    let i = 0;
    while (res.abs() < constants.juliaSetThreshold && i < constants.juliaSetMaxIter) {
      res = this.fractalFunc(res, c);
      i++;
    }
    return i / constants.juliaSetMaxIter;
  }

  private setPixelColor(pixel: number[], image: Jimp, offset: number): void {
    pixel.map((value, i) => {
      image.bitmap.data[offset + i] = value;
    });
  }

  private normalizeColor(x: number): number {
    return Math.floor(
      constants.minColorIntensity + ((x - constants.minColor) / constants.colorScale) * constants.normalizedColorScale
    );
  }

  private random(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      const x = Math.sin(currentSeed++) * constants.magicRandomNumber;
      return x - Math.floor(x);
    };
  }

  private colorElementGenerator(generator: () => number): number {
    return this.normalizeColor(Math.floor(generator() * constants.colorRange));
  }

  private getRandomColor(generator: () => number): number[] {
    const whitePixel = new Array(constants.colorElementNumber).fill(constants.maxColor);
    const pixel = whitePixel.map((value, i) =>
      i < constants.colorElementNumber - 1 ? this.colorElementGenerator(generator) : value
    );
    return pixel;
  }

  private interpolateTwoColors(a: number[], b: number[], s: number): number[] {
    return a.map((value, i) => Math.floor(value + (b[i] - value) * s));
  }

  private interpolateThreeColors(a: number[], b: number[], c: number[], s: number): number[] {
    return s < 0.5 ? this.interpolateTwoColors(a, b, s * 2) : this.interpolateTwoColors(b, c, s * 2 - 1);
  }

  private toParamRange = (x: number): number => -1 + x * 2;

  private generateHash(str: string): string {
    return BigInt(parseInt(crypto.createHash('md5').update(str).digest('hex'), constants.hex)).toString();
  }
}
