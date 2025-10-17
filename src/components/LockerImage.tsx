import Spacer from "./spacer";
import { Button } from "./ui/button";

type Props = {
  img: Blob;
  idx: number;
  setEditingIndex?: (index: number | null) => void;
};

function LockerImage({ img, idx, setEditingIndex }: Props) {
  const url = URL.createObjectURL(img);
  return (
    <div>
      <img
        src={url}
        alt={`Compressed image`}
        className="w-full h-auto rounded shadow"
      />
      <Spacer size={0.5} />
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">Image: {idx + 1}</p>
        <Button variant={"outline"} onClick={() => setEditingIndex(idx)}>
          Crop
        </Button>
      </div>
    </div>
  );
}

export default LockerImage;
