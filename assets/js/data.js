/* ============================================================
 *  站点内容配置 —— 想改名字、纪念日、照片、时间线、清单，都在这里
 *  也可以打开 admin.html（管理后台）可视化修改，无需懂代码
 * ============================================================ */
window.SITE_DATA = {
  /* 网站标题（浏览器标签页 & 导航栏显示） */
  title: "我们的恋爱小站",

  /* 两个人的名字和头像（头像可替换 assets/img/avatar1.svg / avatar2.svg） */
  him:  { name: "大笨蛋", avatar: "assets/img/avatar1.svg" },
  her:  { name: "小可爱", avatar: "assets/img/avatar2.svg" },

  /* 在一起的纪念日（恋爱计时从这里开始算） */
  startDate: "2024-05-20",

  /* 首页大屏幕上的一句话 */
  heroText: "愿有岁月可回首，且以深情共白头。",

  /* 背景音乐（可往 assets/music/ 里加自己的 mp3/wav，然后在这里加一行） */
  music: [
    { title: "我们的歌（音乐盒版）", src: "assets/music/music-box.wav" }
  ],

  /* 相册：src 是图片路径，caption 是说明，date 是日期 */
  album: [
    { src: "assets/img/photos/p1.svg", caption: "初见 · 人海之中遇见你", date: "2024-05-20" },
    { src: "assets/img/photos/p2.svg", caption: "第一次牵手 · 心跳加速的那天", date: "2024-05-21" },
    { src: "assets/img/photos/p3.svg", caption: "第一次一起看海 · 风很甜", date: "2024-06-15" },
    { src: "assets/img/photos/p4.svg", caption: "一起做的第一顿饭 · 有点糊但好吃", date: "2024-07-02" },
    { src: "assets/img/photos/p5.svg", caption: "傍晚的摩天轮 · 我们的心愿", date: "2024-08-20" },
    { src: "assets/img/photos/p6.svg", caption: "第一场雪 · 手牵手取暖", date: "2024-12-13" }
  ],

  /* 点点滴滴 · 时间线（icon 用 emoji 即可） */
  timeline: [
    { date: "2024-05-20", icon: "❤️", title: "我们在一起啦", text: "这一天风很温柔，你红着脸答应了笨拙的我。从今天起，我们就是彼此的人啦。" },
    { date: "2024-06-01", icon: "🎡", title: "第一次约会", text: "游乐园里排队排了好久，但握着你的手，等多久都值得。摩天轮升到最高点时，我偷偷许了个愿。" },
    { date: "2024-09-10", icon: "🌊", title: "第一次一起看海", text: "海浪一遍遍冲上来，你踩着水花回头对我笑，那一刻我想，余生就定下来了。" },
    { date: "2025-01-01", icon: "🎆", title: "第一次一起跨年", text: "倒数三、二、一的时候，全世界都在欢呼，而我的眼里只有你。新的一年，也要在一起。" },
    { date: "2025-05-20", icon: "💍", title: "一周年快乐", text: "365 天，说长不长说短不短，但每一天都有你，就是我最大的运气。" }
  ],

  /* 恋爱清单 · 想一起完成的事（done: true 表示已完成） */
  checklist: [
    { text: "一起去看日出 ☀️",        done: false },
    { text: "一起去看海 🌊",          done: true  },
    { text: "一起做一顿晚餐 🍳",      done: true  },
    { text: "一起去游乐园 🎡",        done: true  },
    { text: "拍一组合照 📷",          done: false },
    { text: "一起看一场演唱会 🎤",    done: false },
    { text: "一起养一只小猫 🐱",      done: false },
    { text: "一起跨年倒数 🎆",        done: true  },
    { text: "一起看一场流星雨 🌠",    done: false },
    { text: "来一场说走就走的旅行 ✈️", done: false }
  ]
};
