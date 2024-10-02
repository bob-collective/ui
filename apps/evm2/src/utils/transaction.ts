import { MessageDirection } from '../types';

export const getDuration = (direction: MessageDirection) =>
  direction === MessageDirection.L1_TO_L2 ? '3 minutes' : '7 days';
