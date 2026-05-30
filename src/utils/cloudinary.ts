const SEP = '/upload/';

/** Inserts Cloudinary transform params for a square thumbnail. Non-Cloudinary URLs pass through unchanged. */
export function cloudinaryThumb(url: string, size = 600): string {
  if (!url.includes(SEP)) return url;
  return url.replace(SEP, `${SEP}w_${size},h_${size},c_fill,q_auto,f_auto/`);
}

/** Inserts Cloudinary transform params for a full-width display image. Non-Cloudinary URLs pass through unchanged. */
export function cloudinaryFull(url: string, width = 1200): string {
  if (!url.includes(SEP)) return url;
  return url.replace(SEP, `${SEP}w_${width},q_auto,f_auto/`);
}
