
export type ViewMode = 'display' | 'operator';

export interface QueueState {
  currentNumber: number;
  nextNumber: number;
  marqueeText: string;
  lastUpdated: number;
}
