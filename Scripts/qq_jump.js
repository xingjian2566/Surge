/*
 * Surge Script: QQLinkRedirector
 * Description: Intercepts QQ's internal browser links and sends a notification to open them in Safari.
 * Author: Your Name
 */

// 主执行函数
(function() {
    const requestUrl = $request.url;
    let targetUrl = null;

    // --- 步骤 1: 解析并提取目标 URL ---
    // 优先处理更常见的 query 参数型，例如 ...?url=... 或 ...?pfurl=...
    // 使用 URLSearchParams API，这比正则表达式更健壮和安全
    try {
        const params = new URL(requestUrl).searchParams;
        targetUrl = params.get('url') || params.get('pfurl');
        
        // 如果 targetUrl 存在，需要进行 URL 解码
        if (targetUrl) {
            targetUrl = decodeURIComponent(targetUrl);
        }
    } catch (e) {
        // 如果 URL 解析失败（虽然不太可能），则尝试备用方法
        console.log(`QQLinkRedirector: URL parsing failed, falling back to regex. Error: ${e.message}`);
    }

    // 备用方法：处理直接拼接型，例如 https://c.pc.qq.com/https%3A...
    if (!targetUrl && /^https:\/\/c\.pc\.qq\.com\/https%3A/i.test(requestUrl)) {
        targetUrl = decodeURIComponent(requestUrl.replace(/^https:\/\/c\.pc\.qq\.com\//i, ''));
    }

    // --- 步骤 2: 健壮性检查 ---
    // 如果没有成功提取到目标 URL，则不执行任何操作，让原始请求继续
    if (!targetUrl) {
        console.log('QQLinkRedirector: No target URL found. Letting request proceed.');
        $done({}); // 保持请求不变
        return;
    }

    // --- 步骤 3: 构建并发送可点击的通知 ---
    const title = 'QQ 链接拦截';
    const subtitle = '点击即可在 Safari 中打开';
    // 将目标 URL 作为通知的正文，方便用户预览
    const body = targetUrl; 
    
    // 这是实现点击跳转的关键！
    // 构建一个 options 对象，指定点击通知后的动作 (action) 为打开 URL (open-url)
    const options = {
        "action": "open-url", // 指定动作为打开 URL
        "url": targetUrl       // 指定要打开的具体 URL
    };

    // 发送通知，并将 options 对象作为第四个参数传入
    $notification.post(title, subtitle, body, options);
    console.log(`QQLinkRedirector: Notification sent to open ${targetUrl}`);

    // --- 步骤 4: 拦截并返回一个空响应 ---
    // 为了防止 QQ 应用因请求被中断而卡住或显示错误，
    // 我们返回一个虚拟的、内容为空的 HTTP 204 No Content 响应。
    const syntheticResponse = {
        response: {
            status: 204 // 204 No Content 是一个非常适合此场景的状态码
        }
    };

    // 使用我们构造的空响应来结束脚本
    $done(syntheticResponse);

})();
