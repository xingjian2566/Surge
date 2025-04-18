// Surge Script (type=http-response, requires-body=true)

let obj = JSON.parse($response.body);

// 淘宝联盟广告流：清空 items、关闭分页
if (obj?.data?.data?.items) {
  obj.data.data.items = [];
}
if (obj?.data?.data?.hasMore !== undefined) {
  obj.data.data.hasMore = false;
}
if (obj?.data?.data?.page !== undefined) {
  obj.data.data.page = 1;
}

// 拦空推荐流数据（适用于某些 result 结构）
if (obj?.result && Array.isArray(obj.result)) {
  obj.result = [];
}

// 清空广告数组
if (obj?.data?.ads) {
  obj.data.ads = [];
}

// 设置 adShow 为 0，彻底关闭广告显示逻辑
if (obj?.data?.account?.adShow !== undefined) {
  obj.data.account.adShow = 0;
}

$done({ body: JSON.stringify(obj) });