#!/usr/bin/env node
"use strict";

const VC = require("../src/vc");
const Partner = require("../src/partner");

const krakatoa = new VC();
const classA = krakatoa.addClass("A");
const classB = krakatoa.addClass("B");
const classC = krakatoa.addClass("C");

// Classes are coupled to VCs, but Partners are not.
// The idea is to leave room for Partners potentially
// belonging to multiple VCs.
new Partner(
	"Becky",
	[
		{ classType: classB, units: 10 },
		{ classType: classC, units: 5 },
	],
	250
);
new Partner("Alex", [{ classType: classB, units: 10 }], 250);
new Partner("David", [{ classType: classA, units: 10 }]);

// First, proceeds are distributed exclusively amongst Class B unit
// holders in proportion to the number of units held, until the total
// amount distributed to each holder reaches their total amount invested.
const priorityRule = () => {
	return [classB].reduce((total, classType) => {
		let committedByHolder = 0;

		classType.holders.forEach((holder) => {
			committedByHolder += holder.committed || 0;
		});

		return total + committedByHolder;
	}, 0);
};

// Each category must have classes participating
// and a monetary cap. Once the cap is exceeded, distribution
// continues to next category
krakatoa.distributionOrder = [
	{
		classes: [classB],
		cap: priorityRule(), // 500 in this case
	},
	{
		classes: [classA, classB, classC],
		cap: Infinity,
	},
];

// function responsible for CLI interaction
(() => {
	const input = process.argv[2];
	const numberAmount = +input;

	if (!numberAmount || numberAmount <= 0) {
		console.log(
			"A numerical distribution amount (no commas) is required and must be greater than 0."
		);
		process.exit(1);
	}

	krakatoa.distribute(numberAmount);
	krakatoa.printPayout();

	process.exit(0);
})();
