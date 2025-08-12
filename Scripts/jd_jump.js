// Surge 脚本：全局拦截 https://u.jd.com/xxx 并跳转京东 App
let match = $request.url.match(/^https:\/\/u\.jd\.com\/([A-Za-z0-9_-]+)/);
if (match) {
  let code = match[1];
  
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
  let redirectUrl = `openApp.jdMobile://virtual?params=${encoded}`;
  
  // 输出 302 重定向，保证 App 内外都能直接跳
  $done({
    response: {
      status: 302,
      headers: {
        Location: redirectUrl
      }
    }
  });
} else {
  $done({});
}