import graphql from 'babel-plugin-relay/macro';
import React, { useCallback, useState } from 'react';
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { useMutation } from 'src/relay';

import { CompetenciesMultipleChoiceMutation } from './__generated__/CompetenciesMultipleChoiceMutation.graphql';
import { CompetenciesMultipleChoiceQuery } from './__generated__/CompetenciesMultipleChoiceQuery.graphql';
import { DevelopingCompetenciesQueryResponse } from './__generated__/DevelopingCompetenciesQuery.graphql';

const query = graphql`
  query CompetenciesMultipleChoiceQuery {
    viewer {
      competenciesUserAnswers {
        isTarget
        rating
        evidence
        id
        competencies {
          name
          helpText
          id
        }
      }
    }
  }
`;

const mutation = graphql`
  mutation CompetenciesMultipleChoiceMutation($input: CompetenciesAnswersMutationInput!) {
    competenciesAnswers(input: $input) {
      competenciesAnswers {
        evidence
        isTarget
        id
        rating
      }
    }
  }
`;

type Competencies = DevelopingCompetenciesQueryResponse['viewer']['competencies'];

interface Props {
  competencies: Competencies;
}

export const CompetenciesMultipleChoice = (props: Props) => {
  const data = useLazyLoadQuery<CompetenciesMultipleChoiceQuery>(query, {});
  const saveCompetenciesAnswers = useMutation<CompetenciesMultipleChoiceMutation>(mutation);

  const [state, setState] = useState<Competencies>(() =>
    data.viewer.competenciesUserAnswers.filter((item) => item.isTarget).map((item) => item.competencies),
  );

  const handleChangeState = useCallback(
    (item: Competencies[0], checked: boolean) => {
      setState((prv) => {
        const copyPrv = [...prv];

        const answer = data.viewer.competenciesUserAnswers.find((itm) => itm.competencies.id === item.id);

        if (!checked) {
          saveCompetenciesAnswers({
            input: {
              competenciesId: item.id,
              isTarget: false,
              competenciesAnswersId: answer?.id,
              evidence: answer?.evidence,
              rating: answer?.rating,
            },
          });
          return copyPrv.filter((itm) => itm.id !== item.id);
        }

        copyPrv.push(item);

        if (copyPrv.length > 2) {
          const removedItem = copyPrv.shift();
          console.log(removedItem);

          if (removedItem) {
            const removedItemAnswer = data.viewer.competenciesUserAnswers.find(
              (itm) => itm.competencies.id === removedItem.id,
            );
            saveCompetenciesAnswers({
              input: {
                competenciesId: removedItem.id,
                isTarget: false,
                competenciesAnswersId: removedItemAnswer?.id,
                evidence: removedItemAnswer?.evidence,
                rating: removedItemAnswer?.rating,
              },
            });
          }
        }

        saveCompetenciesAnswers({
          input: {
            competenciesId: item.id,
            isTarget: true,
            competenciesAnswersId: answer?.id,
            evidence: answer?.evidence ?? '',
            rating: answer?.rating ?? 'LEVEL_3',
          },
        });

        console.log(copyPrv);

        return copyPrv;
      });
    },
    [data.viewer.competenciesUserAnswers, saveCompetenciesAnswers],
  );

  return (
    <React.Fragment>
      {props.competencies.map((item) => (
        <Grid key={item.id} item xs={4}>
          <FormControlLabel
            value={!!wIsMyValue(item.id, state)}
            checked={!!wIsMyValue(item.id, state)}
            onChange={(_, checked) => handleChangeState(item, checked)}
            control={<Checkbox />}
            label={item.name}
          />
        </Grid>
      ))}
    </React.Fragment>
  );
};

const wIsMyValue = (id: string, data: Competencies) => data.filter((item) => item.id === id)[0];
