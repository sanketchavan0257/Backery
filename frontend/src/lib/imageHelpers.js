// Helpers for cake images (used by AddCakeModal and EditCakeModal)

// Converts share links that are NOT direct images into links that can be shown in <img>.
// Currently handles Google Drive links (file must be shared as "Anyone with the link").
export const convertImageLink = (input) => {
  const url = (input || '').trim();
  const m =
    url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) ||
    url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([^&#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  return url;
};

// True for Pinterest page links (these are web pages, not images)
export const isPinterestPageLink = (input) =>
  /pinterest\.[a-z.]+\/pin\//i.test(input || '') || /pin\.it\//i.test(input || '');

// Resizes + compresses a photo picked from the phone/computer and returns a data URL (JPEG).
export const compressImageFile = (file, maxSize = 800, quality = 0.75) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; // white background for transparent PNGs
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
