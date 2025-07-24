let pluginURL = decodeURIComponent($request.url.match(/plugin=(.+)/)[1]);
let fileName = pluginURL.split('/').pop().replace('.lpx', '');

// 正确分类名称 + 双重编码
let category = '世路如今已惯';
let encodedCategory = encodeURIComponent(encodeURIComponent(category));

// 构造无需整体 encode 的 finalURL（注意：此处不要再 encodeURIComponent）
let rawURL = `http://script.hub/file/_start_/${pluginURL}/_end_/${fileName}.sgmodule?type=loon-plugin&target=surge-module&del=true&jqEnabled=true&category=${encodedCategory}`;
let finalURL = `surge:///install-module?url=${encodeURIComponent(rawURL)}&name=`;

$done({
  status: 302,
  headers: {
    Location: finalURL
  }
});