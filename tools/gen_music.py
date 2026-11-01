# -*- coding: utf-8 -*-
"""
生成音乐盒风格的背景音乐 WAV（纯标准库实现，无需安装任何东西）。
输出: assets/music/music-box.wav
"""
import wave, struct, math, os

SR = 22050          # 采样率
BPM = 80            # 速度
BEAT = 60.0 / BPM   # 一拍秒数
GAIN = 0.85

NOTE_BASE = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
def freq(name):
    """如 A4=440Hz"""
    n, octv = name[:-1], int(name[-1])
    semis = NOTE_BASE[n] + (octv - 4) * 12
    return 440.0 * (2 ** (semis / 12.0))

def bell(f, dur, amp=1.0, tau=0.9):
    """音乐盒/铃铛音色：基频 + 非谐泛音 + 指数衰减"""
    n = int(SR * dur)
    out = []
    partials = [(1.0, 1.0), (2.756, 0.32), (5.404, 0.12), (8.933, 0.05)]
    for i in range(n):
        t = i / SR
        v = 0.0
        for ratio, a in partials:
            v += a * math.sin(2 * math.pi * f * ratio * t)
        env = math.exp(-t / tau) * min(t / 0.004, 1.0)
        out.append(amp * v * env)
    return out

def bass(f, dur, amp=0.5, tau=1.5):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        v = math.sin(2 * math.pi * f * t) + 0.3 * math.sin(2 * math.pi * f * 2 * t)
        env = math.exp(-t / tau) * min(t / 0.01, 1.0)
        out.append(amp * v * env)
    return out

def pad(chord, dur, amp=0.055):
    n = int(SR * dur)
    fs = [freq(c) for c in chord]
    out = []
    for i in range(n):
        t = i / SR
        env = min(t / 0.25, 1.0) * min((dur - t) / 0.4, 1.0)
        v = sum(math.sin(2 * math.pi * f * t + k) for k, f in enumerate(fs))
        out.append(amp * v * env)
    return out

def mix_add(buf, snd, start_s):
    start = int(start_s * SR)
    need = start + len(snd)
    if need > len(buf):
        buf.extend([0.0] * (need - len(buf)))
    for i, v in enumerate(snd):
        buf[start + i] += v

# ---------- 编曲 ----------
# 每小节 4 拍：(和弦根音, 和弦三音, 和弦五音)
CHORDS = {
    "C":  ["C3", "E4", "G4"], "G":  ["G2", "B3", "D4"],
    "Am": ["A2", "C4", "E4"], "F":  ["F2", "A3", "C4"],
    "G7": ["G2", "B3", "F4"],
}
# 旋律：每小节 4 拍 -> [(音名, 拍数), ...]
MELODY = [
    # A 段
    [("E5",1),("G5",1),("C6",1),("G5",1)],          # C
    [("D5",1),("G5",1),("B5",1),("D6",1)],          # G
    [("C6",1),("A5",1),("E5",1),("A5",1)],          # Am
    [("F5",1),("A5",1),("C6",2)],                   # F
    # B 段（高一点）
    [("E6",1),("C6",1),("G5",1),("E5",1)],          # C
    [("D6",1),("B5",1),("G5",1),("D5",1)],          # G
    [("C6",1),("A5",1),("F5",1),("A5",1)],          # F
    [("G5",1),("B5",1),("D6",2)],                   # G
    # A' 段
    [("E5",1),("G5",1),("C6",1),("G5",1)],          # C
    [("D5",1),("G5",1),("B5",1),("D6",1)],          # G
    [("C6",1),("A5",1),("E6",1),("C6",1)],          # Am
    [("A5",1),("G5",1),("E5",1),("G5",1)],          # F
    # 结尾
    [("C6",2),("G5",1),("E5",1)],                   # C
    [("D6",1),("B5",1),("G5",2)],                   # G
    [("E6",1),("C6",1),("A5",2)],                   # Am
    [("C6",4)],                                     # C 结束
]
PROG = ["C","G","Am","F", "C","G","F","G", "C","G","Am","F", "C","G","Am","C"]

buf = []
t_cursor = 0.0
for bar_i, notes in enumerate(MELODY):
    chord_name = PROG[bar_i]
    chord = CHORDS[chord_name]
    # 低音 + 铺底
    mix_add(buf, bass(freq(chord[0]), BEAT * 4 * 1.05, amp=0.34), t_cursor)
    mix_add(buf, pad(chord[1:], BEAT * 4, amp=0.05), t_cursor)
    # 琶音伴奏（每拍后半拍轻点五音）
    for b in range(4):
        mix_add(buf, bell(freq(chord[2]) / 2, 0.6, amp=0.10, tau=0.5), t_cursor + b * BEAT + BEAT / 2)
    # 旋律
    pos = t_cursor
    for name, beats in notes:
        mix_add(buf, bell(freq(name), BEAT * beats + 1.2, amp=0.42, tau=0.75), pos)
        pos += BEAT * beats
    t_cursor += BEAT * 4

# 尾音余韵
mix_add(buf, bell(freq("C6"), 3.5, amp=0.30, tau=1.4), t_cursor)
mix_add(buf, bell(freq("E6"), 3.5, amp=0.18, tau=1.6), t_cursor + 0.05)

total = int(SR * (t_cursor + 3.2))
if len(buf) < total:
    buf.extend([0.0] * (total - len(buf)))
buf = buf[:total]

# 归一化 + 首尾淡入淡出
peak = max(abs(v) for v in buf) or 1.0
fade = int(SR * 0.05)
out = []
for i, v in enumerate(buf):
    v = v / peak * GAIN
    if i < fade:
        v *= i / fade
    if i > total - fade:
        v *= (total - i) / fade
    out.append(int(max(-32767, min(32767, v * 32767))))

out_path = os.path.join(os.path.dirname(__file__), "..", "assets", "music", "music-box.wav")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with wave.open(out_path, "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(struct.pack("<%dh" % len(out), *out))

print("OK ->", os.path.abspath(out_path), "%.1f 秒" % (total / SR))
