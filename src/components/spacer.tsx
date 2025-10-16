import React from "react";

type SpacerProps = {
  size?: number;
};

export function Spacer({ size = 1 }: SpacerProps) {
  return <div style={{ height: `${size}em` }} />;
}

export default Spacer;
