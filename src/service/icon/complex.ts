// Complex number math class
export class Complex {
  r: number; // real part
  i: number; // imaginary part

  constructor(r: number, i: number) {
    this.r = r;
    this.i = i;
  }
  public add(that: Complex): Complex {
    return new Complex(this.r + that.r, this.i + that.i);
  }
  public abs(): number {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }
  public multiply(that: Complex): Complex {
    return new Complex(this.r * that.r - this.i * that.i, this.i * that.r + that.i * this.r);
  }
  public pow2(): Complex {
    return this.multiply(this);
  }
}
