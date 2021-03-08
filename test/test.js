#!/usr/bin/env node
"use strict";

const assert = require("assert");
const VC = require("../src/vc");
const Partner = require("../src/partner");

const roundDown = (num) => {
	return Math.floor(num * 100) / 100;
};

const testVC = () => {
	const krakatoa = new VC();
	const classA = krakatoa.addClass("A");
	const classB = krakatoa.addClass("B");
	const classC = krakatoa.addClass("C");

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

	const priorityRule = () => {
		return [classB].reduce((total, classType) => {
			let committedByHolder = 0;

			classType.holders.forEach((holder) => {
				committedByHolder += holder.committed || 0;
			});

			return total + committedByHolder;
		}, 0);
	};

	krakatoa.distributionOrder = [
		{
			classes: [classB],
			cap: priorityRule(),
		},
		{
			classes: [classA, classB, classC],
			cap: Infinity,
		},
	];

	return krakatoa;
};

const testVC1 = testVC();
testVC1.distribute(400);
testVC1.printPayout();

// // if distribution is less than 500, Class B should receive all payout
for (const classType of testVC1.classes) {
	if (classType.type !== "B") {
		assert.strictEqual(roundDown(classType.payout), 0);
	} else {
		assert.strictEqual(roundDown(classType.payout), 400);
	}
}

const testVC2 = testVC();
testVC2.distribute(1000);
testVC2.printPayout();

let totalDistributed = 0;
for (const classType of testVC2.classes) {
	totalDistributed += classType.payout;
	if (classType.type === "B") {
		assert.strictEqual(roundDown(classType.payout), 785.71);
	} else if (classType.type === "C") {
		assert.strictEqual(roundDown(classType.payout), 71.42);
	} else if (classType.type === "A") {
		assert.strictEqual(roundDown(classType.payout), 142.85);
	}
}

// Sum of all class payouts should equal distribution
assert.strictEqual(roundDown(totalDistributed), 1000);
