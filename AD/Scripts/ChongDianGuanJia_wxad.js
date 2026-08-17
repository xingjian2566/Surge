// 充电管家页内流量主素材 + 微信插屏控件
const url = $request.url;
const headers = $request.headers || {};
const referer = headers.Referer || headers.referer || "";
const fromThisMini = referer.includes("wx38574b445862fab6");
const isWxVideoAd = /ads_svp_video|snssvpdownload/.test(url);
const isInterstitialChrome = /\/images\/wxapp\/(interstitial_|new_audio)/.test(url);

if (fromThisMini || isWxVideoAd || isInterstitialChrome) {
  $done({ response: { status: 204 } });
} else {
  $done({});
}
