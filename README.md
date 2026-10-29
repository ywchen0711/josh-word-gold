# 一字千金 ABC 海外特別節目 · A Word Worth Gold: the ABC Special

一部大約十分鐘的積木動畫：住在美國加州聖地牙哥的十歲華裔男孩 **Josh**，一個人去參加《一字千金》為海外華人小孩舉辦的特別節目。八歲的弟弟 **Jasper** 跟爸爸媽媽坐在第一排，舉著「GO JOSH!」的牌子大喊「哥哥加油，Add oil！」

**線上看：** https://ywchen0711.github.io/josh-word-gold/ （播放時可以拖曳畫面轉視角；按「下載影片」可以存成影片檔）

## 參賽者

| | 從哪裡來 | 特色 |
|---|---|---|
| Josh | 加州聖地牙哥 | 每個星期六都上中文學校，「我喜歡下課的時候」 |
| Emily | 紐約 | 很有自信，中文名字想了半天才想起來叫「林美麗」 |
| Kevin | 德州 | 戴牛仔帽，「Howdy y'all！」，家裡有一頭牛跟兩台卡車 |
| Ethan | 倫敦 | 「我是 BBC」——British-born Chinese |
| Sophie | 溫哥華 | 「我是 CBC」，一直說 sorry |
| Mei | 雪梨 | 「我是 ABC」——在澳洲是 Australian-born Chinese |

主持人是曾國城（「ABC、BBC、CBC……我們今天是比國字，還是電視台聯誼會？」）。

## 比賽

1. **聲調大考驗**：我最喜歡吃「睡覺」、主持人我可以「吻」你一個問題嗎、媽媽煮「糖」給我喝、繞口令「媽媽騎馬，馬慢，媽媽罵馬」
2. **文化大不同**：拿紅包可以用 Venmo 嗎？中秋節吃 turkey？（台灣中秋要烤肉！）阿姨問「吃飽了沒」不是要請你吃飯；為什麼「四」不吉利
3. **成語英文翻**：horse horse tiger tiger、people mountain people sea、chicken talk to duck、畫蛇添足、對牛彈琴（德州：對牛唱 country music）
4. **決戰 一字千金**：Josh 對 Emily，分數歸零。「家」兩人都對；「龜」Josh 多寫了一點，落後一千分；最後一題兩千分寫「媽」——Emily 寫成了「嗎」，Josh 驚險逆轉奪冠，還對台下的媽媽說了一句話。

## 怎麼做的

- 用《武林積木》的電影引擎（`js/engine.js`、`js/film.js`）和《一字千金》攝影棚（`js/studio.js`）：大螢幕、六個搶答台、會笑會拍手的積木觀眾、燈光、彩帶和金幣
- 角色在 `js/cast/abc.js`（主持人在 `js/cast/show.js`），劇本在 `js/films/abc1.js`：每場戲照著台詞、停頓、動作寫下來，時間依錄好的語音長度自動排
- 配音：`tools/voices.py`（edge-tts）。Josh 的中文最標準；其他小朋友用英語系的多語言語音念中文，所以帶著美國、澳洲腔
- 觀眾的笑聲、掌聲、「喔～」、鼓聲都是真實錄音（CC0，來源列在 `tools/crowd_real.py`）
- 影片：`node tools/render.mjs abc1` 一格一格算出 1080p MP4（`renders/abc1.mp4`）
