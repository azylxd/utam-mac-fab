export class Base64Provider {
      PADCHAR: any;
      ALPHA: any;

      constructor() {
            this.PADCHAR = '=';
            this.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      }

      private getByte(s: string, i: number): number {
            var x = s.charCodeAt(i);
            if (x > 255) throw "INVALID_CHARACTER_ERR: DOM Exception 5";
            return x;
      }

      /**
      *Codifica el String a base64.
      */
      encode(s: string): string {

            if (arguments.length !== 1) throw "SyntaxError: Not enough arguments";

            let i, b10;
            let x = [];

            s = "" + s;

            let imax = s.length - s.length % 3;

            if (s.length === 0) return s;
            for (i = 0; i < imax; i += 3) {
                  b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
                  x.push(this.ALPHA.charAt(b10 >> 18));
                  x.push(this.ALPHA.charAt((b10 >> 12) & 0x3F));
                  x.push(this.ALPHA.charAt((b10 >> 6) & 0x3f));
                  x.push(this.ALPHA.charAt(b10 & 0x3f));
            }
            switch (s.length - imax) {
                  case 1:
                        b10 = this.getByte(s, i) << 16;
                        x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) +
                              this.PADCHAR + this.PADCHAR);
                        break;
                  case 2:
                        b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                        x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) +
                              this.ALPHA.charAt((b10 >> 6) & 0x3f) + this.PADCHAR);
                        break;
            }
            return x.join('');
      }
}

