// Script Name: taobaoAlimamaAds.js
let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data && obj.data.data && obj.data.data.items && Array.isArray(obj.data.data.items)) {
        // 清空广告项目数组
        obj.data.data.items = [];
    }
    $done({body: JSON.stringify(obj)});
} catch (e) {
    console.log("Error processing taobaoAlimamaAds.js: " + e); // 关键的错误日志
    $done({body}); // 如果解析或处理失败，返回原始响应体
}
