import { FC, SVGProps } from "react";

export default function createSvg(Component: FC<SVGProps<SVGSVGElement>>) {
  return (props: SVGProps<SVGSVGElement>) => (
    <Component fill="#00EBCF" {...props} />
  );
}
