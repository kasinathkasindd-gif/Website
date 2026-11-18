"""master.py <in.mp4> <out.mp4> — two-pass loudness master to -14 LUFS, true peak <= -1.5 dBTP (video stream copied)."""
import json, re, subprocess, sys

src, dst = sys.argv[1], sys.argv[2]
p1 = subprocess.run(
    ["ffmpeg", "-hide_banner", "-nostdin", "-i", src, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
m = json.loads(re.search(r"\{[^{}]*\}", p1, re.S).group(0))
af = (
    f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
    f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
)
subprocess.run(
    ["ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error", "-y", "-i", src, "-c:v", "copy", "-af", af,
     "-ar", "48000", "-c:a", "aac", "-b:a", "192k", dst],
    check=True,
)
chk = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-i", dst, "-af", "loudnorm=print_format=summary", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
print("\n".join(l for l in chk.splitlines() if "Input Integrated" in l or "Input True Peak" in l))
