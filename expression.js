/*
Fōrmulæ string package. Module for expression definition & visualization.
Copyright (C) 2015-2023 Laurence R. Ugalde

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

StringPackage.stringType = 0; // 0: locally quoted, 1: simple, 2: boxed

StringPackage.String = class extends Expression.NullaryExpression {
	getTag() { return "String.String"; }
	getName() { return StringPackage.messages.nameString; }
	
	set(name, value) {
		if (name == "Value") {
			this.string = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Value") {
			return this.string;
		}
		
		return super.get(name);
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Value", strings[0]);
	}
	
	getSerializationNames() {
		return [ "Value" ];
	}
	
	getSerializationStrings() {
		return [ this.string ];
	}

	prepareDisplay(context) {
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier");
		
		switch (StringPackage.stringType) {
			case 0: this.width = Math.round(context.measureText(StringPackage.messages.openingQuotationMark + this.string + StringPackage.messages.closingQuotationMark).width); break;
			case 1: { let s = this.string; if (s.length == 0) s = "ε"; this.width = Math.round(context.measureText(s).width); }	break;
			case 2: this.width = this.string.length == 0 ? 2 : Math.round(context.measureText(this.string).width); break;
		}

		context.fontInfo.setName(context, bkp);

		this.height = context.fontInfo.size;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);
	}

	display(context, x, y) {
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier");

		switch (StringPackage.stringType) {
			case 0:  // localized quotes
				super.drawText(context, StringPackage.messages.openingQuotationMark + this.string + StringPackage.messages.closingQuotationMark, x, y + context.fontInfo.size);
				break;

			case 1:  // simple
				if (this.string.length == 0) {
					let bkpFillStyle = context.fillStyle;
					context.fillStyle = "red";

					super.drawText(context, "ε", x, y + context.fontInfo.size),

					context.fillStyle = bkpFillStyle;
				}
				else {
					super.drawText(context, this.string, x, y + context.fontInfo.size);
				}
				break;

			case 2: { // boxed
					super.drawText(context, this.string, x, y + context.fontInfo.size);
					let bkpStrokeStyle = context.strokeStyle;
					context.strokeStyle = "gray";
					context.strokeRect(x, y, this.width, this.height);
					context.strokeStyle = bkpStrokeStyle;
				}
				break;
		}

		context.fontInfo.setName(context, bkp);
	}
}

//StringPackage.Text = class extends Expression.NullaryExpression {
StringPackage.Text = class extends StringPackage.String {
	getTag() { return "String.Text"; }
	getName() { return "Text"; }
	
	/*
	set(name, value) {
		if (name == "Value") {
			this.text = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Value") {
			return this.text;
		}
		
		super.get(name);
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Value", strings[0]);
	}
	
	getSerializationNames() {
		return [ "Value" ];
	}
	
	getSerializationStrings() {
		return [ this.text ];
	}
	*/

	prepareDisplay(context) {
		this.width = Math.round(context.measureText(this.string).width);
		this.height = context.fontInfo.size;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);
	}

	display(context, x, y) {
		super.drawText(context, this.string, x, y + context.fontInfo.size);
	}
}

StringPackage.RegularExpression = class extends StringPackage.String {
	getTag() { return "String.RegularExpression"; }
	getName() { return "Regular expression"; }
	
	setSerializationStrings(strings, promises) {
		try {
			let x = new RegExp(strings[0]);
			this.set("Value", strings[0]);
		}
		catch (e) {
			throw "Value is not a regular expression";
		}
	}
	
	prepareDisplay(context) {
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier");
		
		this.width = context.fontInfo.size + (this.string.length == 0 ? 2 : Math.round(context.measureText(this.string).width));

		context.fontInfo.setName(context, bkp);

		this.height = context.fontInfo.size;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round((this.width + context.fontInfo.size) / 2);
	}

	display(context, x, y) {
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier");

		super.drawText(context, this.string, x + Math.round(context.fontInfo.size / 2), y + context.fontInfo.size);
		let bkpStrokeStyle = context.strokeStyle;
		context.strokeStyle = "gray";
		
		//context.strokeRect(x, y, this.width, this.height);
		context.moveTo(x + Math.round(context.fontInfo.size / 2), y);
		context.lineTo(x + this.width, y);
		context.lineTo(x + this.width - Math.round(context.fontInfo.size / 2), y + this.height);
		context.lineTo(x, y + this.height);
		context.lineTo(x + Math.round(context.fontInfo.size / 2), y);
		context.stroke();
		
		context.strokeStyle = bkpStrokeStyle;

		context.fontInfo.setName(context, bkp);
	}
}

StringPackage.Password = class extends StringPackage.String {
	getTag() { return "String.Password"; }
	getName() { return StringPackage.messages.namePassword; }
	getLiteral() { return "*****"; }

	prepareDisplay(context) {
		this.prepareDisplayAsLiteral(context);
	}
	
	display(context, x, y) {
		this.displayAsLiteral(context, x, y);
	}
}

StringPackage.URL = class extends Expression.NullaryExpression {
	getTag() { return "Internet.UniformResourceLocator"; }
	getName() { return "Internet uniform resource locator" }
	
	set(name, value) {
		switch (name) {
			case "Value"      : this.url         = value; return;
			case "Description": this.description = value; return;
		}

		super.set(name, value);
	}
	
	get(name) {
		switch (name) {
			case "Value"      : return this.url;
			case "Description": return this.description;
		}
		
		super.get(name);
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Value",       strings[0]);
		this.set("Description", strings[1]);
	}
	
	getSerializationNames() {
		return [ "Value", "Description" ];
	}
	
	getSerializationStrings() {
		return [ this.url, this.description ];
	}

	prepareDisplay(context) {
		this.width = Math.round(context.measureText(this.description).width);
		this.height = context.fontInfo.size;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);
	}

	display(context, x, y) {
		let bkpFillStyle = context.fillStyle;
		//context.fillStyle = "blue";
		context.fillStyle = "green";
		super.drawText(context, this.description, x, y + context.fontInfo.size);
		context.fillStyle = bkpFillStyle;
	}
}

StringPackage.setExpressions = function(module) {
	Formulae.setExpression(module, "String.String",            StringPackage.String);
	Formulae.setExpression(module, "String.Text",              StringPackage.Text);
	Formulae.setExpression(module, "String.RegularExpression", StringPackage.RegularExpression);
	Formulae.setExpression(module, "String.Password",          StringPackage.Password);
	
	Formulae.setExpression(module, "Internet.UniformResourceLocator", StringPackage.URL);
	
	// concatenation, infix, two or more operands
	Formulae.setExpression(module, "String.Concatenation", {
		clazz:       Expression.Infix,
		getTag:      () => "String.Concatenation",
		getOperator: () => this.messages.operatorConcatenation,
		getName:     () => this.messages.nameConcatenation,
		min: -2
	});
	
	// infix, two operands
	[ "Contains", "StartsWith", "EndsWith", "Matches" ].forEach(tag => Formulae.setExpression(module, "String." + tag, {
		clazz:        Expression.Infix,
		getTag:       () => "String." + tag,
		getOperator:  () => StringPackage.messages["operator" + tag],
		getName:      () => StringPackage.messages["name" + tag],
		//getChildName: index => StringPackage.messages.childrenSearch[index],
		min: 2, max: 2
	}));
	
	// 1-parameter functions
	[ "Length", "Uppercase", "Lowercase", "Trim",
	  "Reverse", "Encode", "Decode",
	  "ToText", "ToRegularExpression", "ToPassword"
	].forEach(tag => Formulae.setExpression(module, "String." + tag, {
		clazz:       Expression.Function,
		getTag:      () => "String." + tag,
		getMnemonic: () => StringPackage.messages["mnemonic" + tag],
		getName:     () => StringPackage.messages["name" + tag]
	}));
	
	// string format
	Formulae.setExpression(module, "String.Format", {
		clazz:       Expression.Function,
		getTag:      () => "String.Format",
		getMnemonic: () => this.messages.mnemonicFormat,	
		getName:     () => this.messages.nameFormat,
		min: -2
	});
	
	// searching functions
	[ "Index", "Indexes" /*, "Contains", "StartsWith", "EndsWith"*/ ].forEach(tag => Formulae.setExpression(module, "String." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "String." + tag,
		getMnemonic:  () => StringPackage.messages["mnemonic" + tag],
		getName:      () => StringPackage.messages["name" + tag],
		getChildName: index => StringPackage.messages.childrenSearch[index],
		min: 2, max: 2
	}));
	
	// replacing functions
	[ "Replace", "ReplaceAll" ].forEach(tag => Formulae.setExpression(module, "String." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "String." + tag,
		getMnemonic:  () => StringPackage.messages["mnemonic" + tag],
		getName:      () => StringPackage.messages["name" + tag],
		getChildName: index => StringPackage.messages.childrenReplace[index],
		min: 3, max: 3
	}));
	
	[ // functions
		[ "SubstringToPos", 3, 3 ],
		[ "SubstringToN",   3, 3 ],
		[ "Substring",      2, 2 ],
		//[ "Matches",        2, 2 ],
		[ "Split",          1, 2 ],
		[ "ToString",       1, 2 ]
	].forEach(row => Formulae.setExpression(module, "String." + row[0], {
		clazz:        Expression.Function,
		getTag:       () => "String." + row[0],
		getMnemonic:  () => StringPackage.messages["mnemonic" + row[0]],
		getName:      () => StringPackage.messages["name" + row[0]],
		getChildName: index => StringPackage.messages["children" + row[0]][index],
		min:          row[1],
		max:          row[2]
	}));
};

StringPackage.isConfigurable = () => true;

StringPackage.onConfiguration = () => {
	let table = document.createElement("table");
	table.classList.add("bordered");
	let row = table.insertRow();
	let th = document.createElement("th"); th.setAttribute("colspan", "2"); th.appendChild(document.createTextNode(Formulae.messages.labelStrings)); row.appendChild(th);
	row = table.insertRow();
	let col = row.insertCell();
	col.appendChild(document.createTextNode(Formulae.messages.labelStringStyle));
	col = row.insertCell();
	
	let radio = document.createElement("input"); radio.type = "radio"; radio.addEventListener("click", () => StringPackage.onChangeStringStyle(0));
	col.appendChild(radio);
	col.appendChild(document.createTextNode(Formulae.messages.labelStringQuoted));
	
	col.appendChild(document.createElement("br"));
	
	radio = document.createElement("input"); radio.type = "radio"; radio.addEventListener("click", () => StringPackage.onChangeStringStyle(1));
	col.appendChild(radio);
	col.appendChild(document.createTextNode(Formulae.messages.labelStringSimple));
	
	col.appendChild(document.createElement("br"));
	
	radio = document.createElement("input"); radio.type = "radio"; radio.addEventListener("click", () => StringPackage.onChangeStringStyle(2));
	col.appendChild(radio);
	let span = document.createElement("span"); span.style.border = "1px solid gray";
	col.appendChild(span);
	span.appendChild(document.createTextNode(Formulae.messages.labelStringBoxed));
	
	Formulae.setModal(table);
};

StringPackage.onChangeStringStyle = function(pos) {
	Formulae.resetModal();
	
	StringPackage.stringType = pos;
	Formulae.refreshHandlers();
};
