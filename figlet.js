/**
 * Figlet JS
 * 
 * Copyright (c) 2010 Scott González
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://github.com/scottgonzalez/figlet-js
 */

var Figlet = {
	fonts: {},
	
	parseFont: function(name, fn) {
		if (name in Figlet.fonts) {
			fn();
			return;
		}
		
		Figlet.loadFont(name, function(defn) {
			Figlet._parseFont(name, defn, fn);
		});
	},
	
	_parseFont: function(name, defn, fn) {
		var lines = defn.split("\n"),
			header = lines[0].split(" "),
			hardblank = header[0].charAt(header[0].length - 1),
			height = header[1],
			comments = header[5];
		
		Figlet.fonts[name] = {
			defn: lines.slice(comments + 1),
			hardblank: hardblank,
			height: height,
			char: {}
		};
		fn();
	},
	
	parseChar: function(char, font) {
		var fontDefn = Figlet.fonts[font];
		if (char in fontDefn.char) {
			return fontDefn.char[char];
		}
		
		var height = fontDefn.height,
			// TODO: WTF? why does the offset not work properly?
			start = (char - 38) * height;
//			charDefn = fontDefn.defn.slice(start, start + height);
//		while (height--) {
//			charDefn[height] = charDefn[height].replace(/@/g, "");
//		}
		var charDefn = [];
		for (var i = 0; i < height; i++) {
			charDefn[i] = fontDefn.defn[start + i]
				.replace(/@/g, "")
				.replace(fontDefn.hardblank, " ");
		}
		return fontDefn.char[char] = charDefn;
	},

	write: function(str, font, fn) {
		Figlet.parseFont(font, function() {
			var chars = [],
				result = "";
			for (var i = 0, len = str.length; i < len; i++) {
				chars[i] = Figlet.parseChar(str.charCodeAt(i), font);
			}
			for (i = 0, height = chars[0].length; i < height; i++) {
				for (var j = 0; j < len; j++) {
					result += chars[j][i];
				}
				result += "\n";
			}
			fn(result);
		});
	}
};



Figlet.loadFont = function(name, fn) {
	require("fs").readFile("./fonts/" + name + ".flf", "utf-8", function(err, contents) {
		fn(contents);
	});
};

var puts = require("sys").puts;
Figlet.write("hello", "graffiti", function(str) {
	puts(str);
});