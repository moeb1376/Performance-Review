import graphql from 'babel-plugin-relay/macro';
import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { DominantCharacteristicsOutput } from 'src/shared/dominant-characteristics-output';
import { FCProps } from 'src/shared/types/FCProps';
import { PromptProvider } from 'src/shared/prompt';
import { i18n } from '@lingui/core';
import { useBiDiSnackbar } from 'src/shared/snackbar';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { useMutation } from 'src/relay';

import { StrengthsWeaknessesForm } from './StrengthsWeaknessesForm';
import { StrengthsWeaknessesPageMutation } from './__generated__/StrengthsWeaknessesPageMutation.graphql';
import { StrengthsWeaknessesPageQuery } from './__generated__/StrengthsWeaknessesPageQuery.graphql';
import { normalizeArray } from './utils';

interface OwnProps {
  revieweeId: string;
}

type Props = FCProps<OwnProps>;

const useStrengthsWeaknessesPageMutation = () =>
  useMutation<StrengthsWeaknessesPageMutation>(graphql`
    mutation StrengthsWeaknessesPageMutation($input: SavePersonReviewMutationInput!) {
      savePersonReview(input: $input) {
        personReview {
          id
          state
          ...DominantCharacteristicsCircularIndicator_review
        }
      }
    }
  `);

const query = graphql`
  query StrengthsWeaknessesPageQuery($id: ID!) {
    viewer {
      findPersonReview(revieweeId: $id) {
        reviewee {
          ...StrengthsWeaknessesForm_user
        }
        ...DominantCharacteristicsOutput_review
        state
        strengths
        weaknesses
        isSelfReview
      }
    }
  }
`;

const transformData = (data: StrengthsWeaknessesFormData) => {
  const strengths = data.strengths?.filter(val => !!val);
  const weaknesses = data.weaknesses?.filter(val => !!val);

  return {
    strengths: strengths ? strengths : [],
    weaknesses: weaknesses ? weaknesses : [],
  };
};

export default function StrengthsWeaknessesPage(props: Props) {
  const { revieweeId } = props;
  const { enqueueSnackbar } = useBiDiSnackbar();
  const strengthsWeaknessesPageMutation = useStrengthsWeaknessesPageMutation();
  const data = useLazyLoadQuery<StrengthsWeaknessesPageQuery>(query, { id: revieweeId });
  const review = data.viewer.findPersonReview;

  const handleSubmit = useCallback(
    (data: StrengthsWeaknessesFormData) => {
      const transformedData = transformData(data);

      const input = { input: { revieweeId, ...transformedData } };
      strengthsWeaknessesPageMutation(input)
        .then(res => {
          enqueueSnackbar(i18n._('Successfully saved.'), { variant: 'success' });
        })
        .catch(error => {
          enqueueSnackbar(i18n._('Something went wrong.'), { variant: 'error' });
        });
    },
    [strengthsWeaknessesPageMutation, revieweeId, enqueueSnackbar],
  );

  return (
    <Box padding={4}>
      {review?.state === 'DONE' ? (
        <DominantCharacteristicsOutput review={review} />
      ) : (
        <PromptProvider message={i18n._('Changes you made may not be saved.')}>
          <StrengthsWeaknessesForm
            user={review?.reviewee ?? null}
            onSubmit={handleSubmit}
            initialValue={{
              strengths: normalizeArray(review?.strengths),
              weaknesses: normalizeArray(review?.weaknesses),
            }}
            isSelfReview={review?.isSelfReview || false}
          />
        </PromptProvider>
      )}
    </Box>
  );
}

export interface StrengthsWeaknessesFormData {
  strengths?: string[];
  weaknesses?: string[];
}
