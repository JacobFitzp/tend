"use client";
import { Rose } from './Rose';
import { Sunflower } from './Sunflower';
import { Lavender } from './Lavender';
import { Tulip } from './Tulip';
import { CherryBlossom } from './CherryBlossom';
import { Daisy } from './Daisy';
import type { FlowerProps } from './shared';

const FLOWER_COMPONENTS = [Rose, Sunflower, Lavender, Tulip, CherryBlossom, Daisy];
export const FLOWER_NAMES = ["Rose","Sunflower","Lavender","Tulip","Cherry Blossom","Daisy"];

interface FlowerPlantProps extends FlowerProps { index: number; }
export function FlowerPlant({ index, stage, dead }: FlowerPlantProps) {
  const F = FLOWER_COMPONENTS[index];
  return <F stage={stage} dead={dead}/>;
}
