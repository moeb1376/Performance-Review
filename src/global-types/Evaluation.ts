import { i18n } from '@lingui/core';

export enum Evaluation {
  'EXCEEDS_EXPECTATIONS' = 'EXCEEDS_EXPECTATIONS',
  'MEETS_EXPECTATIONS' = 'MEETS_EXPECTATIONS',
  'NEEDS_IMPROVEMENT' = 'NEEDS_IMPROVEMENT',
  'SUPERB' = 'SUPERB',
}

export const evaluationDictionary: Record<Evaluation, string> = {
  [Evaluation.NEEDS_IMPROVEMENT]: i18n._('Needs Improvement'),
  [Evaluation.MEETS_EXPECTATIONS]: i18n._('Meets Expectations'),
  [Evaluation.EXCEEDS_EXPECTATIONS]: i18n._('Exceeds Expectations'),
  [Evaluation.SUPERB]: i18n._('Superb'),
};
