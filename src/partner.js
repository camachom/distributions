"use strict";

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
			classType.holders.add(this);
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

module.exports = Partner;
