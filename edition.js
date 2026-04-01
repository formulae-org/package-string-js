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

'use strict';

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
	getDescription: () => "Edit string...",
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
	getDescription: () => "Edit text...",
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
	getDescription: () => "Convert to text",
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
	getDescription: () => "Convert to string",
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
	getDescription: () => "Edit regular expression...",
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
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafString, Formulae.editionString = StringPackage.editionString);
	Formulae.addEdition(this.messages.pathString, null, "Text",                   Formulae.editionText = StringPackage.editionText);
	Formulae.addEdition(this.messages.pathString, null, "Regular expression",     StringPackage.editionRegularExpression);
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafPassword, StringPackage.editionPassword);

	Formulae.addEdition(this.messages.pathString, null, this.messages.leafLength, () => Expression.wrapperEdition("String.Length"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafConcatenation, () => Expression.binaryEdition("String.Concatenation", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafSubstringToPos, () => Expression.multipleEdition("String.SubstringToPos", 3, 0));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafSubstringToN, () => Expression.multipleEdition("String.SubstringToN", 3, 0));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafSubstring, () => Expression.binaryEdition("String.Substring", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafIndex, () => Expression.binaryEdition("String.Index", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafIndexes, () => Expression.binaryEdition("String.Indexes", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafContains, () => Expression.binaryEdition("String.Contains", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafStartsWith, () => Expression.binaryEdition("String.StartsWith", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafEndsWith, () => Expression.binaryEdition("String.EndsWith", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafUppercase, () => Expression.wrapperEdition("String.Uppercase"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafLowercase, () => Expression.wrapperEdition("String.Lowercase"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafReplace, () => Expression.multipleEdition("String.Replace", 3, 0));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafReplaceAll, () => Expression.multipleEdition("String.ReplaceAll", 3, 0));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafTrim, () => Expression.wrapperEdition("String.Trim"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafMatches, () => Expression.binaryEdition("String.Matches", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafSplit, () => Expression.binaryEdition("String.Split", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafFormat, () => Expression.binaryEdition("String.Format", false));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafReverse, () => Expression.wrapperEdition("String.Reverse"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafEncode, () => Expression.wrapperEdition("String.Encode"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafDecode, () => Expression.wrapperEdition("String.Decode"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafToString, () => Expression.wrapperEdition("String.ToString"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafToText, () => Expression.wrapperEdition("String.ToText"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafToRegularExpression, () => Expression.wrapperEdition("String.ToRegularExpression"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafToPassword, () => Expression.wrapperEdition("String.ToPassword"));
	Formulae.addEdition(this.messages.pathString, null, this.messages.leafLog, () => Expression.wrapperEdition("String.Log"));
};

StringPackage.setActions = function() {
	Formulae.addAction("String.String",                   StringPackage.actionString);
	Formulae.addAction("String.String",                   StringPackage.actionString2Text);
	Formulae.addAction("String.Text",                     StringPackage.actionText);
	Formulae.addAction("String.Text",                     StringPackage.actionText2String);
	Formulae.addAction("String.RegularExpression",        StringPackage.actionRegularExpression);
};

