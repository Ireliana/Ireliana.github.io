---
title: "基于TinyPNG的图片压缩工具"
date: "2020-02-15"
description: ""
---

图片压缩是一种常见的前端性能优化方式，它可以减少图片大小，或者通过 Webpack 等工具转化为 Base64 编码，从而减少资源加载时间，节省网络流量，页面响应更加快速。

在线图片压缩工具有很多，例如[智图](https://zhitu.isux.us/)、[TinyPNG](https://tinypng.com/)。个人比较常用  TinyPNG，鉴于在线压缩过于繁琐（先上传图片，压缩完后再下载，上传数量也有限制），同时借助于 TinyPNG 提供的 [Node.js 接口](https://tinypng.com/developers/reference/nodejs)，可以通过脚本上传图片进行压缩。

在调用 Node.js 接口之前，需要先申请 [API Key](https://tinypng.com/developers)，用于 TinyPNG 接口验证，每个 Key可用次数为 500张/月，如果觉得不够用，可用购买套餐，不过一般是足够的，实在不够可以多申请几个 API Key。除了图片压缩外，TingPNG还提供了图片裁切、压缩时元信息保留以及图片存储等功能。

下面就是通过 Node.js 读取本地图片上传到TinyPNG的代码：

```js
const path = require("path");
const fs = require("fs");
const tinify = require("tinify");
const Ora = require("ora");

// 填写 tinypng官网注册的 key
tinify.key = "";

const keySpinner = new Ora("Key校验中");

keySpinner.start();

// 校验 Key
tinify
	.validate()
	.then(() => {
		keySpinner.succeed("Key认证成功！");

		//默认每月可压缩图片数为500
		const totalCount = 500;

		// 需要压缩的图片数组
		const imgArray = [];

		// 图片所在目录,默认为img
		const imgdir = "./img";

		// 当前压缩进度
		let step = 0;

		const stepSpinner = new Ora("");

		let restCount = totalCount - tinify.compressionCount;
		if (restCount <= 0) {
			stepSpinner.fail("当前Key压缩次数已用完，请更换Key！");
			return;
		}

		stepSpinner.text = "正在检测png图";
        stepSpinner.start();
		mapDirName(imgdir);

		if (restCount < imgdir.length) {
			stepSpinner.fail("当前Key可用次数不足，请更换Key！");
			return;
		}
		imgArray.map(img => compressImg(img));

        // 收集图片
		function mapDirName(dirName) {
			let reg = /.*\/(.*)\.png$/;
			const imgFiles = fs.readdirSync(path.resolve(__dirname, dirName));
			if (!imgFiles || imgFiles.length === 0) {
				return;
			}
			for (let i = 0; i < imgFiles.length; i++) {
				let name = `${dirName}/${imgFiles[i]}`;
				let stats = fs.statSync(name);
				if (stats.isDirectory()) {
					mapDirName(name, imgArray);
				} else if (reg.exec(name)) {
					imgArray.push(name);
				}
			}
		}

        // 单张图片压缩
		function compressImg(img) {
			let source = tinify.fromFile(img);
			return source
				.toFile(img)
				.then(() => {
					step++;
					let currStep = Math.floor((step / imgArray.length) * 100);
					stepSpinner.text = `正在压缩，当前进度为：${currStep}%`;
					if (currStep === 100) {
						stepSpinner.succeed(
							`压缩完成，剩余可用次数为${totalCount -
								tinify.compressionCount}`
						);
					}
				})
				.catch(err => {
					if (err instanceof tinify.AccountError) {
						stepSpinner.fail(
							`当前Key的剩余次数不足：${err.message}`
						);
					} else if (err instanceof tinify.ClientError) {
						stepSpinner.fail("客户端发生错误，请稍后重试！");
					} else if (err instanceof tinify.ServerError) {
						stepSpinner.fail("服务端发生错误，请稍后重试！");
					} else if (err instanceof tinify.ConnectionError) {
						stepSpinner.fail("连接失败，请稍后重试！");
					} else {
						stepSpinner.fail("发生未知错误！");
					}
				});
		}
	})
	.catch(error => {
		keySpinner.fail(`未知错误：${error}`);
	});
```

代码比较简单，主要是通过 `fs` 和 `path` 模块读取一个指定目录下的文件，这里只对 <b>png</b>  图压缩，<b>jpg</b> 图一般会看情景决定压缩质量。在收集完图片后，会遍历上传，同时通过 `ora` 这个模块，在终端中显示压缩进度和错误提醒等信息。

正在压缩，显示进度：
![压缩中...](./loading.jpg)

压缩完成，显示剩余次数：
![压缩完成](./done.jpg)