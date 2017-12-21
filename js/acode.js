
/****************************************************************************/
/****************************** 数据编码解码、加密解密开始  ***************************/
/****************************************************************************/


var UTF8 = {

    /**
     * 使用这个方法进行UTF-8编码
     * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
     * (BMP / basic multilingual plane only)
     *
     * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
     *
     * @param {String} strUni Unicode string to be encoded as UTF-8
     * @returns {String} encoded string
     */
    encode: function(strUni) {
        // use regular expressions & String.replace callback function for better efficiency
        // than procedural approaches
        var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        })
        .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        });
        return strUtf;
    },

    /**
     * 使用这个方法进行UTF-8解码
     * Decode utf-8 encoded string back into multi-byte Unicode characters
     *
     * @param {String} strUtf UTF-8 string to be decoded back to Unicode
     * @returns {String} decoded string
     */
    decode: function(strUtf) {
        // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
        var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
        function(c) { // (note parentheses for precence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        })
        .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
        function(c) { // (note parentheses for precence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        });
        return strUni;
    }
};
/* UTF-8 <=> UTF-16 convertion
 *
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf16to8(utf8);
 */

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
		    out += str.charAt(i);
		} else if (c > 0x07FF) {
		    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
		    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
		    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
		    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
		    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
		c = str.charCodeAt(i++);
		switch(c >> 4)
		{ 
		  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		    // 0xxxxxxx
		    out += str.charAt(i-1);
		    break;
		  case 12: case 13:
		    // 110x xxxx   10xx xxxx
		    char2 = str.charCodeAt(i++);
		    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		    break;
		  case 14:
		    // 1110 xxxx  10xx xxxx  10xx xxxx
		    char2 = str.charCodeAt(i++);
		    char3 = str.charCodeAt(i++);
		    out += String.fromCharCode(((c & 0x0F) << 12) |
						   ((char2 & 0x3F) << 6) |
						   ((char3 & 0x3F) << 0));
		    break;
		}
    }

    return out;
}


/*!
 * 参考 jquery.base64.js 0.2 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 * 
 **/
var base64 = new function(){
	var b64 = "ABCDEFGHIJKLabcdefghijklmnopqrstuvwxyzMNOPQRS0123456789+/TUVWXYZ",
	    a256 = '',
	    r64 = [256],
	    r256 = [256],
	    i = 0;
	while(i < 256) {
	    var c = String.fromCharCode(i);
	    a256 += c;
	    r256[i] = i;
	    r64[i] = b64.indexOf(c);
	    ++i;
	}
	
	function code(s, discard, alpha, beta, w1, w2) {
	    s = String(s);
	    var buffer = 0,
	        i = 0,
	        length = s.length,
	        result = '',
	            bitsInBuffer = 0;
	
	        while(i < length) {
	            var c = s.charCodeAt(i);
	            c = c < 256 ? alpha[c] : -1;
	
	            buffer = (buffer << w1) + c;
	            bitsInBuffer += w1;
	
	            while(bitsInBuffer >= w2) {
	                bitsInBuffer -= w2;
	                var tmp = buffer >> bitsInBuffer;
	                result += beta.charAt(tmp);
	                buffer ^= tmp << bitsInBuffer;
	            }
	            ++i;
	        }
	        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
	        return result;
	    }
	
	/*
	 * base64编码
	 */
	var base64Encode = function(plain) {
	    plain = UTF8.encode(plain);
	    plain = code(plain, false, r256, b64, 8, 6);
	    return plain + '===='.slice((plain.length % 4) || 4);
	};
	
	/*
	 * base64解码
	 */
	var base64Decode = function(coded) {
	    coded = String(coded).split('=');
	    var i = coded.length;
	    do {
	    	--i;
	        coded[i] = code(coded[i], true, r64, a256, 6, 8);
	    } while (i > 0);
	    coded = coded.join('');
	    return  UTF8.decode(coded);
	};
	return {
		encode : base64Encode,  // 使用这个方法对数据进行base64加密
		decode : base64Decode  // 使用这个方法对数据进行base64解密
	}
}