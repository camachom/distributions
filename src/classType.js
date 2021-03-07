"use strict";

class ClassType {
	constructor(type) {
		this.type = type;
		this.holders = new Set();
		this.payout = 0;
		this.totalUnits = 0;
	}
}

module.exports = ClassType;
