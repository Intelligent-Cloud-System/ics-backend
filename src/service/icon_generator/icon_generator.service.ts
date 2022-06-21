'use strict';
import * as Jimp from 'jimp';
import * as crypto from 'crypto';
import { Complex } from 'src/shared/util/mathUtils';

const imageSize = 1028;
const halfSize = imageSize / 2;

const colorElementNumber = 4;
const emptyColor = [240, 240, 240, 255];

const colorRange = 256;
const minColor = 0;
const maxColor = colorRange - 1;

const minColorIntensity = 70;
const maxColorIntensity = 230;
const magicRandomNumber = 10005;

const juliaSetThreshold = 10;
const juliaSetMaxIter = 20;

const hashDigitsToAccount = 10;
const hex = 16;

const scaleMultiplier = 2 / imageSize;

export class ImageGen {
  public static generateImage(userEmail: string): Promise<Buffer> {
    const hash = ImageGen.generateHash(userEmail);

    const img = new Jimp(imageSize, imageSize);

    const colorSeed = parseInt(hash.substring(0, hashDigitsToAccount));
    const randGen = ImageGen.random(colorSeed);

    const filledColor = ImageGen.getRandomColor(randGen);

    const JuliaSetPointOffset = new Complex(ImageGen.toParamRange(randGen()), ImageGen.toParamRange(randGen()));
    const scale = new Complex(scaleMultiplier, 0);

    img.scan(0, 0, imageSize, imageSize, function (x, y, offset) {
      const pointInJuliaSet = new Complex(x - halfSize, y - halfSize).multiply(scale);
      const pointIntensity = ImageGen.evaluateJuliaSetPoint(pointInJuliaSet, JuliaSetPointOffset);
      const color = ImageGen.interpolateThreeColors(emptyColor, filledColor, emptyColor, pointIntensity);
      ImageGen.setPixelColor(color, this, offset);
    });

    return img.getBufferAsync(Jimp.MIME_JPEG);
  }

  private static fractalFunc(z: Complex, c: Complex): Complex {
    return z.pow2().add(c);
  }

  private static evaluateJuliaSetPoint(z: Complex, c: Complex): number {
    let res = z;
    let i = 0;
    while (res.abs() < juliaSetThreshold && i < juliaSetMaxIter) {
      res = ImageGen.fractalFunc(res, c);
      i++;
    }
    return i / juliaSetMaxIter;
  }

  private static setPixelColor = (pixel: number[], image: Jimp, offset: number): void[] =>
    pixel.map((v, i) => {
      image.bitmap.data[offset + i] = v;
    });

  private static transformRange(x: number, min: number, max: number, newMin: number, newMax: number): number {
    const scale = max - min;
    const newScale = newMax - newMin;
    return Math.floor(newMin + ((x - min) / scale) * newScale);
  }

  static random(seed: number): () => number {
    let currentSeed = seed;
    return function (): number {
      const x = Math.sin(currentSeed++) * magicRandomNumber;
      return x - Math.floor(x);
    };
  }

  private static colorElementGenerator(generator: () => number): number {
    return ImageGen.transformRange(
      Math.floor(generator() * colorRange),
      minColor,
      maxColor,
      minColorIntensity,
      maxColorIntensity
    );
  }

  private static getRandomColor(generator: () => number): number[] {
    const whitePixel = new Array(colorElementNumber).fill(maxColor);
    const pixel = whitePixel.map((v, i) =>
      i < colorElementNumber - 1 ? ImageGen.colorElementGenerator(generator) : v
    );
    return pixel;
  }

  private static interpolateTwoColors(a: number[], b: number[], s: number): number[] {
    return a.map((v, i) => Math.floor(v + (b[i] - v) * s));
  }

  private static interpolateThreeColors(a: number[], b: number[], c: number[], s: number): number[] {
    return s < 0.5 ? ImageGen.interpolateTwoColors(a, b, s * 2) : ImageGen.interpolateTwoColors(b, c, s * 2 - 1);
  }

  private static toParamRange = (x: number): number => -1 + x * 2;

  private static generateHash(str: string): string {
    return BigInt(parseInt(crypto.createHash('md5').update(str).digest('hex'), hex)).toString();
  }
}
