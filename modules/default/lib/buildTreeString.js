"use strict"
 
/**
 * @summary 根据目录树json 生成目录树字符串表示
 */

const deepStack = [];

let str = "";

/**
 * 构建前置占位 
 */
function buildBeforeSpacing () {
	let str = ``;
	deepStack.forEach(item => {
		if (item.num < item.length) {
			str += "│── ";
		} else if (item.num === item.length) {
			str += "└── ";
			item.num ++;
		} else if (item.num > item.length) {
			str += "    ";
		}
	});
	return str;
}

/**
 * 构建字符串目录树表示
 * 
 * @param {Object}  tree
 * @return {String}
 */
module.exports = function buildTreeString (tree) {

	if (!tree.childs) throw "fuck...";

	str += tree.name+ "\n";
	f(tree);
	str = str.replace(/\─\─\s(?=\│)/g, "   ");
	str = str.replace(/\─\─\s(?=\└)/g, "   ");
	str = str.replace(/\─\─\s(?=\s{1})/g, "   ");
	
	return str;

	function f (tree) {

		deepStack.push({
			num: 0,
			length: Object.keys(tree.childs).length
		});

		Object.keys(tree.childs).forEach(key => {
			const d = tree.childs[key];
			if (d.type === "file") {
				deepStack[deepStack.length - 1].num ++;
				if (d.comment) {
					str += buildBeforeSpacing() + d.name + " " + d.comment + "\n";
				} else {
					str += buildBeforeSpacing() + d.name + "\n";
				}
			}
			if (d.type === "dir") {
				deepStack[deepStack.length - 1].num ++;
				str += buildBeforeSpacing() + d.name + "\n";
				f(d);
			}
		});

		deepStack.pop();
	}
}