# ⚠️ Image Size Limit - Important!

## The Problem

Your app stores images as **Base64 strings** directly in Firestore database.

### Size Limits:

- **Firestore document limit**: 1 MB (1,048,487 bytes)
- **Base64 overhead**: ~33% larger than original file
- **Recommended max image size**: **750 KB**

### Example:

| Original Image | Base64 Size | Result              |
| -------------- | ----------- | ------------------- |
| 500 KB         | ~666 KB     | ✅ Works            |
| 750 KB         | ~1 MB       | ✅ Works (at limit) |
| 938 KB         | ~1.3 MB     | ❌ **Too large!**   |

## ✅ Solutions

### **Option 1: Compress Your Images** (Recommended)

Use online tools to compress images:

1. **TinyPNG** - https://tinypng.com/

   - Drag & drop your image
   - Download compressed version
   - Usually reduces size by 50-80%

2. **Compressor.io** - https://compressor.io/

   - Supports PNG, JPG, GIF, SVG
   - Good compression rates

3. **Squoosh** - https://squoosh.app/
   - Advanced compression options
   - Compare before/after quality

### **Option 2: Use Image URLs** (Easiest!)

Instead of uploading, paste image URLs:

1. Find an image URL online
2. Paste in "Or enter URL" field
3. Save - Works instantly!

**Example URLs:**

- `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/assets/images/wordmark.svg`
- `https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png`

### **Option 3: Resize Images**

Use image editing tools to reduce dimensions:

- **Online**: Photopea, Canva
- **Desktop**: Paint, GIMP, Photoshop
- **Recommended dimensions**: 800x600px or smaller

## 📊 Recommended Image Sizes

| Use Case   | Max Size | Dimensions | Format  |
| ---------- | -------- | ---------- | ------- |
| Thumbnail  | 50 KB    | 200x200px  | PNG/JPG |
| Card Image | 200 KB   | 800x600px  | JPG     |
| Full Image | 500 KB   | 1200x900px | JPG     |

## 🎯 Quick Tips

1. **Use JPG** instead of PNG (smaller file size)
2. **Compress before upload** (TinyPNG recommended)
3. **Resize large images** to reasonable dimensions
4. **Use image URLs** for external images
5. **Check file size** before uploading

## ⚡ Quick Compress Command

If you have ImageMagick installed:

```bash
magick input.jpg -quality 85 -resize 800x600 output.jpg
```

---

**Remember: Keep images under 750KB for best results!** 📸
