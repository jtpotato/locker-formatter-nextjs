import Spacer from "./spacer";
import { Button } from "./ui/button";

type Props = {
  img: Blob;
  name: string;
};

function LockerImage({ img, name }: Props) {
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
        <p className="font-semibold">Image: {name}</p>
        <Button variant={"outline"}>Crop</Button>
      </div>
    </div>
  );
}

export default LockerImage;
