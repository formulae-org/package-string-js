/*
Fōrmulæ string package. Module for edition.
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

"use strict";

export class StringPackage extends Formulae.Package {}

StringPackage.editionString = function() {
	let s = prompt(StringPackage.messages.enterString);
	
	if (s == null) return;
	
	let newExpression = Formulae.createExpression("String.String");
	newExpression.set("Value", s);
	
	Formulae.sExpression.replaceBy(newExpression);
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression, false);
}

StringPackage.actionString = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => StringPackage.messages.actionEditString,
	doAction: () => {
		let s = Formulae.sExpression.get("Value");
		s = prompt(StringPackage.messages.updateString, s);
		
		if (s == null) return;
		
		Formulae.sExpression.set("Value", s);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

StringPackage.editionText = function() {
	let s = prompt("Enter text");
	
	if (s == null) return;
	
	let newExpression = Formulae.createExpression("String.Text");
	newExpression.set("Value", s);
	
	Formulae.sExpression.replaceBy(newExpression);
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression, false);
}

StringPackage.actionText = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => StringPackage.messages.actionEditText,
	doAction: () => {
		let s = Formulae.sExpression.get("Value");
		s = prompt("Update text", s);
		
		if (s == null) return;
		
		Formulae.sExpression.set("Value", s);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

StringPackage.actionString2Text = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => StringPackage.messages.actionConvertToText,
	doAction: () => {
		let newExpression = Formulae.createExpression("String.Text");
		newExpression.set("Value", Formulae.sExpression.get("Value"));
		Formulae.sExpression.replaceBy(newExpression);
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, newExpression, false);
	}
};

StringPackage.actionText2String = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => StringPackage.messages.actionConvertToString,
	doAction: () => {
		let newExpression = Formulae.createExpression("String.String");
		newExpression.set("Value", Formulae.sExpression.get("Value"));
		Formulae.sExpression.replaceBy(newExpression);
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, newExpression, false);
	}
};

StringPackage.editionRegularExpression = function() {
	let s = "";
	
	while (true) {
		s = prompt("Enter regular expression", s);
		
		if (s == null) return;
		
		try {
			let x = new RegExp(s);
			break;
		}
		catch (e) {
			continue;
		}
	}
	
	let newExpression = Formulae.createExpression("String.RegularExpression");
	newExpression.set("Value", s);
	
	Formulae.sExpression.replaceBy(newExpression);
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression, false);
}

StringPackage.actionRegularExpression = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => StringPackage.messages.actionEditRegularExpression,
	doAction: () => {
		let s = Formulae.sExpression.get("Value");
		
		while (true) {
			s = prompt("Update regular expression", s);
			
			if (s == null) return;
			
			try {
				let x = new RegExp(s);
				break;
			}
			catch (e) {
				continue;
			}
		}
		
		Formulae.sExpression.set("Value", s);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

StringPackage.editionPassword = function() {
	let s = prompt(StringPackage.messages.enterPassword);
	
	if (s == null) return;
	
	let newExpression = Formulae.createExpression("String.Password");
	newExpression.set("Value", s);
	
	Formulae.sExpression.replaceBy(newExpression);
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression, false);
}

StringPackage.setEditions = function() {

	// Creation editions — the content is prompted, so (like the arithmetic Number entry) they are labeled with plain text…
	Formulae.addEdition(this.messages.pathString, this.messages.leafString,            this.messages.leafString,            Formulae.editionString = StringPackage.editionString);
	Formulae.addEdition(this.messages.pathString, this.messages.leafText,              this.messages.leafText,              Formulae.editionText = StringPackage.editionText);
	Formulae.addEdition(this.messages.pathString, this.messages.leafRegularExpression, this.messages.leafRegularExpression, StringPackage.editionRegularExpression);
	// …except a password, which always renders as a fixed ***** regardless of content, so it can show that glyph
	Formulae.addEdition(this.messages.pathString, '<expression tag="String.Password" Value=""/>', this.messages.leafPassword, StringPackage.editionPassword);

	Formulae.addWrapperEditions(this.messages, "String", "String", [ "Length" ]);
	Formulae.addBinaryEdition(this.messages, "String", "Concatenation", "String.Concatenation");   // ▮ ⋈ ▯
	[ "SubstringToPos", "SubstringToN" ].forEach(tag => Formulae.addEdition(
		this.messages.pathString, Formulae.icon("String." + tag, 3), this.messages[ "leaf" + tag ],
		() => Expression.multipleEdition("String." + tag, 3, 0)
	));
	[ "Substring", "Index", "Indexes", "Contains", "StartsWith", "EndsWith" ].forEach(
		leaf => Formulae.addBinaryEdition(this.messages, "String", leaf, "String." + leaf)
	);
	Formulae.addWrapperEditions(this.messages, "String", "String", [ "Uppercase", "Lowercase" ]);
	[ "Replace", "ReplaceAll" ].forEach(tag => Formulae.addEdition(
		this.messages.pathString, Formulae.icon("String." + tag, 3), this.messages[ "leaf" + tag ],
		() => Expression.multipleEdition("String." + tag, 3, 0)
	));
	Formulae.addWrapperEditions(this.messages, "String", "String", [ "Trim" ]);
	[ "Matches", "Split", "Format" ].forEach(
		leaf => Formulae.addBinaryEdition(this.messages, "String", leaf, "String." + leaf)
	);
	Formulae.addWrapperEditions(this.messages, "String", "String",
		[ "Reverse", "Encode", "Decode", "ToString", "ToText", "ToRegularExpression", "ToPassword", "Log" ]);
};

StringPackage.setActions = function() {
	Formulae.addAction("String.String",                   StringPackage.actionString);
	Formulae.addAction("String.String",                   StringPackage.actionString2Text);
	Formulae.addAction("String.Text",                     StringPackage.actionText);
	Formulae.addAction("String.Text",                     StringPackage.actionText2String);
	Formulae.addAction("String.RegularExpression",        StringPackage.actionRegularExpression);
};

