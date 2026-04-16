import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Camera {
  id: string;
  url: string;
  name?: string;
}

export interface CameraConfig {
  id: string;
  rtspChannel: string;
  name: string;
}
