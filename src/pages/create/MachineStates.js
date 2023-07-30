import { createMachine } from 'xstate';

export const panelStates = {
  IDLE: 'idle',
  QUICK_START: 'quick_start',
  CUSTOM: 'custom',
};

export const ControlPanelMachine = createMachine({
  id: 'controlPanel',
  initial: panelStates.IDLE,
  states: {
    [panelStates.IDLE]: {
      on: { SELECT_QUICK_START: panelStates.QUICK_START, SELECT_CUSTOM: panelStates.CUSTOM },
    },
    [panelStates.QUICK_START]: { on: { BACK: panelStates.IDLE } },
    [panelStates.CUSTOM]: { on: { BACK: panelStates.IDLE } },
  },
  predictableActionArguments: true,
});
