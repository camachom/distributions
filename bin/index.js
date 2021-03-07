#!/usr/bin/env node
"use strict";

const readline = require("readline");
const VC = require("../src/vc");
const Partner = require("../src/partner");

const krakatoa = new VC();
const classA = krakatoa.addClass("A");
const classB = krakatoa.addClass("B");
const classC = krakatoa.addClass("C");

const b = new Partner(
	"Becky",
	[
		{ classType: classB, units: 10 },
		{ classType: classC, units: 5 },
	],
	250
);
const a = new Partner("Alex", [{ classType: classB, units: 10 }], 250);
const d = new Partner("David", [{ classType: classA, units: 10 }]);

const priorityRule = () => {
	return [classB].reduce((total, classType) => {
		let committedByHolder = 0;

		classType.holders.forEach((holder) => {
			committedByHolder += holder.committed || 0;
		});

		return total + committedByHolder;
	}, 0);
};

krakatoa.setDistributionOrder([
	{
		classes: [classB],
		cap: priorityRule(),
	},
	{
		classes: [classA, classB, classC],
		cap: Infinity,
	},
]);

const getAmount = (query) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close();
			resolve(ans);
		})
	);
};

const start = async () => {
	const input = await getAmount("How much to distribute? ");
	const numberAmount = +input;

	if (!numberAmount || numberAmount <= 0) {
		console.log(
			"A numerical distribution amount is required and must be greater than 0."
		);
		process.exit(1);
	}

	krakatoa.distribute(numberAmount);

	console.log(krakatoa.classes);
	process.exit(0);
};

start();
