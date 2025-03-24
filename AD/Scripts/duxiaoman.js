let body = $response.body;
let json = JSON.parse(body);

// 需要屏蔽的广告关键词
const adKeywords = [
    "掼蛋",
    "AI教你低成本赚钱",
    "信贷转化",
    "借记卡交易奖励补贴",
    "mgm返佣活动"
];

// 过滤 `items_list` 中的广告项
json.items_list.forEach(card => {
    if (card.items_list) {
        card.items_list = card.items_list.filter(item => {
            return !adKeywords.some(keyword => item.title.includes(keyword));
        });
    }
});

// 如果某个 `card` 的 `items_list` 变空了，就删除整个 `card`
json.items_list = json.items_list.filter(card => card.items_list.length > 0);

// 删除 `ext_data` 里的 AI 相关广告
if (json.ext_data) {
    delete json.ext_data.aiChat;
}

// 删除 `showFeatureGuide`
delete json.showFeatureGuide;

$done({ body: JSON.stringify(json) });