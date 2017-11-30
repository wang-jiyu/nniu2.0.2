module.exports = function(str, length) {
		var sAscii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		sAscii += '[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		var sHex = '0123456789ABCDEF';

		var _hex = function(i) {
			var h = '';
			for (j = 0; j <= 3; j++) {
				h += sHex.charAt((i >> (j * 8 + 4)) & 0x0F) + sHex.charAt((i >> (j * 8)) & 0x0F);
			}
			return h;
		};

		var _add = function(x, y) {
			return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
		};

		var _r1 = function(A, B, C, D, X, S, T) {
			var q = _add(_add(A, (B & C) | (~B & D)), _add(X, T));
			return _add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		};

		var _r2 = function(A, B, C, D, X, S, T) {
			var q = _add(_add(A, (B & D) | (C & ~D)), _add(X, T));
			return _add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		};

		var _r3 = function(A, B, C, D, X, S, T) {
			var q = _add(_add(A, B ^ C ^ D), _add(X, T));
			return _add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		};

		var _r4 = function(A, B, C, D, X, S, T) {
			var q = _add(_add(A, C ^ (B | ~D)), _add(X, T));
			return _add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		};

		var _init = function(s) {
			var wLen = (((s.length + 8) >> 6) + 1) << 4;
			var X = new Array(wLen);
			j = 4;
			for (i = 0; (i * 4) < s.length; i++) {
				X[i] = 0;
				for (j = 0; (j < 4) && ((j + i * 4) < s.length); j++) {
					X[i] += (sAscii.indexOf(s.charAt((i * 4) + j)) + 32) << (j * 8);
				}
			}
			if (j == 4) {
				X[i++] = 0x80;
			} else {
				X[i - 1] += 0x80 << (j * 8);
			}
			for (; i < wLen; i++) {
				X[i] = 0;
			}
			X[wLen - 2] = s.length * 8;

			a = 0x67452301;
			b = 0xefcdab89;
			c = 0x98badcfe;
			d = 0x10325476;

			for (i = 0; i < wLen; i += 16) {
				aO = a;
				bO = b;
				cO = c;
				dO = d;

				a = _r1(a, b, c, d, X[i + 0], 7, 0xd76aa478);
				d = _r1(d, a, b, c, X[i + 1], 12, 0xe8c7b756);
				c = _r1(c, d, a, b, X[i + 2], 17, 0x242070db);
				b = _r1(b, c, d, a, X[i + 3], 22, 0xc1bdceee);
				a = _r1(a, b, c, d, X[i + 4], 7, 0xf57c0faf);
				d = _r1(d, a, b, c, X[i + 5], 12, 0x4787c62a);
				c = _r1(c, d, a, b, X[i + 6], 17, 0xa8304613);
				b = _r1(b, c, d, a, X[i + 7], 22, 0xfd469501);
				a = _r1(a, b, c, d, X[i + 8], 7, 0x698098d8);
				d = _r1(d, a, b, c, X[i + 9], 12, 0x8b44f7af);
				c = _r1(c, d, a, b, X[i + 10], 17, 0xffff5bb1);
				b = _r1(b, c, d, a, X[i + 11], 22, 0x895cd7be);
				a = _r1(a, b, c, d, X[i + 12], 7, 0x6b901122);
				d = _r1(d, a, b, c, X[i + 13], 12, 0xfd987193);
				c = _r1(c, d, a, b, X[i + 14], 17, 0xa679438e);
				b = _r1(b, c, d, a, X[i + 15], 22, 0x49b40821);

				a = _r2(a, b, c, d, X[i + 1], 5, 0xf61e2562);
				d = _r2(d, a, b, c, X[i + 6], 9, 0xc040b340);
				c = _r2(c, d, a, b, X[i + 11], 14, 0x265e5a51);
				b = _r2(b, c, d, a, X[i + 0], 20, 0xe9b6c7aa);
				a = _r2(a, b, c, d, X[i + 5], 5, 0xd62f105d);
				d = _r2(d, a, b, c, X[i + 10], 9, 0x2441453);
				c = _r2(c, d, a, b, X[i + 15], 14, 0xd8a1e681);
				b = _r2(b, c, d, a, X[i + 4], 20, 0xe7d3fbc8);
				a = _r2(a, b, c, d, X[i + 9], 5, 0x21e1cde6);
				d = _r2(d, a, b, c, X[i + 14], 9, 0xc33707d6);
				c = _r2(c, d, a, b, X[i + 3], 14, 0xf4d50d87);
				b = _r2(b, c, d, a, X[i + 8], 20, 0x455a14ed);
				a = _r2(a, b, c, d, X[i + 13], 5, 0xa9e3e905);
				d = _r2(d, a, b, c, X[i + 2], 9, 0xfcefa3f8);
				c = _r2(c, d, a, b, X[i + 7], 14, 0x676f02d9);
				b = _r2(b, c, d, a, X[i + 12], 20, 0x8d2a4c8a);

				a = _r3(a, b, c, d, X[i + 5], 4, 0xfffa3942);
				d = _r3(d, a, b, c, X[i + 8], 11, 0x8771f681);
				c = _r3(c, d, a, b, X[i + 11], 16, 0x6d9d6122);
				b = _r3(b, c, d, a, X[i + 14], 23, 0xfde5380c);
				a = _r3(a, b, c, d, X[i + 1], 4, 0xa4beea44);
				d = _r3(d, a, b, c, X[i + 4], 11, 0x4bdecfa9);
				c = _r3(c, d, a, b, X[i + 7], 16, 0xf6bb4b60);
				b = _r3(b, c, d, a, X[i + 10], 23, 0xbebfbc70);
				a = _r3(a, b, c, d, X[i + 13], 4, 0x289b7ec6);
				d = _r3(d, a, b, c, X[i + 0], 11, 0xeaa127fa);
				c = _r3(c, d, a, b, X[i + 3], 16, 0xd4ef3085);
				b = _r3(b, c, d, a, X[i + 6], 23, 0x4881d05);
				a = _r3(a, b, c, d, X[i + 9], 4, 0xd9d4d039);
				d = _r3(d, a, b, c, X[i + 12], 11, 0xe6db99e5);
				c = _r3(c, d, a, b, X[i + 15], 16, 0x1fa27cf8);
				b = _r3(b, c, d, a, X[i + 2], 23, 0xc4ac5665);

				a = _r4(a, b, c, d, X[i + 0], 6, 0xf4292244);
				d = _r4(d, a, b, c, X[i + 7], 10, 0x432aff97);
				c = _r4(c, d, a, b, X[i + 14], 15, 0xab9423a7);
				b = _r4(b, c, d, a, X[i + 5], 21, 0xfc93a039);
				a = _r4(a, b, c, d, X[i + 12], 6, 0x655b59c3);
				d = _r4(d, a, b, c, X[i + 3], 10, 0x8f0ccc92);
				c = _r4(c, d, a, b, X[i + 10], 15, 0xffeff47d);
				b = _r4(b, c, d, a, X[i + 1], 21, 0x85845dd1);
				a = _r4(a, b, c, d, X[i + 8], 6, 0x6fa87e4f);
				d = _r4(d, a, b, c, X[i + 15], 10, 0xfe2ce6e0);
				c = _r4(c, d, a, b, X[i + 6], 15, 0xa3014314);
				b = _r4(b, c, d, a, X[i + 13], 21, 0x4e0811a1);
				a = _r4(a, b, c, d, X[i + 4], 6, 0xf7537e82);
				d = _r4(d, a, b, c, X[i + 11], 10, 0xbd3af235);
				c = _r4(c, d, a, b, X[i + 2], 15, 0x2ad7d2bb);
				b = _r4(b, c, d, a, X[i + 9], 21, 0xeb86d391);

				a = _add(a, aO);
				b = _add(b, bO);
				c = _add(c, cO);
				d = _add(d, dO);
			}
			return _hex(a) + _hex(b) + _hex(c) + _hex(d);
		}
		
		var result = _init(str);
		if (length == 16) result = result.substr(8, 16);
		return result.toLowerCase();
};