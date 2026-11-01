# -*- coding: utf-8 -*-
"""
生成站点占位图片（SVG，纯标准库）：
- assets/img/photos/p1..p6.svg   相册占位照片
- assets/img/avatar1/2.svg       两人卡通头像
- assets/img/favicon.svg         网站图标
"""
import os

IMG = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
os.makedirs(os.path.join(IMG, "photos"), exist_ok=True)

def heart_path(cx, cy, s, color, opacity=1.0, rot=0):
    """以 (cx,cy) 为中心、s 为尺寸的心形"""
    return (f'<g transform="translate({cx},{cy}) rotate({rot}) scale({s})" opacity="{opacity}">'
            f'<path d="M0,6 C-6,-2 -14,-2 -14,5 C-14,12 -4,17 0,21 C4,17 14,12 14,5 '
            f'C14,-2 6,-2 0,6 Z" fill="{color}"/></g>')

def photo(idx, c1, c2, c3, caption, date, deco_char):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg{idx}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
    <radialGradient id="glow{idx}" cx="50%" cy="42%" r="45%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg{idx})"/>
  <circle cx="400" cy="250" r="220" fill="url(#glow{idx})"/>
  {heart_path(160, 120, 1.6, c3, .35, -12)}
  {heart_path(650, 460, 2.2, c3, .3, 15)}
  {heart_path(690, 110, 1.1, "#ffffff", .5, 20)}
  {heart_path(90, 470, 1.3, "#ffffff", .4, -20)}
  <text x="400" y="300" font-size="150" text-anchor="middle">{deco_char}</text>
  {heart_path(400, 355, 2.6, "#ffffff", .9)}
  <text x="400" y="470" font-size="34" font-weight="bold" text-anchor="middle" fill="#5c3d4e" font-family="'PingFang SC','Microsoft YaHei',sans-serif">{caption}</text>
  <text x="400" y="515" font-size="22" text-anchor="middle" fill="#5c3d4e" opacity=".65" font-family="'PingFang SC','Microsoft YaHei',sans-serif">{date} · 示例照片，去管理后台上传真实照片吧</text>
</svg>'''
    return svg

photos = [
    ("p1.svg", "#ffd9e4", "#ff9ebb", "#e64980", "初见 · 人海之中遇见你", "2024-05-20", "🌸"),
    ("p2.svg", "#ffe6f2", "#f8a8d8", "#d6336c", "第一次牵手 · 心跳加速", "2024-05-21", "💞"),
    ("p3.svg", "#d8f3ff", "#9ad8f5", "#1971c2", "第一次一起看海 · 风很甜", "2024-06-15", "🌊"),
    ("p4.svg", "#fff3d6", "#ffd88a", "#e8590c", "一起做的第一顿饭", "2024-07-02", "🍳"),
    ("p5.svg", "#ffe3ec", "#f0a6ca", "#a61e4d", "傍晚的摩天轮 · 我们的心愿", "2024-08-20", "🎡"),
    ("p6.svg", "#e8eefc", "#aebdf5", "#3b5bdb", "第一场雪 · 手牵手取暖", "2024-12-13", "❄️"),
]
for i, (name, c1, c2, c3, cap, date, ch) in enumerate(photos, 1):
    with open(os.path.join(IMG, "photos", name), "w", encoding="utf-8") as f:
        f.write(photo(i, c1, c2, c3, cap, date, ch))

# ---------- 头像 ----------
def avatar(bg, skin, hair, blush, extra=""):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{bg[0]}"/><stop offset="100%" stop-color="{bg[1]}"/>
  </linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#g)"/>
  <circle cx="100" cy="88" r="46" fill="{skin}"/>
  <path d="M54 88 Q54 38 100 38 Q146 38 146 88 Q146 72 132 66 Q124 58 100 58 Q76 58 68 66 Q54 72 54 88 Z" fill="{hair}"/>
  <circle cx="82" cy="92" r="5" fill="#4a2c38"/><circle cx="118" cy="92" r="5" fill="#4a2c38"/>
  <circle cx="84" cy="90" r="1.8" fill="#fff"/><circle cx="120" cy="90" r="1.8" fill="#fff"/>
  <ellipse cx="72" cy="104" rx="8" ry="5" fill="{blush}" opacity=".7"/>
  <ellipse cx="128" cy="104" rx="8" ry="5" fill="{blush}" opacity=".7"/>
  <path d="M88 108 Q100 118 112 108" stroke="#4a2c38" stroke-width="3" fill="none" stroke-linecap="round"/>
  {extra}
</svg>'''

boy = avatar(("#aee3ff", "#7cc4f5"), "#ffe8d6", "#4a3b32", "#ffb3a7")
girl = avatar(("#ffd9e4", "#ff9ebb"), "#fff0e6", "#6b4a3f", "#ff9fb0",
              extra='<circle cx="140" cy="52" r="14" fill="#ff5c8a"/><circle cx="140" cy="52" r="6" fill="#fff"/>'
                    '<path d="M132 40 L128 28 L138 34 Z" fill="#ff5c8a"/><path d="M148 40 L152 28 L142 34 Z" fill="#ff5c8a"/>')
with open(os.path.join(IMG, "avatar1.svg"), "w", encoding="utf-8") as f: f.write(boy)
with open(os.path.join(IMG, "avatar2.svg"), "w", encoding="utf-8") as f: f.write(girl)

# ---------- 图标 ----------
fav = '''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ff8fab"/><stop offset="100%" stop-color="#ff5c8a"/>
  </linearGradient></defs>
  <circle cx="32" cy="32" r="30" fill="url(#g)"/>
  <path d="M32 46 C20 36 12 30 12 22 C12 15 18 12 23 12 C27 12 30 14 32 18 C34 14 37 12 41 12 C46 12 52 15 52 22 C52 30 44 36 32 46 Z" fill="#fff"/>
</svg>'''
with open(os.path.join(IMG, "favicon.svg"), "w", encoding="utf-8") as f: f.write(fav)

print("OK ->", os.path.abspath(IMG))
