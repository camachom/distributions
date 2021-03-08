"use strict";

const ClassType = require("./classType.js");

class VC {
	constructor() {
		this.classes = new Set();
		this.distributionOrder = [];
		this.distributionAmount = 0;
	}

	addClass(type) {
		const newClass = new ClassType(type);
		this.classes.add(newClass);

		return newClass;
	}

	payOutByCategory({ classes }, categoryCap) {
		let totalCategoryUnits = classes.reduce((total, classType) => {
			return total + classType.totalUnits;
		}, 0);

		for (const classType of classes) {
			const holders = classType.holders;

			for (const holder of holders) {
				const categoryUnits = holder.unitsByType(classType.type);
				const payout = categoryCap * (categoryUnits / totalCategoryUnits);
				/* 
				Here's a sample payout:
					categoryCap = 500
					totalCategoryUnits = 20
					Holder (Becky) has 10 categoryUnits

					Becky's payout is 500*(10/20) = 250;
				*/

				holder.payout += payout;
				classType.payout += payout;
			}
		}
	}

	distribute(amount) {
		if (this.distributionOrder.length === 0) {
			throw new Error("No distribution rules implemented.");
		}

		this.distributionAmount = amount;
		let currentAmount = amount;
		for (const category of this.distributionOrder) {
			/* 
				Here is a sample distribution order:
				[
					{
						classes: [classB],
						cap: 500,
					},
					{
						classes: [classA, classB, classC],
						cap: Infinity,
					},
				];
			*/

			if (currentAmount <= 0) {
				break;
			}

			const { cap } = category;
			const categoryCap = cap <= currentAmount ? cap : currentAmount;
			currentAmount -= categoryCap;

			this.payOutByCategory(category, categoryCap);
		}
	}

	roundDown(num) {
		return Math.floor(num * 100) / 100;
	}

	printPayout() {
		const classOutput = {};
		this.classes.forEach((classType) => {
			classOutput[classType.type] = this.roundDown(classType.payout);
		});

		const partnerOutput = {};
		this.classes.forEach((classType) => {
			classType.holders.forEach((holder) => {
				if (!partnerOutput[holder.name]) {
					partnerOutput[holder.name] = this.roundDown(holder.payout);
				}
			});
		});

		console.log(
			JSON.stringify({
				distributionPerClass: {
					...classOutput,
				},
				distributionPerPartner: {
					...partnerOutput,
				},
			})
		);
	}
}

module.exports = VC;
