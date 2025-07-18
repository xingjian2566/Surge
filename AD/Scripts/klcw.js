let body = JSON.parse($response.body);

// 过滤掉含有广告字段的元素
if (Array.isArray(body.data)) {
  body.data = body.data.filter(item => {
    return !Object.keys(item).some(key => key.includes('advertisement') || key.includes('widgets'));
  });
} else if (typeof body.data === 'object' && body.data !== null) {
  if (body.data.edition_code || body.data.widgets_title) {
    body.data = {};
  }
}

$done({ body: JSON.stringify(body) });

// 精准删除 instance.data 中 navs 内的特定广告项
let obj = JSON.parse($response.body);

if (obj.instance?.data && Array.isArray(obj.instance.data)) {
  for (let widget of obj.instance.data) {
    if (widget.widgets_data_params) {
      try {
        const params = JSON.parse(widget.widgets_data_params);

        // 仅处理含有 navs 的模块
        if (Array.isArray(params.navs)) {
          params.navs = params.navs.filter(nav => {
            const name = nav.nav_name || "";
            const title = nav.nav_title || "";

            const blockList = [
              { name: "盲盒新品速递", title: "收藏家必冲" },
              { name: "新品热销榜",   title: "潮流玩具" },
              { name: "日杂文创",     title: "送礼优选" },
              { name: "二次元周边",   title: "热门IP狂轰滥炸" }
            ];

            return !blockList.some(b => b.name === name && b.title === title);
          });

          widget.widgets_data_params = JSON.stringify(params);
        }
      } catch (e) {
        // JSON parse failed，忽略
      }
    }
  }
}

$done({ body: JSON.stringify(obj) });

// WebView 的拦截逻辑
if (request.url.includes("https://klwg.klcw.net.cn/r")) {
  const json = JSON.parse(responseBody);

  // 过滤掉广告组件
  json.instance.data = json.instance.data.filter(widget => {
    const title = widget.widgets_title;
    const params = widget.widgets_data_params || "";
    if ((title === "轮播图" || title === "拼图") && params.includes(".gif")) return false;
    if (title === "吸底瀑布流" && params.includes("navs")) return false;
    return true;
  });

  // 重新构建 response 体
  return newResponse(JSON.stringify(json));
}

// 通用过滤广告函数
function filterAdResponse(url, body) {
  let json;
  try {
    json = JSON.parse(body);
  } catch (e) {
    return body; // 不是JSON，跳过
  }

  // 处理接口1：widgets广告
  if (url.includes("klwg.klcw.net.cn/r")) {
    if (json.instance && Array.isArray(json.instance.data)) {
      json.instance.data = json.instance.data.filter(widget => {
        const title = widget.widgets_title;
        const params = widget.widgets_data_params || "";
        if ((title === "轮播图" || title === "拼图") && params.includes(".gif")) return false;
        if (title === "吸底瀑布流" && params.includes("navs")) return false;
        return true;
      });
    }
  }

  // 处理接口2：首页弹窗广告
  else if (Array.isArray(json.data)) {
    json.data = json.data.filter(item => {
      const name = item.advertisement_name || "";
      const detailList = item.detail_list || [];
      const hasGif = detailList.some(d => (d.advertisement_detail_img_url || "").includes(".gif"));
      return !(name.includes("首页弹窗") || hasGif);
    });
  }

  return JSON.stringify(json);
}