import { rounded, spacing } from '../../core';
import { StepperTheme } from '../../components';

import { color } from './colors';

const stepper: StepperTheme = {
  divider: {
    incomplete: {
      backgroundColor: color('grey-200')
    },
    active: {
      backgroundColor: color('grey-200')
    },
    complete: {
      backgroundColor: color('primary-500')
    }
  },
  step: {
    base: {
      width: spacing('5xl'),
      height: spacing('5xl'),
      borderRadius: rounded('full'),
      color: color('light'),
      borderWidth: '2px',
      borderStyle: 'solid',
      backgroundColor: color('grey-400')
    },
    active: {
      borderColor: color('primary-500')
    },
    incomplete: {
      borderColor: color('grey-200')
    },
    complete: {
      borderColor: color('primary-500'),
      backgroundColor: color('primary-500')
    }
  }
};

export { stepper };
