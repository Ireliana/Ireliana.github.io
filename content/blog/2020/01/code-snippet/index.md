---
title: "常见的几种JS函数实现"
date: "2020-01-18"
description: ""
---

常见的函数实现：call、apply、bind、new、instanceof

### `Function.prototype.call`

* 调用者必须是函数
* 手动实现函数需绑定在函数原型上，让所有函数实例都能调用
* 调用时，需检查`this`是否是普通函数
* 对传入的上下文对象绑定一个`key`，值为当前`this`函数，调用完毕后需删除`key`，避免产生影响

```javascript
function fn(a) {
	console.log(this.a, a);
}

Function.prototype.myCall = function(context) {
	if (!(this instanceof Function)) {
		throw Error("myCall must be call by Function instance");
	}
	const _context = context || window;

	const _fn = Symbol();
	_context[_fn] = this;
	const params = [...arguments].slice(1);
	const result = _context[_fn](...params);
	delete _context[_fn];
	return result;
};

fn.myCall({ a: 1 }, "aa");
```

### `Function.prototype.apply`

* 大致与`call`相同
* 传入的第二个参数需要判断是否是数组或类数组对象，如果不是，则抛出错误；如果为空，则直接调用函数；类数组对象要转为数组

```javascript
Function.prototype.myApply = function(context) {
	if (!(this instanceof Function)) {
		throw Error("myApply must be call by Function instance");
	}
	const _context = context || window;
	const _fn = Symbol();
	_context[_fn] = this;
	let result;
	if (!arguments[1]) {
		result = _context[_fn]();
	}
	if (arguments[1] && !(arguments[1] instanceof Array)) {
		delete _context[_fn];
		throw Error("argument[1] must be Array");
	}
	if (typeof arguments[1] === "object" && arguments[1].length) {
		let paramsArr = Array.from(arguments[1]);
		result = _context[_fn](...paramsArr);
	}
	delete _context[_fn];
	return result;
};
```


### `Function.prototype.bind`

* 调用者必须是函数
* 调用自定义的`bind`后，返回一个函数，包含对原函数的引用
* 返回的函数，分为`new`调用和普通调用
* 普通调用可用`apply`绑定上下文，传递参数并调用原函数
* `new`调用时，原函数内的`this`绑定为返回的新对象，不再是参数中的上下文

```javascript
Function.prototype.myBind = function(context) {
	if (!(this instanceof Function)) {
		throw Error("myBind must be call by Function instance");
	}
	const _this = this;
	let args = [...arguments].slice(1);
	return function F() {
		// new调用
		if (this instanceof F) {
			return new _this(...args, ...arguments);
		}
		return _this.apply(context, args.concat(...arguments));
	};
};
```

### `new`

* 创建一个新对象
* 将新对象的 `__proto__` 属性设置为构造函数的 `prototype`
* 绑定构造函数中的`this`为新对象，并执行函数
* 如果构造函数返回值不是对象，则返回新对象（`new` 调用必须返回对象，即使是空对象）

```js
function create() {
    var obj = {};
    var fn = [].shift.call(arguments);
    obj.__proto__ = fn.prototype;
    var result = fn.apply(obj, arguments);
    return result instanceof Object ? result : obj;
}
```

### `instanceof`

* 判断方法是，一个函数的`prototype`是否出现在某个对象的原型链上

```js
function myInstanceOf(left, right) {
	var prototype = right.prototype;
	left = left.__proto__;
	while (true) {
        // 原型链终点为null
		if (left === null || left === undefined) {
			return false;
		}
		if (left === prototype) {
			return true;
		}
		left = left.__proto__;
	}
}
```