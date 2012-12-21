/*
 * Class powers the OOP facilities of the library. Thanks to John Resig and Dean Edwards for inspiration!
 */
W.Class = function() {}; 

W.Class.extend = function(/*Object*/ props) /*-> Class*/ {

	// extended class with the new prototype
	var NewClass = function() {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function() {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i != 'prototype' && i != 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		W.Utils.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		W.Utils.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = W.Utils.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	W.Utils.extend(proto, props);

	// allow inheriting further
	NewClass.extend = arguments.callee;

	// method for adding properties to prototype
	NewClass.include = function(props) {
		W.Utils.extend(this.prototype, props);
	};

	return NewClass;
};
