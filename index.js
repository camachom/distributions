"use strict";

class VC {
	constructor() {
		this.classes = [];
		this.distributionOrder = [];
	}

	addClass(type) {
		const newClass = new ClassType(type);
		this.classes.push(newClass);

		return newClass;
	}

	setDistributionOrder(order) {
		this.distributionOrder = order;
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

			const { cap, classes } = category;

			let categoryAmount;
			if (cap <= currentAmount) {
				categoryAmount = cap;
				currentAmount -= cap;
			} else {
				categoryAmount = currentAmount;
				currentAmount -= currentAmount;
			}

			console.log("categoryAmount", categoryAmount);

			let totalCategoryUnits = classes.reduce((total, classType) => {
				return total + classType.totalUnits;
			}, 0);

			for (const classType of classes) {
				const holders = classType.holders;

				for (const holder of holders) {
					const categoryUnits = holder.unitsByType(classType.type);

					const payout = categoryAmount * (categoryUnits / totalCategoryUnits);
					holder.payout += payout;
				}
			}
		}
	}
}

class Partner {
	constructor(name = "member", membership, amount = 0) {
		if (!membership) {
			throw new Error("Partners must belong to a class");
		}

		this.name = name;
		this.membership = membership;
		this.committed = amount;
		this.payout = 0;

		for (const { classType, units } of membership) {
			classType.holders.push(this);
			classType.totalUnits += units;
		}
	}

	unitsByType(type) {
		return this.membership.reduce((total, { classType, units }) => {
			if (classType.type === type) {
				total += units;
			}

			return total;
		}, 0);
	}
}

class ClassType {
	constructor(type) {
		this.type = type;
		this.holders = [];
		this.totalUnits = 0;
	}
}

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
		return (
			total +
			classType.holders.reduce((subtotal, holder) => {
				return subtotal + (holder.committed || 0);
			}, 0)
		);
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

krakatoa.distribute(1000);

console.log("a", a);
console.log("b", b);
console.log("d", d);
