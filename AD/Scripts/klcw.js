// 获取并解析响应体
var obj;
try {
    obj = JSON.parse($response.body);
} catch (e) {
    $done({});
}

// 1. 处理 instance.data 列表（页面内容模块）
if (obj.instance && Array.isArray(obj.instance.data)) {
    var newData = [];
    obj.instance.data.forEach(function(item) {
        // 删除“爆屏广告”模块（widgets_title 包含“广告”）
        if (item.widgets_title && item.widgets_title.indexOf("广告") !== -1) {
            return; // 跳过此模块
        }
        // 如果存在 widgets_data_params，则解析并过滤其中的热点（hot_area）链接
        if (item.widgets_data_params) {
            try {
                var params = JSON.parse(item.widgets_data_params);
            } catch (err) {
                newData.push(item);
                return;
            }
            // 遍历每张图片的 hot_area，将 linktype=3 的产品链接移除
            if (Array.isArray(params.pictures)) {
                params.pictures.forEach(function(pic) {
                    if (Array.isArray(pic.hot_area)) {
                        pic.hot_area = pic.hot_area.filter(function(area) {
                            return area.linktype != 3;
                        });
                    }
                });
            }
            // 将处理后的 params 字段字符串化保存
            item.widgets_data_params = JSON.stringify(params);
        }
        newData.push(item);
    });
    obj.instance.data = newData;
}

// 2. 处理顶层 data 列表（广告组件等），直接清空列表以删除广告
if (Array.isArray(obj.data)) {
    obj.data = [];
}

// 返回修改后的 JSON 响应体
$done({body: JSON.stringify(obj)});
