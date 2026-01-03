/*
Fōrmulæ string package. Module for reduction.
Copyright (C) 2015-2026 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class StringPackage extends Formulae.Package {}

StringPackage.concatenation = async (concatenation, session) => {
	let s = '';
	let child;
	
	for (let i = 0, n = concatenation.children.length; i < n; ++i) {
		child = concatenation.children[i];
		
		if (child.getTag() !== "String.String") {
			ReductionManager.setInError(child, "Expression must be a string");
			throw new ReductionError();
		}
		
		s += child.get("Value");
	}
	
	let result = Formulae.createExpression("String.String");
	result.set("Value", s);
	concatenation.replaceBy(result);
	//session.log("String concatenation");
	return true;
};
	
StringPackage.functionReducer = async (functionExpression, session) => {
	let argument = functionExpression.children[0];
	
	if (argument.getTag() !== "String.String") {
		ReductionManager.setInError(argument, "Expression must be a string");
		throw new ReductionError();
	}
	
	let value = argument.get("Value");
	let result = null;
	
	switch (functionExpression.getTag()) {
		case "String.Length":
			result = Arithmetic.createInternalNumber(Arithmetic.createInteger(value.length, session), session);
			break;
		
		case "String.Uppercase":
			argument.set("Value", value.toUpperCase());
			result = argument;
			break;
		
		case "String.Lowercase":
			argument.set("Value", value.toLowerCase());
			result = argument;
			break;
		
		case "String.Trim":
			argument.set("Value", value.trim());
			result = argument;
			break;
		
		case "String.Reverse":
			argument.set("Value", value.split("").reverse().join(""));
			result = argument;
			break;
	}
	
	functionExpression.replaceBy(result);
	return true;
};

StringPackage.functionStringString = async (functionExpression, session) => {
	let argument1 = functionExpression.children[0];
	if (argument1.getTag() !== "String.String") {
		ReductionManager.setInError(argument1, "Expression must be a string");
		throw new ReductionError();
	}
	
	let argument2 = functionExpression.children[1];
	if (argument2.getTag() !== "String.String") {
		ReductionManager.setInError(argument2, "Expression must be a string");
		throw new ReductionError();
	}
	
	let value1 = argument1.get("Value");
	let value2 = argument2.get("Value");
	
	//String log = null;
	let result = null;
	
	switch (functionExpression.getTag()) {
		case "String.Index":
			result = Arithmetic.createInternalNumber(
				Arithmetic.createInteger(value1.indexOf(value2) + 1, session),
				session
			);
			break;
		
		case "String.Indexes":
			{
				result = Formulae.createExpression("List.List");
				let pos = value1.indexOf(value2);
				while (pos != -1) {
					result.addChild(
						Arithmetic.createInternalNumber(
							Arithmetic.createInteger(pos + 1, session),
							session
						)
					);
					pos = value1.indexOf(value2, pos + 1);
					
				}
			}
			break;
		
		case "String.StartsWith":
			result = Formulae.createExpression(
				value1.startsWith(value2) ? "Logic.True" : "Logic.False"
			);
			break;
		
		case "String.EndsWith":
			result = Formulae.createExpression(
				value1.endsWith(value2) ? "Logic.True" : "Logic.False"
			);
			break;
		
	}
	
	functionExpression.replaceBy(result);
	//session.log(log);
	return true;
};

StringPackage.contains = async (contains, session) => {
	let argument1 = contains.children[0];
	if (argument1.getTag() !== "String.String") {
		ReductionManager.setInError(argument1, "Expression must be a string");
		throw new ReductionError();
	}
	
	let argument2 = contains.children[1];
	let tag2 = argument2.getTag();
	
	if (tag2 === "String.String") {
		contains.replaceBy(
			Formulae.createExpression(
				argument1.get("Value").indexOf(argument2.get("Value")) >= 0 ? "Logic.True" : "Logic.False"
			)
		);
		return true;
	}
	
	if (tag2 === "String.RegularExpression") {
		contains.replaceBy(
			Formulae.createExpression(
				argument1.get("Value").search(new RegExp(argument2.get("Value"))) >= 0 ? "Logic.True" : "Logic.False"
			)
		);
		return true;
	}
	
	ReductionManager.setInError(argument2, "Expression must be a string or a regular expression");
	throw new ReductionError();
};

StringPackage.matches = async (matches, session) => {
	let argument1 = matches.children[0];
	if (argument1.getTag() !== "String.String") {
		ReductionManager.setInError(argument1, "Expression must be a string");
		throw new ReductionError();
	}
	
	let argument2 = matches.children[1];
	if (argument2.getTag() !== "String.RegularExpression") {
		ReductionManager.setInError(argument2, "Expression must be a regular expression");
		throw new ReductionError();
	}
	
	matches.replaceBy(
		Formulae.createExpression(
			new RegExp(argument2.get("Value")).test(argument1.get("Value")) ? "Logic.True" : "Logic.False"
		)
	);
	
	return true;
};

StringPackage.replacement = async (replacement, session) => {
	let argument1 = replacement.children[0];
	if (argument1.getTag() !== "String.String") {
		ReductionManager.setInError(argument1, "Expression must be a string");
		throw new ReductionError();
	}
	
	let argument2 = replacement.children[1];
	let pattern;
	let isFirst = replacement.getTag() == "String.Replace";
	
	switch (argument2.getTag()) {
		case "String.String":
			pattern = argument2.get("Value");
			break;
		
		case "String.RegularExpression":
			
			pattern =
				isFirst ?
				new RegExp(argument2.get("Value")) :
				new RegExp(argument2.get("Value"), "g")
			;
			break;
		
		default:
			ReductionManager.setInError(argument2, "Expression must be a string or a regular expression");
			throw new ReductionError();
	}
	
	let argument3 = replacement.children[2];
	if (argument1.getTag() !== "String.String") {
		ReductionManager.setInError(argument2, "Expression must be a string");
		throw new ReductionError();
	}

	let result = Formulae.createExpression("String.String");
	result.set(
		"Value",
		isFirst ?
		argument1.get("Value").replace   (pattern, argument3.get("Value")) :
		argument1.get("Value").replaceAll(pattern, argument3.get("Value"))
	);
	replacement.replaceBy(result);
	return true;
};

StringPackage.split = async (split, session) => {
	let s = split.children[0];
	
	if (s.getTag() !== "String.String") {
		Util.setInError(session.getFactory(), s, "Expression must be a string");
		throw new ReductionException();
	}
	
	let value = s.get("Value");
	let result = null;
	
	if (split.children.length == 1) {
		result = StringPackage.splitEvery(value, 1);
	}
	else { // 2
		let spec = split.children[1];
		
		switch (spec.getTag()) {
			case "Math.InternalNumber": {
					let n = Arithmetic.getNativeInteger(spec);
					if (n === undefined || n <= 0) {
						ReductionManager.setInError(spec, "Expression must be a positive integer number");
						throw new ReductionError();
					}
					result = StringPackage.splitEvery(value, n);
				}
				break;
			
			case "String.String":
				result = StringPackage.splitPattern(value, spec.get("Value"));
				break;
			
			case "String.RegularExpression":
				result = StringPackage.splitPattern(value, new RegExp(spec.get("Value"), "g"));
				break;
				
			case "List.List":
				result = StringPackage.splitList(value, spec);
				break;
			
			default:
				return false;
		}
	}
	
	split.replaceBy(result);
	//session.log("String split");
	return true;
}
		
StringPackage.splitEvery = (s, size) => {
	let result = Formulae.createExpression("List.List");
	let strExpr;
	
	(s.match(new RegExp("[\\s\\S]{1," + size + "}", "g")) || []).forEach(part => {
		strExpr = Formulae.createExpression("String.String");
		strExpr.set("Value", part);
		result.addChild(strExpr);
	});
	
	return result;
};

StringPackage.splitPattern = (s, pattern) => {
	let result = Formulae.createExpression("List.List");
	let strExpr;
	
	s.split(pattern).forEach(part => {
		strExpr = Formulae.createExpression("String.String");
		strExpr.set("Value", part);
		result.addChild(strExpr);
	});
	
	return result;
};

StringPackage.splitList = (value, list) => {
	let i, n = list.children.length;
	let size = value.length;
	let positions = new Array(n);
	let last = 0;
	let test;
	
	for (i = 0; i < n; ++i) {
		test = Arithmetic.getNativeInteger(list.children[i]);
		if (test === undefined || test == 0 || Math.abs(test) <= Math.abs(last) || Math.abs(test) > size ) {
			ReductionManager.setInError(list.children[i], "Invalid value");
			throw new ReductionError();
		}
		positions[i] = last = test;
	}
	
	last = 0;
	let result = Formulae.createExpression("List.List");
	let strExpr;
	for (i = 0; i < n; ++i) {
		//if (Math.abs(positions[i]) > 1) {
			strExpr = Formulae.createExpression("String.String");
			strExpr.set("Value", value.substring(last, Math.abs(positions[i]) - 1));
			result.addChild(strExpr);
		//}
		
		last = Math.abs(positions[i]);
		if (positions[i] > 0) {
			--last;
		}
	}
	
	// last element
	strExpr = Formulae.createExpression("String.String");
	strExpr.set("Value", value.substring(last));
	result.addChild(strExpr);
	
	return result;
};

/*	
StringPackage.format = async (format, session) => {
	Expression exprSpec = format.getChild(0);
	if (!exprSpec.getTag().equals(StringDescriptor.TAG_STRING)) {
		Util.setInError(session.getFactory(), exprSpec, "Expression must be a string");
		throw new ReductionException();
	}
	String spec = (String) exprSpec.get("Value");
	
	int n = format.getChildCount();
	Object[] args = new Object[n];
	Expression arg;
	for (int i = 1; i < n; ++i) {
		arg = format.getChild(i);
		switch (arg.getTag()) {
			case StringDescriptor.TAG_STRING:
			case StringDescriptor.TAG_NUMBER:
				args[i - 1] = arg.get("Value");
				break;
			
			default:
				Util.setInError(session.getFactory(), arg, "Invalid expression");
				throw new ReductionException();
		}
	}
	
	try {
		Expression result = session.getFactory().createExpression(StringDescriptor.TAG_STRING);
		result.set("Value", String.format(spec, args ));
		format.replaceBy(result);
		//session.log("String formatting");
		return true;
	}
	catch (IllegalFormatException ife) {
		Util.setInError(session.getFactory(), exprSpec, "Invalid format");
		throw new ReductionException();
	}
};
*/
	
StringPackage.arrayToString = async (toString, session) => {
	let argument = toString.children[0];
	if (argument.getTag() !== "List.List") {
		return false; // Ok, forward to other forms of ToString
	}
	
	let i, n = argument.children.length;
	for (i = 0; i < n; ++i) {
		if (argument.children[i].getTag() !== "String.String") {
			ReductionManager.setInError(argument.children[i], "Expression must be a string");
			throw new ReductionError();
		}
	}
	
	let result = Formulae.createExpression("String.String");
	result.set(
		"Value",
		argument.children.map(child => child.get("Value")).join("")
	);
	
	toString.replaceBy(result);
	return true;
};

StringPackage.to = async (to, session) => {
	let argument = to.children[0];
	let value;
	
	switch (argument.getTag()) {
		case "String.String":
		case "String.Text":
		case "String.RegularExpression":
		case "String.Password":
			value = argument.get("Value");
			break;
		
		default:
			return false;
	}
	
	let result;
	switch (to.getTag()) {
		case "String.ToString":
			result = Formulae.createExpression("String.String");
			break;
		
		case "String.ToText":
			result = Formulae.createExpression("String.Text");
			break;
		
		case "String.ToRegularExpression":
			try {
				let x = new RegExp(value);
			}
			catch (e) {
				ReductionManager.setInError(argument, "Invalid value for a regular expression");
				throw new ReductionError();
			}
			result = Formulae.createExpression("String.RegularExpression");
			break;
		
		case "String.ToPassword":
			result = Formulae.createExpression("String.Password");
			break;
	}

	result.set("Value", value);	
	to.replaceBy(result);
	return true;
};

StringPackage.compareReducer = async (compare, session) => {
	let left = compare.children[0], right = compare.children[1];
	let leftTag = left.getTag(), rightTag = right.getTag();
	
	if (
		(leftTag  === "String.String" || leftTag  === "String.Text" || leftTag  === "String.RegularExpression") &&
		(rightTag === "String.String" || rightTag === "String.Text" || rightTag === "String.RegularExpression")
	) {
		let result = (left.get("Value")).localeCompare(right.get("Value"));
		
		compare.replaceBy(
			Formulae.createExpression(
				result == 0 ?
				"Relation.Comparison.Equals" :
				(
					result < 0 ?
					"Relation.Comparison.Less" :
					"Relation.Comparison.Greater"
				)
			)
		);
		
		//session.log("String comparison");
		return true;
	}
	
	return false; // Ok, forward to other forms of Compare
};

StringPackage.subString = async (subString, session) => {
	let sExpression = subString.children[0];
	if (sExpression.getTag() !== "String.String") {
		ReductionManager.setInError(sExpression, "Expression must be a string");
		throw new ReductionError();
	}
	let s = sExpression.get("Value");
	
	let n1 = Arithmetic.getNativeInteger(subString.children[1]);
	if (n1 === undefined || n1 == 0) {
		ReductionManager.setInError(subString.children[1], "Invalid index");
		throw new ReductionError();
	}
	
	if (n1 < 0) {
		n1 = s.length + n1 + 1;
	}
	
	if (subString.getTag() === "String.Substring") {
		if (n1 > s.length + 1) {
			ReductionManager.setInError(subString.children[1], "Invalid index");
			throw new ReductionError();
		}

		let result = Formulae.createExpression("String.String");
		result.set("Value", s.substring(n1 - 1));
		subString.replaceBy(result);
	}
	else {
		let n2 = Arithmetic.getNativeInteger(subString.children[2]);
		if (n2 === undefined) {
			ReductionManager.setInError(subString.children[2], "Expression must be numeric");
			throw new ReductionError();
		}
		
		if (subString.getTag() === "String.SubstringToPos") {
			if (n2 == 0) {
				ReductionManager.setInError(subString.children[2], "Invalid index");
				throw new ReductionError();
			}
			
			if (n2 < 0) {
				n2 = s.length + n2 + 1;
			}
			
			if (n2 > s.length + 1) {
				ReductionManager.setInError(subString.children[2], "Invalid value");
				throw new ReductionError();
			}
			
			if (n1 > n2) {
				ReductionManager.setInError(subString.children[1], "Invalid value");
				throw new ReductionError();
			}

			let result = Formulae.createExpression("String.String");
			result.set("Value", s.substring(n1 - 1, n2 - 1));
			subString.replaceBy(result);
		}
		else { // pos & n
			if (n2 < 0) {
				n1 += n2;
				n2 = -n2;
			}
			
			if (n1 <= 0) {
				ReductionManager.setInError(subString.children[2], "Invalid index");
				throw new ReductionError();
			}
			
			if (
				n1 > s.length ||
				n1 + n2 - 1 > s.length
			) {
				ReductionManager.setInError(subString.children[1], "Invalid index");
				throw new ReductionError();
			}

			let result = Formulae.createExpression("String.String");
			result.set("Value", s.substring(n1 - 1, n1 + n2 - 1));
			subString.replaceBy(result);
		}
	}
	
	//session.log("Substring extracted");
	return true;
};

StringPackage.encode = async (encode, session) => {
	let arg = encode.children[0];
	
	let n;
	numeric: {
		n = Arithmetic.getNativeInteger(arg);
		
		if (n === undefined) {
			break numeric;
		}
		
		if (n <= 0) {
			ReductionManager.setInError(arg, "Expression must be a non-negative integer number");
			throw new ReductionError();
		}
		
		let result = Formulae.createExpression("String.String");
		result.set("Value", String.fromCodePoint(n));
		encode.replaceBy(result);
		return true;
	}
	
	if (arg.getTag() !== "List.List") {
		ReductionManager.setInError(arg, "Expression must be a number or a list of numbers");
		throw new ReductionError();
	}
	
	let array = arg.children.map(expr => Arithmetic.getNativeInteger(expr));
	let result = Formulae.createExpression("String.String");
	result.set("Value", String.fromCodePoint( ...array));
	encode.replaceBy(result);
	return true;
	
	/*
	int size = arg.getChildCount();
	int[] arr = new int[size];
	
	Expression child;
	
	for (int i = 0; i < size; ++i) {
		child = arg.getChild(i);
		
		n = Arithmetic.getInteger(child);
		if (n == null || n <= 0) {
			Util.setInError(session.getFactory(), child, "Expression must be a non-negative integer number");
			throw new ReductionException();
		}
		
		arr[i] = n;
	}
	
	Expression result = session.getFactory().createExpression(
		StringDescriptor.TAG_STRING,
		"Value", new String(arr, 0, size)
	);
	
	encode.replaceBy(result);
	//session.log("String encoding");
	return true;
	*/
};

StringPackage.decode = async (decode, session) => {
	let arg = decode.children[0];
	
	if (arg.getTag() !== "String.String") {
		ReductionManager.setInError(arg, "Expression must be a string");
		throw new ReductionError();
	}
	
	let result = Formulae.createExpression("List.List");
	let str = arg.get("Value");
	let array = [...str];
	array.forEach(ch => result.addChild(
		Arithmetic.createInternalNumber(
			Arithmetic.createInteger(ch.codePointAt(0), session),
			session
		)
	));
	
	decode.replaceBy(result);
	return true;
};

StringPackage.setReducers = () => {
	ReductionManager.addReducer("String.Concatenation", StringPackage.concatenation, "StringPackage.concatenation");
	
	ReductionManager.addReducer("String.Length",    StringPackage.functionReducer, "StringPackage.functionReducer");
	ReductionManager.addReducer("String.Uppercase", StringPackage.functionReducer, "StringPackage.functionReducer");
	ReductionManager.addReducer("String.Lowercase", StringPackage.functionReducer, "StringPackage.functionReducer");
	ReductionManager.addReducer("String.Trim",      StringPackage.functionReducer, "StringPackage.functionReducer");
	ReductionManager.addReducer("String.Reverse",   StringPackage.functionReducer, "StringPackage.functionReducer");
	
	ReductionManager.addReducer("String.StartsWith", StringPackage.functionStringString, "StringPackage.functionStringString");
	ReductionManager.addReducer("String.EndsWith",   StringPackage.functionStringString, "StringPackage.functionStringString");
	ReductionManager.addReducer("String.Index",      StringPackage.functionStringString, "StringPackage.functionStringString");
	ReductionManager.addReducer("String.Indexes",    StringPackage.functionStringString, "StringPackage.functionStringString");
	
	ReductionManager.addReducer("String.Contains",   StringPackage.contains,    "StringPackage.contains");
	ReductionManager.addReducer("String.Matches",    StringPackage.matches,     "StringPackage.matches");
	ReductionManager.addReducer("String.Replace",    StringPackage.replacement, "StringPackage.replacement");
	ReductionManager.addReducer("String.ReplaceAll", StringPackage.replacement, "StringPackage.replacement");
	ReductionManager.addReducer("String.Split",      StringPackage.split,       "StringPackage.split");
	
	ReductionManager.addReducer("String.SubstringToPos", StringPackage.subString, "StringPackage.subString");
	ReductionManager.addReducer("String.SubstringToN",   StringPackage.subString, "StringPackage.subString");
	ReductionManager.addReducer("String.Substring",      StringPackage.subString, "StringPackage.subString");
	
	ReductionManager.addReducer("Relation.Compare", StringPackage.compareReducer, "StringPackage.compareReducer");
	
	ReductionManager.addReducer("String.ToString",            StringPackage.arrayToString, "StringPackage.arrayToString");
	ReductionManager.addReducer("String.ToString",            StringPackage.to,            "StringPackage.to");
	ReductionManager.addReducer("String.ToText",              StringPackage.to,            "StringPackage.to");
	ReductionManager.addReducer("String.ToRegularExpression", StringPackage.to,            "StringPackage.to");
	ReductionManager.addReducer("String.ToPassword",          StringPackage.to,            "StringPackage.to");
	
	ReductionManager.addReducer("String.Encode", StringPackage.encode, "StringPackage.encode");
	ReductionManager.addReducer("String.Decode", StringPackage.decode, "StringPackage.decode");
};
