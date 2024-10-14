import type { VxeGlobalRenderer } from 'vxe-table';

import { actionRenderer } from '#/adapter/render/action';
import { dictRenderer } from '#/adapter/render/dict';

import { switchRenderer } from './switch';

export const createRender = (renderer: VxeGlobalRenderer) => {
  switchRenderer(renderer);
  actionRenderer(renderer);
  dictRenderer(renderer);
};
