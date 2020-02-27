---
title: "常见的JS排序算法"
date: "2020-02-27"
description: "算法时间和空间复杂度与常见排序算法"
---

在讨论排序算法前，先来了解下如何衡量不同算法的优劣。算法是用来操作数据的，同一个问题，使用不同算法也许得到结果一样，但是运算过程耗费的时间和空间却不一样。因此可以从算法消耗的**时间**和**空间**两个纬度考量。

时间维度：指执行算法所消耗的时间，通常用**时间复杂度**来描述

空间纬度：指执行算法所占用的内存空间，通常用**空间复杂度**来描述

衡量一个算法的效率主要看它的时间复杂度和空间复杂度，有时候这两个纬度是不能同时兼得的。在考虑算法实现时，需要从实际应用出发，找到两个纬度之间的平衡点。

### 时间复杂度

想知道一个算法运行消耗时间，简单的方法是拿到运行前后时间差值。但是这种方法会受到运行环境影响，比如测试数据规模、性能高的机器也会比性能低的要快。因此我们需要一种更通用的方式来描述复杂度，这个就是**大 O 表示法**，时间复杂度即为 `T(n) = O(f(n))`，其中`f(n)`表示每行代码执行次数之和，而`O`表示正比例关系，这个公式的全称是：**算法的渐进时间复杂度**。

举个 🌰：

```js
for (let i = 0; i < n; i++) {
	let j = i;
	j++;
}
```

假设每行代码的执行时间都是一样的，我们用**1 单位时间**来表示，那么的第一行耗时是`1个单位时间`，第二行的执行时间是`n个单位时间`，第三行执行时间也是`n个单位时间`，那么总时间就是 `1单位时间 + n单位时间 + n单位时间` ，即`(1+2n)个单位时间`，即：`T(n)=(1+2n)*单位时间`。

由此可见时间复杂度是正比于数据`n`的。注意**大 O 表示法并不是用来真实代表算法的执行时间的，它是用来表示代码执行时间的增长变化趋势的**，当`n`接近无穷大时，`T(n)=(1+2n)`中常量`1`和倍数`2`可以意义不大，因此可以简化为`T(n)=O(n)`。

常见的时间复杂度：

-   常数阶 O(1)
    ```js
    let i = 1;
    let j = 2;
    ++i;
    j++;
    let m = i + j;
    ```
    这段代码执行时消耗并不随着某个变量的增长而增长，那么无论这类代码有多长，都可以用 O(1)来表示它的时间复杂度
-   线性阶 O(n)

    ```js
    for (let i = 0; i < n; i++) {
    	let j = i;
    	j++;
    }
    ```

    `for`循环里面的代码执行次数取决于`n`的大小

-   平方阶 O(n²)
    ```js
    for (let i = 0; i < n; i++) {
    	for (let j = 0; j < n; j++) {
    		//...
    	}
    }
    ```
    熟悉的两层循环，相当于`n*O(n)`，即`T(n)=O(n²)`，立方阶`O(n³)`和 K 次方阶`O(n^k)`同理
-   立方阶 O(n³)
-   K 次方阶 O(n^k)
-   对数阶 O(logN)
    ```js
    let i = 1;
    while (i < n) {
    	i = i * 2;
    }
    ```
    `while`循环中，每执行一次，`i`值乘以`2`。假设循环`x`次之后，`i>n`成立，此时循环退出，也就是说`2^x=n`，那么`x=log2^n`。因此这段代码时间复杂度是`o(log2^n)`。
-   线性对数阶 O(nlogN)

    ```js
    for (let j = 0; j < n; j++) {
    	let i = 1;
    	while (i < n) {
    		i = i * 2;
    	}
    }
    ```

    理解了`O(logN)`，那么`O(nlogN)`相当于将时间复杂度为`O(logN)`的代码循环执行了`n`遍

-   指数阶(2^n)

### 空间复杂度

既然时间复杂度不是用来计算程序具体耗时的，那么空间复杂度也不是用来计算程序实际占用的空间的。**空间复杂度是对算法在运行过程中临时占用存储空间大小的一个量度，同样反映的是一个趋势**，通常用`S(n)`来定义。

常见的空间复杂度：

-   O(1)
    ```js
    let i = 1;
    let j = 2;
    ++i;
    j++;
    let m = i + j;
    ```
    代码中变量`i`、`j`、`m`所分配的内存空间不随输入数据的变化。
-   O(n)
    ```js
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
    	console.log(i);
    }
    ```
    代码中通过`Array`构造函数，创建了长度为`n`的数组，这个数组占用空间大小为`n`，因此`S(n)=O(n)`。
-   O(n²)

### 几种常见的排序算法

先定义一个交换函数`swap`。

```js
/**
 * @desc 用于交换数组的两个索引值
 * @param {Array} array
 * @param {number} left
 * @param {number} right
 */
function swap(array, left, right) {
	let rightVal = array[right];
	array[right] = array[left];
	array[left] = rightVal;
}
```

-   冒泡排序，`T(n)=O(n²)`

    从第一个元素开始，把当前元素和下一个元素进行比较。如果当前元素大，就交换位置，重复操作直到比较到最后一个元素，此时最后一个元素就是该数组中最大的数。

        ```js
        function bubble(array) {
        	for (let i = 0; i < array.length - 1; i++) {
        		for (let j = 0; j < array.length - 1 - i; j++) {
        			if (array[j] > array[j + 1]) {
        				swap(array, j, j + 1);
        			}
        		}
        	}
        	return array;
        }
        ```

-   插入排序，`T(n)=O(n²)`
  
    默认第一个元素是最小值，从第二个数开始，如果比前一个数小就交换位置，这样前两个数就排序完成。下次比较从第三个数开始，与前两个数比较，直至比较完所有的数。

    ```js
    function insertSort(array) {
    	for (let i = 1; i < array.length; i++) {
    		for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--) {
    			swap(array, j, j + 1);
    		}
    	}
    	return array;
    }
    ```

-   选择排序，`T(n)=O(n²)`

    默认第一个是最小的元素，从第二个元素开始遍历数组，如果当前元素比默认元素小就替换最小值索引，遍历完成后交换元素值。

    ```js
    function selectSort(array) {
    	for (let i = 0; i < array.length - 1; i++) {
    		let minIndex = i;
    		for (let j = i + 1; j < array.length; j++) {
    			if (array[minIndex] > array[j]) {
    				minIndex = j;
    			}
    		}
    		swap(array, i, minIndex);
    	}
    	return array;
    }
    ```

-   快速排序，`T(n)=O(nlog2^n)`

    将数组中间值取出后遍历数组，将数组元素与中间值比较，小于中间值放置在一个数组，大于中间值放置在另一个数组。然后递归操作这两个数组，直至数组中剩下一个元素。最后将这些排序后的小数组进行合并。

    ```js
    function quickSort(array) {
    	if (array.length <= 1) {
    		return array;
    	}
    	let left = [];
    	let right = [];
    	let target = array.splice(Math.floor(array.length / 2), 1)[0];
    	for (let i = 0; i < array.length; i++) {
    		if (array[i] <= target) {
    			left.push(array[i]);
    		} else {
    			right.push(array[i]);
    		}
    	}
    	return quickSort(left).concat([target], quickSort(right));
    }
    ```

-   归并排序，`T(n)=O(nlog2^n)`

    将数组两两分开，直至剩下只有一个元素的子数组，然后按照划分位置，让数组中的元素与相邻数组进行两两比较，得到完成排序的子数组。最后递归比较子数组，直至得到一个完整的序列。

    ```js
    function mergeSort(array) {
    	function merge(left, right) {
    		const result = [];
    		let i = (j = 0);
    		while (i < left.length && j < right.length) {
    			if (left[i] < right[j]) {
    				result.push(left[i]);
    				i++;
    			} else {
    				result.push(right[j]);
    				j++;
    			}
    		}
    		while (i < left.length) {
    			result.push(left[i]);
    			i++;
    		}
    		while (j < right.length) {
    			result.push(right[j]);
    			j++;
    		}
    		return result;
    	}
    	if (array.length <= 1) {
    		return array;
    	}
    	let mid = Math.floor(array.length / 2);
    	let left = array.slice(0, mid);
    	let right = array.slice(mid, array.length);
    	return merge(mergeSort(left), mergeSort(right));
    }
    ```
