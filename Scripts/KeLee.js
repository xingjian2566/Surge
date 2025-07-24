let pluginURL = decodeURIComponent($request.url.match(/plugin=(.+)/)[1]);
let fileName = pluginURL.split('/').pop().replace('.lpx', '');
let category = '世路如今已惯';
let encodedCategory = encodeURIComponent(encodeURIComponent(category));

let rawURL = `http://script.hub/file/_start_/${pluginURL}/_end_/${fileName}.sgmodule?type=loon-plugin&target=surge-module&del=true&jqEnabled=true&category=${encodedCategory}`;
let encoded = encodeURIComponent(rawURL);
let finalURL = `surge:///install-module?url=${encoded}&name=`;

$done({
  status: 302,
  headers: {
    Location: finalURL
  }
});