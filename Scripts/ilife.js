let obj = JSON.parse($response.body);

// 移除广告数组
if (obj?.data?.ads) {
  obj.data.ads = [];
}

// 设置 adShow 为 0，彻底关闭广告显示逻辑
if (obj?.data?.account?.adShow !== undefined) {
  obj.data.account.adShow = 0;
}

$done({ body: JSON.stringify(obj) });