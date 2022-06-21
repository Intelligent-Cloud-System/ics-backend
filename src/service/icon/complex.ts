export class Complex {
  r: number;
  i: number;

  constructor(r: number, i: number) {
    this.r = r;
    this.i = i;
  }
  add = (that: Complex): Complex => {
    return new Complex(this.r + that.r, this.i + that.i);
  };
  abs = (): number => {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  };
  multiply = (that: Complex): Complex => {
    return new Complex(this.r * that.r - this.i * that.i, this.i * that.r + that.i * this.r);
  };
  pow2 = (): Complex => this.multiply(this);
}
