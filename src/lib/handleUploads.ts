// Handles photo "uploads". Everything remains on-device.

export type LockerImageObject = {
  originalBlob: Blob;
  editedBlob: Blob;
};

/* From a <input> element, get files. */
export async function handleFilePickerChange(
  event: React.ChangeEvent<HTMLInputElement>,
  onProgress?: (img: LockerImageObject) => void
) {
  const files = event.target.files;
  if (!files) return;

  const lockerImageObjects: LockerImageObject[] = [];

  for (const file of files) {
    const compressedBlob = await getCompressedImage(file);
    const obj = { originalBlob: file, editedBlob: compressedBlob };
    lockerImageObjects.push(obj);
    onProgress?.(obj);
    console.log("Processed image.");
    await new Promise(requestAnimationFrame); // yield to main thread
  }

  return lockerImageObjects;
}

export async function getCompressedImage(imgBlob: Blob) {
  // paint onto canvas
  const canvas = document.createElement("canvas"); // MUST DESTROY AFTER USE
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // paint image onto canvas
  const img = await createImageBitmap(imgBlob);
  const MAX_DIMENSION = 1280; // max width or height
  let { width, height } = img;
  if (width > height) {
    if (width > MAX_DIMENSION) {
      height = (height * MAX_DIMENSION) / width;
      width = MAX_DIMENSION;
    }
  } else {
    if (height > MAX_DIMENSION) {
      width = (width * MAX_DIMENSION) / height;
      height = MAX_DIMENSION;
    }
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob(
      (b) => {
        resolve(b);
      },
      "image/jpeg",
      0.92 // quality
    );
  });
  if (!blob) throw new Error("Could not create blob from canvas");

  // Cleanup
  canvas.width = 0;
  canvas.height = 0;
  canvas.remove();

  return blob;
}
