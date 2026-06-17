/**
 * Utility to compress images in the browser using HTML Canvas.
 * Prevents exceeding the 5MB localStorage quota by scaling down images to standard avatar sizes
 * and compressing them as JPEG.
 */
export function compressImage(
  base64Str: string,
  maxWidth = 300,
  maxHeight = 350,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    // Check if it is already small, or not a base64 string
    if (!base64Str || !base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        // Fill background with white in case of PNG transparency (so it compiles to clean JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL JPEG with quality parameter
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      } catch (err) {
        console.warn('Gagal kompresi gambar:', err);
        resolve(base64Str); // Fallback to raw if logic fails
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
