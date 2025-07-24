let pluginURL = decodeURIComponent($request.url.match(/plugin=(.+)/)[1]);
let fileName = pluginURL.split('/').pop().replace('.lpx', '');

// 手动双重编码确认
let encodedCategory = "%25E4%25B8%2596%25E8%25B7%25AF%25E5%25A6%2582%25E4%25BB%258A%25E5%25B7%25B2%25E6%2583%25AF";

let rawURL = `http://script.hub/file/_start_/${pluginURL}/_end_/${fileName}.sgmodule?type=loon-plugin&target=surge-module&del=true&jqEnabled=true&category=${encodedCategory}`;

let encoded = encodeURIComponent(rawURL);
let finalURL = `surge:///install-module?url=${encoded}&name=`;

// 重定向
$done({
  status: 302,
  headers: { Location: finalURL }
});