import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';

export class BytesValidationError extends TokenValidationError {
  name: string = 'BytesValidationError';
  constructor(public value: any, public token: BytesToken, message: string) {
    super(value, token, message);
  }
}

export class BytesToken extends Token implements ComparableToken {
  static prim = 'bytes';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { bytes: val },
      type: { prim: BytesToken.prim },
    };
  }

  private isValid(val: any): BytesValidationError | null {
    if (typeof val === 'string' && /^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new BytesValidationError(val, this, `Invalid bytes: ${val}`);
    }
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { bytes: String(val).toString() };
  }

  public EncodeObject(val: any) {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { bytes: String(val).toString() };
  }

  public Execute(val: any): string {
    return val.bytes;
  }

  public ExtractSchema() {
    return BytesToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }

    return bytes;
  }
}
