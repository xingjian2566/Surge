/*
 * Surge Script: SofaTimeToInfuse
 * Description: Intercepts sofatime.app URLs and creates a notification to open in Infuse.
 * Author: Technical Analyst
 */

// 主执行函数
(function() {
    // 使用现代 JavaScript 的 URL API 来安全、健壮地解析请求 URL
    const url = new URL($request.url);
    const params = url.searchParams;

    // 从查询参数中获取媒体 ID 和类型
    const mediaId = params.get('id');
    const mediaType = params.get('t');

    // --- 步骤 1: 健壮性检查 ---
    // 检查是否成功获取了必要的参数，如果任一参数缺失，则不执行任何操作，
    // 让原始请求继续，并记录日志以备调试。
    if (!mediaId ||!mediaType) {
        console.log('SofaTimeToInfuse: Missing "id" or "t" parameter. Letting request proceed.');
        // $done({}); 表示保持请求不变，让其继续发送到原始服务器
        $done({});
        return;
    }

    // --- 步骤 2: 条件化构建 Deep Link ---
    let infuseUrl;
    let mediaTypeName; // 用于通知中显示的更友好的名称

    switch (mediaType) {
        case 'movie':
            infuseUrl = `infuse://movie/${mediaId}`;
            mediaTypeName = 'Movie';
            break;
        case 'tv':
            infuseUrl = `infuse://series/${mediaId}`;
            mediaTypeName = 'TV Series';
            break;
        default:
            // 如果 't' 参数的值不是 'movie' 或 'tv'，则同样不处理
            console.log(`SofaTimeToInfuse: Unsupported media type "${mediaType}". Letting request proceed.`);
            $done({});
            return;
    }

    // --- 步骤 3: 构建并发送通知 ---
    const title = 'Open in Infuse';
    const subtitle = `Found ${mediaTypeName}: ${mediaId}`;
    const body = 'Click this notification to open the item directly in the Infuse app.';
    
    // 构建通知的 options 对象，指定点击动作为打开 URL
    const options = {
        action: "open-url",
        url: infuseUrl
    };

    // 发送通知
    $notification.post(title, subtitle, body, options);
    console.log(`SofaTimeToInfuse: Notification sent to open ${infuseUrl}`);

    // --- 步骤 4: 拦截并优雅地终止原始请求 ---
    // 为了防止浏览器因请求被中断而显示错误页面，我们返回一个虚拟的、
    // 内容为空的 HTTP 200 OK 响应。
    const syntheticResponse = {
        response: {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Request handled by Surge script: SofaTimeToInfuse.'
        }
    };

    // $done() 传入一个包含 response 键的对象，将使用该响应返回给客户端
    $done(syntheticResponse);

})();
