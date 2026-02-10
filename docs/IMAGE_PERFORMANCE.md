# Image performance

## What’s already in place

- **Build-time optimization**: `vite-plugin-image-optimizer` compresses PNGs and SVGs during `pnpm run build`. SVGs and small PNGs are reduced in size; large PNGs are left as-is when re-encoding would increase size.
- **Lazy loading**: Below-the-fold images use `loading="lazy"` and `decoding="async"` so they don’t block initial paint.
- **LCP hint**: The About hero image uses `fetchPriority="high"` so the browser can prioritize it.
- **Dimensions**: Key images have `width`/`height` where possible to reduce layout shift (CLS).
- **Caching**: Nginx serves images with long-lived cache (`Cache-Control: public, immutable`, 1 year).

## Further gains (optional)

The largest assets are **auth-layout-bg.png** (~7.1MB) and **about-hero.png** (~1.8MB). The build plugin does not shrink them further without making files bigger. To improve load time:

1. **Resize to display size**  
   If the image is never shown larger than e.g. 1920×1080, export it at that size (or 2× for retina) instead of larger.

2. **Re-export as WebP**  
   Use [Squoosh](https://squoosh.app/) or similar to convert these PNGs to WebP (e.g. quality 80–85). You can:
   - Replace the PNG in `src/assets` with a WebP and update the import/`url()` to the new file, or
   - Add a `<picture>` (or CSS `image-set`) with WebP + PNG fallback and keep both files.

3. **Auth background**  
   `auth-layout-bg.png` is used in `src/tailwind.css` as a background. Converting it to WebP and referencing the WebP in CSS (with a PNG fallback if needed) will cut payload size a lot.

After changing source images, run `pnpm run build` again; the optimizer will process the new assets.
