// Script Name: taobaoAlimamaAds.js
let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data && obj.data.data && obj.data.data.items && Array.isArray(obj.data.data.items)) {
        // Assuming all items from this specific API endpoint are ads
        obj.data.data.items = [];
        // You could also add more specific filtering here if needed, e.g.:
        // obj.data.data.items = obj.data.data.items.filter(item => !(item.material && item.material.ifsurl && item.material.ifsurl.includes("tanx.com")));
    }
    $done({body: JSON.stringify(obj)});
} catch (e) {
    // Log error for debugging, but return original body to avoid breaking app if script fails
    console.log("Error processing taobaoAlimamaAds.js: " + e);
    $done({body});
}
