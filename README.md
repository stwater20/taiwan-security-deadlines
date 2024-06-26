# Taiwan security activity deadlines countdown

鑑於常常忘記報名時間，這個專案提供台灣教育資安計畫的報名時間倒計時，您可以直接訪問 [taiwan-security-deadlines](https://stwater20.github.io/taiwan-security-deadlines) 查看現有或是到期的計畫有哪些，也歡迎您參與貢獻歐!

該專案 Fork 自 [ai-deadlines](https://aideadlin.es)，
並由 [SecTools.tw](https://sectools.tw) 開源資安工具共享平台進行維護，
該專案公告統一發布至[https://sectools.tw/security-list/](https://sectools.tw/security-list/)，
本網站提供的所有服務皆為僅供參考，請多方查證!

## 時區注意

目前使用時間為 AoE (Anywhere on Earth) ，如需要轉換台灣時間請參考：

或者您可以直接將時間 減少 4 小時：
因為 AoE = UTC - 12:00 與 Taipei Time (Taiwan) = UTC + 8:00 

[https://datetime360.com/aoe-taipei-time/](https://datetime360.com/aoe-taipei-time/)

<img src="image.png" width="50%" height="auto"/>

## 問題

目前已知 iphone 的 Safari 會出 Bug.

## Origin Project

Origin project was based on [ai-deadlines](https://aideadlin.es) by @abshkdz.

## Adding/updating a activity

* Read the data format description below. **Note that the timezone format sign is inverted** (e.g., UTC+7 is written as `Etc/GMT-7`). It's [not a bug][0]. I hate this format too. I'd be happy to move to a different timezone JavaScript library that uses a friendlier format, but I don't have time for that.
* Update `_data/conferences.yml`. You can do that on GitHub or locally after forking the repo.
* Send a pull request

### activity entry record

Example record: (Below is exapmle, not truth.)

```
- name: SecTools.tw 開源資安文章徵稿中
  year: 2024
  date: Aug 9 - Oct 10
  description: 專門在分享開源資安工具與文章的網站，現在開始號招各式寫手囉!
  link: https://sectools.tw
  deadline:
    - "2024-9-31 23:00"
  place: Taipei, Taiwan
  tags: [EDU]
```

Descriptions of the fields:

| Field name    | Description                                                                             |
|---------------|-----------------------------------------------------------------------------------------|
| `name`\*      | Short activity name, without year                                                     |
| `year`\*      | Year the activity is happening                                                        |
| `description` | Description, or long name                                                               |
| `comment`     | Additional comments, e.g., co-located activity, rolling deadline                      |
| `link`\*      | URL to the activity home page                                                         |
| `deadline`\*  | A list of deadlines. [(Gory details below)][4]                                          |
| `timezone`    | [Timezone][5] in [tz][1] format. By default is UTC-12 ([AoE][2])                        |
| `date`        | When the activity is happening                                                        |
| `place`       | Where the activity is happening                                                       |
| `tags`        | One or multiple [tags][3]: `SEC`, `PRIV`, or `CRYPTO` (topic); `CONF` or `SHOP` (venue) |

Fields marked with asterisk (\*) are required.


### Deadline format

The *deadline* field can contain:

1. The simplest option: a date and time in ISO format. Example: `["2017-08-19 23:59"]` (Note that you need to wrap even a single deadline in a list).
2. If a deadline is rolling, you can use a template date, just substitute the
   year with `%y` and the year before the activity with `%Y`. Example:
   `["%y-01-15 23:59"]` means there is a deadline on the 15th January in the
   same year as the activity.
2. A list of (1) or (2). Example of two rolling deadlines, with one in the end
   of October in the year prior to the activity year, and the second in the
   end of February in the same year as the activity:
  ```
  - "%Y-10-31 23:59"
  - "%y-02-28 23:59"
  ```

On the page, all deadlines are displayed in viewer's local time (that's a feature).

*Note:* If the deadline hour is `{h}:00`, it will be automatically translated into `{h-1}:59:59` to avoid pain and confusion when it happens to be midnight in local time.

### Timezones

The timezone is specified in [tz format][1]. Unlike abbreviations (e.g. EST), these are un-ambiguous. Here are tz codes for some common timezones:

| Common name                   | tz                                                                 |
|-------------------------------|--------------------------------------------------------------------|
| UTC                           | `Etc/UTC`                                                          |
| America Pacific Time          | `America/Los_Angeles`                                              |
| Pacific Standard Time (UTC-8) | `Etc/GMT+8` (Yes, the sign is inverted for some weird reason)      |
| America Eastern Time          | `America/New_York`                                                 |
| Eastern Standard Time (UTC-5) | `Etc/GMT+5`                                                        |
| American Samoa Time (UTC-11)  | `Pacific/Samoa` or `Etc/GMT+11`. This timezone does not use DST.   |
| Aleutian Islands              | `America/Adak`                                                     |

[0]: https://momentjs.com/timezone/docs/#/zone-object/offset/
[1]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[2]: https://www.timeanddate.com/time/zones/aoe
[3]: _data/types.yml
[4]: #deadline-format
[5]: #timezones


## LICENSE

[MIT](LICENSE)