import { RadioGroupState } from '@react-stately/radio';
import React, { useContext } from 'react';

import { RadioSize } from '../../theme';

type RadioGroupContext = { state: RadioGroupState; size: RadioSize };

export const RadioContext = React.createContext<RadioGroupContext>({ size: 'md' } as RadioGroupContext);

export function useRadioProvider(): RadioGroupContext {
  return useContext(RadioContext);
}
