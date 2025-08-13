// 通用短链唤起脚本（微信/QQ兼容版）
// 维护 mapping 表即可扩展新服务

let url = $request.url;
let match = url.match(/^https:\/\/([^/]+)\/([A-Za-z0-9_-]+)/);
if (!match) $done({});

let host = match[1];
let code = match[2];
let scheme = '';

// 这里添加各服务的解析逻辑
switch (host) {
  case 'u.jd.com':
    let jdPayload = {
      category: "jump",
      des: "m",
      sourceValue: "babel-act",
      sourceType: "babel",
      url: `https://u.jd.com/${code}`,
      M_sourceFrom: "h5auto",
      msf_type: "auto"
    };
    scheme = `openApp.jdMobile://virtual?params=${encodeURIComponent(JSON.stringify(jdPayload))}`;
    break;

  case 'b23.tv':
    scheme = `bilibili://video/${code}`;
    break;

  case 'm.tb.cn':
    scheme = `taobao://${code}`; // 实际淘宝口令需更复杂解析，可后续完善
    break;

  case 'p.pinduoduo.com':
    scheme = `pinduoduo://com.xunmeng.pinduoduo/PDJump?target=${code}`;
    break;

  default:
    $done({});
}

// 生成 HTML（微信/QQ 兼容）
let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>正在打开应用</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
function openApp() {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = "${scheme}";
  document.body.appendChild(iframe);

  setTimeout(function(){
    // 如果没唤起，提示用户
    alert("如果没有自动跳转，请点击右上角选择“在浏览器中打开”");
  }, 1500);
}
window.onload = openApp;
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