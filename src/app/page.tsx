"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spacer from "@/components/spacer";
import { Button } from "@/components/ui/button";

import { openFilePicker } from "@/lib/handleUploads";
import { useState } from "react";
import LockerImage from "@/components/LockerImage";
import { Cropper, RectangleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

export default function Home() {
  const [compressedImages, setCompressedImages] = useState<Blob[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="font-sans p-4">
      <div className="flex flex-col items-center">
        <h1>Locker Formatter</h1>
        <p className="text-muted">
          Automatically pack a bunch of photos onto a page to be printed.
        </p>
      </div>

      <Spacer size={4} />

      <div className="max-w-md m-auto">
        <Button
          id="pictures"
          onClick={async () =>
            setCompressedImages([
              ...compressedImages,
              ...(await openFilePicker()),
            ])
          }
        >
          Upload Photos
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {compressedImages.map((img, idx) => (
          <LockerImage
            img={img}
            key={idx}
            idx={idx}
            setEditingIndex={setEditingIndex}
          />
        ))}
      </div>

      {editingIndex !== null && (
        <div className="max-w-lg max-h-lg">
          <Cropper
            src={URL.createObjectURL(compressedImages[editingIndex])}
            className="cropper"
            stencilComponent={RectangleStencil}
          />
        </div>
      )}
    </div>
  );
}
