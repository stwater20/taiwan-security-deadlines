# 台灣資安活動報名截止倒數 Taiwan Security Activity Deadlines

[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen)](https://stwater20.github.io/taiwan-security-deadlines)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/stwater20/taiwan-security-deadlines/pulls)

鑑於常常忘記報名時間，這個專案提供台灣資安教育活動（課程、競賽、研討會）的報名截止倒數。

👉 **線上瀏覽：[taiwan-security-deadlines](https://stwater20.github.io/taiwan-security-deadlines)**

收錄範圍包含：AIS3 暑期課程、AIS3 Junior、MyFirstCTF、臺灣好厲駭、HITCON、CYBERSEC 臺灣資安大會、金盾獎、全國技能競賽等。

本專案源自 [ai-deadlines](https://aideadlin.es)（@abhshkdz）與 [sec-deadlines](https://github.com/sec-deadlines/sec-deadlines.github.io)，由 [SecTools.tw](https://sectools.tw) 開源資安工具共享平台維護。本網站提供的所有資訊僅供參考，報名前請以主辦單位公告為準！

## 📅 訂閱行事曆

不想常來看網站？直接把截止日訂閱進你的行事曆：

* **Google 日曆**：[點此一鍵訂閱](https://calendar.google.com/calendar/render?cid=webcal%3A%2F%2Fstwater20.github.io%2Ftaiwan-security-deadlines%2Fical%2Fdeadlines-all.ical)，或在 Google 日曆「其他日曆 → 加入 → 加入網址」貼上下方 iCal 連結
* **Apple / Mac 日曆**：點擊網站上的「加入 Apple / Mac 日曆」按鈕（webcal 連結），或在行事曆 App「檔案 → 新增行事曆訂閱」貼上下方連結
* **iCal 連結**：
  * 全部活動：`https://stwater20.github.io/taiwan-security-deadlines/ical/deadlines-all.ical`
  * 實體活動：`https://stwater20.github.io/taiwan-security-deadlines/ical/deadlines-onsite.ical`
  * 線上活動：`https://stwater20.github.io/taiwan-security-deadlines/ical/deadlines-online.ical`

網站上每筆截止日旁也有「＋加入 Google 日曆」可以單筆加入。

## 🙌 如何貢獻（新增／更新活動）

**你只需要改一個檔案：[`_data/conferences.yml`](_data/conferences.yml)**，完全不用懂 Jekyll。

### 最簡單的方式（GitHub 網頁直接改）

1. 開啟 [`_data/conferences.yml`](https://github.com/stwater20/taiwan-security-deadlines/edit/main/_data/conferences.yml)，點右上角鉛筆 ✏️（GitHub 會自動幫你 fork）
2. 參考下方格式，新增或更新一筆活動
3. 送出 Pull Request，說明資料來源（主辦單位公告連結）
4. Merge 之後 GitHub Pages 會自動重新部署，網站與 iCal 都會更新

### 活動資料格式

```yaml
- name: 初階資安攻防演練(AIS3 MyFirstCTF)   # 活動名稱（不含年份）
  year: 2026                               # 活動年份
  date: May 16 09:30 - May 16 17:30        # 活動舉辦時間（顯示用）
  description: 教育部跨領域資通訊安全人才培育計畫舉辦之初階資安攻防演練。
  link: https://ais3.org/mfctf/            # 活動官網
  deadline:
    - "2026-4-19 17:00"                    # 報名截止時間（可多筆）
  timezone: Asia/Taipei                    # 台灣活動請務必加這行！
  place: Hsinchu, Taiwan                   # 活動地點
  tags: [EDU, ONSITE]                      # 標籤，見 _data/types.yml
```

| 欄位 | 必填 | 說明 |
|------|:---:|------|
| `name` | ✅ | 活動名稱，不含年份 |
| `year` | ✅ | 活動年份（注意是 `year:` 不是 `tag:`） |
| `link` | ✅ | 活動官網或報名頁 |
| `deadline` | ✅ | 截止時間清單，就算只有一筆也要用清單格式 |
| `timezone` |  | [tz 格式](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)時區。**台灣活動請填 `Asia/Taipei`**，不填會被當成 AoE (UTC-12) |
| `date` |  | 活動舉辦日期（顯示用文字） |
| `description` |  | 活動簡介 |
| `comment` |  | 補充說明，例如多個 deadline 各代表什麼 |
| `place` |  | 地點 |
| `tags` |  | `EDU`（教育活動）、`ONLINE`（線上）、`ONSITE`（實體），定義在 [`_data/types.yml`](_data/types.yml) |

### Deadline 格式細節

1. 一般格式：`"2026-4-19 17:00"`（注意要包在清單裡）
2. 每年固定的截止日可用樣板：`%y` 代表活動年份、`%Y` 代表前一年，例如 `"%y-01-15 23:59"`
3. 多個截止日就列多筆，並用 `comment` 說明各是什麼：

```yaml
  deadline:
    - "2026-5-2 18:00"    # Pre-exam 報名截止
    - "2026-5-31 18:00"   # 甄選資料繳交截止
```

小提醒：整點 `{h}:00` 會自動顯示為 `{h-1}:59:59`，避免跨時區的午夜混淆。網頁上所有時間會自動轉成瀏覽者的當地時間。

### 收錄標準

* 台灣本地或與台灣資安社群高度相關的活動
* 以「教育型」為主：課程、營隊、CTF、人才培育計畫、大型資安研討會
* 有明確的報名／徵稿截止時間
* 請附上官方公告來源，方便審核

### 常見錯誤

* ❌ `tag: 2026` → ✅ `year: 2026`
* ❌ `deadline: "2026-4-19 17:00"` → ✅ 要用清單：`deadline:` 換行 `- "2026-4-19 17:00"`
* ❌ 台灣活動忘記加 `timezone: Asia/Taipei`（會差 20 小時！）

## 🛠 本地開發

```bash
git clone https://github.com/stwater20/taiwan-security-deadlines.git
cd taiwan-security-deadlines
gem install bundler jekyll
jekyll serve   # http://localhost:4000/taiwan-security-deadlines/
```

純資料修改不需要本地環境，直接在 GitHub 網頁上改即可。

## 🐛 已知問題

* iPhone Safari 顯示可能有 bug，歡迎 PR 修復

## 📄 License

[MIT](LICENSE)。本專案基於 [ai-deadlines](https://github.com/abhshkdz/ai-deadlines)（MIT License, © Abhishek Das）並參考 [sec-deadlines](https://github.com/sec-deadlines/sec-deadlines.github.io) 修改而成，沿用相同授權並保留原作者聲明。
