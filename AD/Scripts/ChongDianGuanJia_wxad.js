// 仅拦截「充电管家」小程序页内的微信流量主素材，其它微信图片原样放行
const url = $request.url;
const headers = $request.headers || {};
const referer = headers.Referer || headers.referer || "";
const fromThisMini = referer.includes("wx38574b445862fab6");
const isWxVideoAd = /ads_svp_video/.test(url);

if (fromThisMini || isWxVideoAd) {
  $done({ response: { status: 204 } });
} else {
  $done({});
}
