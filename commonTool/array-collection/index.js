function ArrayCollection(arr) {
	var result;
	result = (arr && arr.length >= 0) ? arr : arguments;
	this.resetSource(result);
}

ArrayCollection.prototype = Object.create(Array.prototype , {
	removeAt: {
		enumerable: true,
		value: function(index) {
			if (index < 0) return this;
			return this.splice(index, 1)[0];
		}
	},
	removeAll: {
		enumerable: true,
		value: function () {
			this.length = 0;
			return this;
		}
	},
	sort: {
		enumerable: true,
		value: function(field, order) {
			if (!order) order = 'asc';
			order = order.toLowerCase() == 'asc' ? 1 : -1;
			Array.prototype.sort.call(this, function(p, n) {
				if (p[field] > n[field]) return 1 * order;
				if (p[field] < n[field]) return -1 * order;
				return 0;
			});
			return this;
		}
	},
	indexOf: {
		enumerable: true,
		value: function (key, field) {
			if (!field) return Array.prototype.indexOf.call(this, key);
			for (var i = 0; i < this.length; i++) {
				if (key == this[i][field]) return i;
			}
			return -1;
		}
	},
	getItem: {
		enumerable: true,
		value: function (key, field) {
			var index = ArrayCollection.prototype.indexOf.call(this, key, field);
			if (index == -1) return null;
			return this[index];
		}
	},
	removeItem: {
		enumerable: true,
		value: function (key, field) {
			var index = ArrayCollection.prototype.indexOf.call(this, key, field);
			if (index == -1) return null;
			return ArrayCollection.prototype.removeAt.call(this, index);
		}
	},
	resetSource: {
		enumerable: true,
		value: function (array) {
			ArrayCollection.prototype.removeAll.call(this);
			if (array && array.length) {
				for (var i = 0; i < array.length; i++) {
					if (array[i] == null || array[i] == undefined) continue;
					this.push(array[i]);
				}
			}
			return this;
		}
	},
	pushTo: {
		enumerable: true,
		value: function (key, index) {
			if (typeof(index) != "number" || index >= this.length) {
				this.push(key);
				return this;
			}

			var firstArray = this.slice(0, ++index);
			var lastArray = this.slice(index);
			firstArray.push(key);

			var resultArray = firstArray.concat(lastArray);
			ArrayCollection.prototype.resetSource.call(this, resultArray);
			return this;
		}
	}
});

ArrayCollection.prototype.constructor = Array;
$.extend(ArrayCollection, ArrayCollection.prototype);
module.exports = ArrayCollection;