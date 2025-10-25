import Spacer from "./spacer";
import { Button } from "./ui/button";

type Props = {
  img: Blob;
  idx: number;
  setEditingIndex: (index: number | null) => void;
  deleteSelf: (index: number) => void;
};

function LockerImage({ img, idx, setEditingIndex, deleteSelf }: Props) {
  const url = URL.createObjectURL(img);
  return (
    <div>
      <img
        src={url}
        alt={`Compressed image`}
        className="w-full h-auto rounded shadow"
      />
      <div className="print:hidden">
        <Spacer size={0.5} />
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold">Image: {idx + 1}</p>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={() => setEditingIndex(idx)}>
              Crop
            </Button>
            <Button variant="destructive" onClick={() => deleteSelf(idx)}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LockerImage;
