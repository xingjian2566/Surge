// Surge Script (type=http-response, requires-body=true)

let obj = JSON.parse($response.body);

// 拦空推荐流数据（如果 result 存在且是数组）
if (obj?.result && Array.isArray(obj.result)) {
  obj.result = [];
}

// 移除广告数组
if (obj?.data?.ads) {
  obj.data.ads = [];
}

// 设置 adShow 为 0，彻底关闭广告显示逻辑
if (obj?.data?.account?.adShow !== undefined) {
  obj.data.account.adShow = 0;
}

$done({ body: JSON.stringify(obj) });