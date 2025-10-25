"use client";

import Spacer from "@/components/spacer";
import { Button } from "@/components/ui/button";

import { handleFilePickerChange, LockerImageObject } from "@/lib/handleUploads";
import { useEffect, useRef, useState } from "react";
import LockerImage from "@/components/LockerImage";
import { Cropper, CropperRef, RectangleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [images, setImages] = useState<LockerImageObject[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<Blob | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    let cancelled = false;

    if (editingIndex !== null) {
      dialogRef.current?.showModal();

      (async () => {
        const blob = images[editingIndex].originalBlob;

        if (!cancelled) {
          setEditingImage(blob);
        }
      })();
    } else {
      dialogRef.current?.close();
    }

    return () => {
      cancelled = true;
    };
  }, [editingIndex, images]);

  return (
    <div className="font-sans p-4">
      <div className="flex flex-col items-center">
        <h1>Locker Formatter</h1>
        <p className="text-muted">
          Automatically pack a bunch of photos onto a page to be printed. Adding
          photos may take a while. All photos are kept on device.
        </p>
      </div>

      <Spacer size={4} />

      <div className="max-w-md m-auto gap-2 flex">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={async (e) =>
            handleFilePickerChange(e, (img) =>
              setImages((imgs) => [...imgs, img])
            )
          }
        />
        <Button variant={"outline"} onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <div className="mt-6 columns-4 printable">
        {images.map((img, idx) => (
          <div className="mb-4 break-inside-avoid" key={idx}>
            <LockerImage
              img={img.editedBlob}
              idx={idx}
              setEditingIndex={setEditingIndex}
              deleteSelf={(index) =>
                setImages(images.filter((_, i) => i !== index))
              }
            />
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto border-2 border-black/10 rounded-lg"
        onCancel={() => {
          setEditingIndex(null);
        }}
      >
        <div className="max-w-lg max-h-lg p-4">
          {editingIndex !== null && editingImage !== null && (
            <Cropper
              src={URL.createObjectURL(editingImage)}
              className="cropper"
              stencilComponent={RectangleStencil}
              ref={cropperRef}
            />
          )}
          <Spacer size={1} />
          <Button
            onClick={() => {
              // grab blob from cropper
              if (editingIndex == null || !cropperRef.current) {
                return;
              }
              const canvas = cropperRef.current.getCanvas();
              canvas?.toBlob((blob) => {
                if (blob) {
                  const newImages = [...images];
                  newImages[editingIndex].editedBlob = blob;
                  setImages(newImages);
                  setEditingIndex(null);
                  console.log("Saved cropped image");
                }
              });
            }}
          >
            Save
          </Button>
        </div>
      </dialog>
    </div>
  );
}
