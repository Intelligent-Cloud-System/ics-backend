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

const colorScale = maxColor - minColor;
const normalizedColorScale = maxColorIntensity - minColorIntensity;

export default Object.freeze({
  imageSize,
  halfSize,
  colorElementNumber,
  emptyColor,
  colorRange,
  minColor,
  maxColor,
  minColorIntensity,
  magicRandomNumber,
  juliaSetThreshold,
  juliaSetMaxIter,
  hashDigitsToAccount,
  hex,
  scaleMultiplier,
  colorScale,
  normalizedColorScale,
});
