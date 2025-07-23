// 提取 plugin URL
let pluginURL = decodeURIComponent($request.url.match(/plugin=(.+)/)[1]);

// 提取文件名（不含扩展名）
let fileName = pluginURL.split('/').pop().replace('.lpx', '');

// 设置分类（可修改）
let category = '世路如今已惯';

// 编码分类（两次）
let encodedCategory = encodeURIComponent(encodeURIComponent(category));

// 构造 URL
let rawURL = `http://script.hub/file/_start_/${pluginURL}/_end_/${fileName}.sgmodule?type=loon-plugin&target=surge-module&del=true&jqEnabled=true&category=${encodedCategory}`;

// 编码整个 URL
let encoded = encodeURIComponent(rawURL);

// 构造最终跳转链接
let finalURL = `surge:///install-module?url=${encoded}&name=`;

$done({
  status: 302,
  headers: {
    Location: finalURL
  }
});