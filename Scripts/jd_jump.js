// 通用单跳短链处理
let url = $request.url;
let match = url.match(/^https:\/\/([^/]+)\/([A-Za-z0-9_-]+)/);
let host = match[1];
let code = match[2];

let scheme = '';

if (host === 'u.jd.com') {
  // 京东
  let payload = {
    category: "jump",
    des: "m",
    sourceValue: "babel-act",
    sourceType: "babel",
    url: `https://u.jd.com/${code}`,
    M_sourceFrom: "h5auto",
    msf_type: "auto"
  };
  let encoded = encodeURIComponent(JSON.stringify(payload));
  scheme = `openApp.jdMobile://virtual?params=${encoded}`;
} else if (host === 'b23.tv') {
  // B站
  scheme = `bilibili://video/${code}`;
}

if (!scheme) {
  $done({});
}

let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>正在打开应用</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
setTimeout(function(){
  location.href = "${scheme}";
}, 200);
</script>
</head>
<body>
<p style="text-align:center;margin-top:50px;">正在打开应用，请稍候...</p>
</body>
</html>
`;

$done({
  response: {
    status: 200,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
    body: html
  }
});