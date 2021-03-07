"use strict";

const ClassType = require("./classType.js");

class VC {
	constructor() {
		this.classes = new Set();
		this.distributionOrder = [];
	}

	addClass(type) {
		const newClass = new ClassType(type);
		this.classes.add(newClass);

		return newClass;
	}

	setDistributionOrder(order) {
		this.distributionOrder = order;
	}

	payOutByCategory({ classes }, categoryAmount) {
		let totalCategoryUnits = classes.reduce((total, classType) => {
			return total + classType.totalUnits;
		}, 0);

		for (const classType of classes) {
			const holders = classType.holders;

			for (const holder of holders) {
				const categoryUnits = holder.unitsByType(classType.type);

				const payout = categoryAmount * (categoryUnits / totalCategoryUnits);
				const roundedPayout = Math.floor(payout * 100) / 100;

				holder.payout += roundedPayout;
				classType.payout += roundedPayout;
			}
		}
	}

	distribute(amount) {
		if (this.distributionOrder.length === 0) {
			throw new Error("No distribution rules implemented.");
		}

		let currentAmount = amount;
		for (const category of this.distributionOrder) {
			if (currentAmount <= 0) {
				break;
			}

			const { cap } = category;
			const categoryAmount = cap <= currentAmount ? cap : currentAmount;
			currentAmount -= categoryAmount;

			this.payOutByCategory(category, categoryAmount);
		}
	}
}

module.exports = VC;
