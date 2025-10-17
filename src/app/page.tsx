"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spacer from "@/components/spacer";
import { Button } from "@/components/ui/button";

import { openFilePicker } from "@/lib/handleUploads";
import { useState } from "react";
import LockerImage from "@/components/LockerImage";

export default function Home() {
  const [compressedImages, setCompressedImages] = useState<Blob[]>([]);

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
          <LockerImage img={img} key={idx} name={`${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}
