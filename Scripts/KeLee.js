// KeLee.js
let pluginURL = $request.url.match(/plugin=(.+)/)[1];
let fileName = pluginURL.split('/').pop().replace('.lpx', '');
let category = "世路如今已惯";

let rawURL = http://script.hub/file/_start_/${pluginURL}/_end_/${fileName}.sgmodule +
             ?type=loon-plugin&target=surge-module&del=true&jqEnabled=true +
             &category=${category};

let finalURL = 'surge:///install-module?url=' + encodeURIComponent(rawURL) + '&name=';

$done({
  response: {
    status: 302,
    headers: { Location: finalURL }
  }
});