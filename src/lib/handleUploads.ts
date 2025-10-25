// Handles photo "uploads". Everything remains on-device. Photos too large for memory, so we use native system filepicker allowing us to hold on to file handles so we can reference when we need full res.

export type LockerImageObject = {
  fileHandle: FileSystemFileHandle;
  editedBlob: Blob;
};

/** Promise. Returns a streamed blob array. */
export async function openFilePicker(
  onProgress?: (img: LockerImageObject) => void
) {
  const fileHandles = await window.showOpenFilePicker({
    multiple: true,
    types: [
      {
        description: "Image files",
        accept: {
          "image/*": [
            ".png",
            ".gif",
            ".jpeg",
            ".jpg",
            ".webp",
            ".tiff",
            ".bmp",
          ],
        },
      },
    ],
    excludeAcceptAllOption: true,
  });

  const lockerImageObjects: LockerImageObject[] = [];

  for (const [index, handle] of fileHandles.entries()) {
    const blob = await getCompressedImageFromHandle(handle);
    const obj = { fileHandle: handle, editedBlob: blob };
    lockerImageObjects.push(obj);
    onProgress?.(obj);
    console.log("Processed image.");
    await new Promise(requestAnimationFrame); // yield to main thread
  }

  return lockerImageObjects;
}

export async function getCompressedImageFromHandle(
  fileHandle: FileSystemFileHandle
) {
  const file = await fileHandle.getFile();
  // paint onto canvas
  const canvas = document.createElement("canvas"); // MUST DESTROY AFTER USE
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const img = await createImageBitmap(file);
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

export async function getFullResImageFromHandle(
  fileHandle: FileSystemFileHandle
) {
  const file = await fileHandle.getFile();
  return file;
}
