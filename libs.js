// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
Array.prototype.sortBy = function(id) {
    return this.sort((a,b)=>a.id-b.id);
}

// https://stackoverflow.com/questions/8864430/compare-javascript-array-of-objects-to-get-min-max
Array.prototype.hasMin = function(attrib) {
    return this.reduce(function(prev, curr){ 
        return prev[attrib] < curr[attrib] ? prev : curr; 
    });
}
Array.prototype.hasMax = function(attrib) {
    return this.reduce(function(prev, curr){ 
        return prev[attrib] > curr[attrib] ? prev : curr; 
    });
}

// https://www.geeksforgeeks.org/check-if-array-elements-are-consecutive/
Array.prototype.isDense = function(id, diff) {
    var max = this.hasMax(id);
    var min = this.hasMin(id);
    if (max[id] - min[id] == (this.length - 1) * diff){
        var visitList = new Array(this.length).fill(false);
        for (var i=0; i<this.length; i++){
            if (visitList[(this[i][id]-min[id])/diff]) {
                return false;
            }
            visitList[(this[i][id]-min[id])/diff] = true;
        };
        return true;
    } else {
        return false;
    }
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
Array.prototype.makeUniq = function(id) {
    var seen = {};
    return this.filter(function(item){
        var k = id(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
