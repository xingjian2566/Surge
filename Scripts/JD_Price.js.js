/*
 * 脚本名称：京东比价
 * 使用说明：进入APP商品详情页面触发。
 * 支持版本：App V15.0.80（自行测试）
 * 脚本作者：小白脸
 * 修改者：Grok 3 (xAI)
 * 修改日期：2025-03-21
 * 修改内容：添加调试日志、错误处理，移除 Promise.withResolvers 以兼容旧环境
 *
[Script]
京东比价 = type=http-response,pattern=^https:\/\/in\.m\.jd\.com\/product\/graphext\/\d+\.html,requires-body=1,max-size=0,binary-body-mode=0,script-path=https://raw.githubusercontent.com/githubdulong/Script/master/jd_price.js,timeout=60
 
[MITM]
hostname = %APPEND% in.m.jd.com
*/

// HTTP 请求工具函数（移除 Promise.withResolvers）
const http = (op) => {
  return new Promise((resolve, reject) => {
    console.log(`发起 HTTP 请求: ${op.method || "get"} ${op.url}`);
    this.$httpClient?.[op.method || "get"](op, (err, resp, data) => {
      if (err) {
        console.log(`HTTP 请求错误: ${err}`);
        reject(err);
      } else {
        console.log(`HTTP 请求成功，响应数据: ${data.substring(0, 100)}...`); // 只打印前100字符
        resolve(JSON.parse(data));
      }
    });

    this.$task?.fetch(op).then(
      ({ body }) => {
        console.log(`Task 请求成功，响应数据: ${body.substring(0, 100)}...`);
        resolve(JSON.parse(body));
      },
      (err) => {
        console.log(`Task 请求错误: ${err}`);
        reject(err);
      }
    );
  });
};

// 日期格式化
const toDate = (t) => {
  const d = new Date(t - new Date().getTimezoneOffset() * 60000);
  return d.toISOString().split("T")[0];
};

// 解析数字
const parseNumber = (input) => {
  const cleaned = `${input}`.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned);
};

// 格式化数字
const formatNumber = (num) => (Number.isInteger(num) ? num : num.toFixed(2));

// 比较价格
const comparePrices = (a, b) => {
  const diff = formatNumber(parseNumber(a) - parseNumber(b));
  if (diff > 0) return `↑${diff}`;
  if (diff < 0) return `↓${-diff}`;
  return "●";
};

// 生成价格历史表格
const priceHistoryTable = (data) => {
  if (data.err) {
    console.log(`数据错误: ${data.msg}`);
    return `<h2>${data.msg}</h2>`;
  }

  const themeDetection = `
    <script>
      const setTimeBasedTheme = () => {
        const currentHour = new Date().getHours();
        const rootElement = document.documentElement;
        const isDarkTime = currentHour >= 19 || currentHour < 7;
        rootElement.setAttribute('data-theme', isDarkTime ? 'dark' : 'light');
      }
      document.addEventListener('DOMContentLoaded', setTimeBasedTheme);
    </script>
  `;

  const css = `<style>
    :root {
      --background-color: #fff;
      --text-color: #262626;
      --secondary-text-color: #8c8c8c;
      --header-bg: #fafafa;
      --border-color: #f0f0f0;
      --hover-bg: #fafafa;
      --box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      --table-border: 2px solid #f5f5f5;
    }
    [data-theme="dark"] {
      --background-color: #1f1f1f;
      --text-color: #e6e6e6;
      --secondary-text-color: #a6a6a6;
      --header-bg: #2a2a2a;
      --border-color: #303030;
      --hover-bg: #2a2a2a;
      --box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      --table-border: 2px solid #303030;
    }
    .price-container { width: 100%; background: var(--background-color); transition: background 0.3s ease; }
    .price-table { width: 92%; margin: 0 auto; border-collapse: collapse; font-size: 13px; border-radius: 12px; overflow: hidden; box-shadow: var(--box-shadow); color: var(--text-color); }
    .price-table th, .price-table td { padding: 14px 12px; text-align: center; border: 1px solid var(--border-color); }
    .table-header { background: var(--header-bg); border-bottom: var(--table-border); text-align: left; padding-left: 16px; }
    .table-header h2 { margin: 0; text-align: left; font-size: 16px; font-weight: 500; color: var(--text-color); }
    .price-table th { background: var(--header-bg); color: var(--secondary-text-color); font-weight: normal; font-size: 13px; }
    .price-table td { vertical-align: middle; }
    .price-table tr:hover td { background: var(--hover-bg); }
    .price-table td:first-child { color: var(--text-color); font-weight: 500; }
    .price-table td:nth-child(2) { color: var(--secondary-text-color); }
    .price-up td:nth-child(3), .price-up td:last-child { color: #ff4d4f; }
    .price-down td:nth-child(3), .price-down td:last-child { color: #52c41a; }
    .price-same td:nth-child(3), .price-same td:last-child { color: var(--secondary-text-color); }
    .price-table td:nth-child(3) { font-weight: 500; font-size: 14px; }
    .price-table td:last-child { font-size: 12px; }
  </style>`;

  let html = `${css}${themeDetection}<div class="price-container"><table class="price-table"><tr><th colspan="4" class="table-header"><h2>${data.groupName}</h2></th></tr><tr><th>类型</th><th>日期</th><th>价格</th><th>状态</th></tr>`;

  data.atts.forEach((row) => {
    const statusClass = row.status?.includes("↑") ? "price-up" : row.status.includes("↓") ? "price-down" : "price-same";
    const td = Object.keys(row).map((item) => `<td>${row[item]}</td>`).join("");
    html += `<tr class="${statusClass}">${td}</tr>`;
  });

  html += `</table></div>`;
  console.log("生成 HTML 表格完成");
  return html;
};

// 处理京东数据
const getJdData = (body) => {
  console.log("开始处理京东数据...");
  const { jiagequshiyh } = body.single;
  const jiageData = JSON.parse(`[${jiagequshiyh}]`).reverse().slice(0, 360);

  const { result } = jiageData.reduce(
    (acc, cur, index, arr) => {
      return acc
        .getMinNumber(cur)
        .getToday(index)
        .getLowestPrice(index, arr)
        .getHolidays(cur)
        .getHistPrices(++index);
    },
    {
      map: new Map([
        ["当前到手价", []],
        ["历史最低价", []],
        ["六一八价格", []],
        ["双十一价格", []],
      ]),
      price: Number.MAX_SAFE_INTEGER,
      todayPrice: null,
      time: null,
      get result() {
        return [...this.map].flatMap(([name, [date, price, status]]) =>
          date ? [{ name, date, price, status }] : []
        );
      },
      getToday(i) {
        if (i === 0) {
          this.todayPrice = this.price;
          this.storePriceInfo("当前到手价");
        }
        return this;
      },
      getLowestPrice(i, arr) {
        if (i === arr.length - 1) this.storePriceInfo("历史最低价");
        return this;
      },
      getHolidays([time, price]) {
        const holidays = ["11-11", "06-18"];
        const date = toDate(time);
        const holiday = holidays.find((h) => date.endsWith(h));
        if (holiday) {
          const title = holiday === "11-11" ? "双十一价格" : "六一八价格";
          this.storePriceInfo(`${title}`, date, `¥${price.toFixed(2)}`);
        }
        return this;
      },
      getHistPrices(i) {
        if ([30, 60, 90, 180, 360].includes(i))
          this.storePriceInfo(`${i}天最低`);
        return this;
      },
      getMinNumber([time, price]) {
        if (price < parseNumber(this.price)) {
          this.price = `¥${price.toFixed(2)}`;
          this.time = toDate(time);
        }
        return this;
      },
      storePriceInfo(key, date = this.time, price = this.price) {
        const value = [date, price, comparePrices(this.todayPrice, price)];
        this.map.set(key, value);
      },
    }
  );

  console.log("京东数据处理完成，结果:", result);
  return result;
};

// 获取价格数据
const getPriceData = async () => {
  try {
    console.log("开始获取价格数据...");
    const productId = $request.url.match(/\d+/);
    if (!productId) throw new Error("无法从 URL 中提取商品 ID");

    const body = await http({
      method: "post",
      url: "https://apapia-history.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx",
      headers: {
        "user-agent": "CFNetwork/3826.500.101 Darwin/24.4.0",
      },
      body: `methodName=getHistoryTrend&p_url=https://item.m.jd.com/product/${productId}.html`,
    });

    if (body.err) {
      console.log("API 返回错误:", body.msg);
      return body;
    }

    const result = {
      groupName: "历史比价",
      atts: getJdData(body),
    };
    console.log("价格数据获取成功:", result);
    return result;
  } catch (error) {
    console.log(`获取价格数据失败: ${error.message}`);
    return { err: true, msg: `获取价格数据失败: ${error.message}` };
  }
};

// 主执行逻辑
getPriceData()
  .then((priceData) => {
    let { body, headers } = $response;
    const tableHTML = priceHistoryTable(priceData);
    body = body.replace("<body>", `<body>${tableHTML}`);
    console.log("响应修改完成，返回结果");
    $done({ body, headers });
  })
  .catch((err) => {
    console.log(`脚本执行出错: ${err}`);
    $done({ body: `<h2>脚本执行出错: ${err.message}</h2>` });
  });