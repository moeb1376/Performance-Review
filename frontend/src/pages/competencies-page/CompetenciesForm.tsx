import graphql from 'babel-plugin-relay/macro';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { CompetenciesEvaluation } from 'src/__generated__/enums';
import { Counter } from 'src/shared/counter';
import { FormHelperText, Grid, TextField, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import { Rating } from 'react-simple-star-rating';
import { SectionGuide } from 'src/shared/section-guide';
import { i18n } from '@lingui/core';
import { useDebounce } from 'use-debounce';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { useMutation } from 'src/relay';

import { CompetenciesFormMutation } from './__generated__/CompetenciesFormMutation.graphql';
import { CompetenciesFormQuery } from './__generated__/CompetenciesFormQuery.graphql';

const query = graphql`
  query CompetenciesFormQuery {
    viewer {
      competenciesUserAnswers {
        evidence
        isTarget
        id
        rating
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
  mutation CompetenciesFormMutation($input: CompetenciesAnswersMutationInput!) {
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

const ratingNumber: Record<CompetenciesEvaluation, number> = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
  '%future added value': 0,
};

const ratingLabel: Record<number, CompetenciesEvaluation> = {
  1: 'LEVEL_1',
  2: 'LEVEL_2',
  3: 'LEVEL_3',
  4: 'LEVEL_4',
  5: 'LEVEL_5',
};

interface Props {
  title: string;
  helpText: string;
  id: string;
}

export default function CompetenciesForm(props: Props) {
  const data = useLazyLoadQuery<CompetenciesFormQuery>(query, {});
  const saveCompetenciesAnswers = useMutation<CompetenciesFormMutation>(mutation);

  const filteredData = data.viewer.competenciesUserAnswers.find((item) => item.competencies.id === props.id);

  const [value, setValue] = useState(filteredData?.evidence ?? '');
  const [debouncedValue] = useDebounce(value, 1000);

  const classes = useStyles();

  function handleRatingChange(value: number | null): void {
    if (value) {
      saveCompetenciesAnswers({
        input: {
          competenciesId: props.id,
          competenciesAnswersId: filteredData?.id,
          evidence: filteredData?.evidence ?? '',
          isTarget: filteredData?.isTarget ?? false,
          rating: ratingLabel[value],
        },
      });
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setValue(value);
    }
  };

  useEffect(() => {
    if (filteredData && debouncedValue !== filteredData.evidence) {
      saveCompetenciesAnswers({
        input: {
          competenciesId: props.id,
          competenciesAnswersId: filteredData?.id,
          evidence: debouncedValue,
          isTarget: filteredData?.isTarget ?? false,
          rating: filteredData?.rating ?? 'LEVEL_3',
        },
      });
    }
  }, [debouncedValue, filteredData, props.id, saveCompetenciesAnswers]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>{props.title}</Typography>
      </Grid>

      <Grid item xs={12}>
        <SectionGuide>
          <div dangerouslySetInnerHTML={{ __html: props.helpText ?? '' }} />
        </SectionGuide>
      </Grid>

      <Grid item xs={3}>
        <Typography variant={'body1'} style={{ marginBottom: 8 }}>
          درجه ارزیابی
        </Typography>
        <Rating initialValue={ratingNumber[filteredData?.rating ?? 'LEVEL_3']} onClick={handleRatingChange} rtl />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.root}>
          <TextField
            label={i18n._('The role of competence in activities')}
            variant="outlined"
            fullWidth
            multiline
            classes={{ root: classes.textField }}
            InputProps={{ classes: { multiline: classes.multiline } }}
            value={value}
            onChange={handleInputChange}
          />
          <Counter count={value.length} max={50} classes={{ root: classes.counter }} />
        </div>
        <FormHelperText>
          {i18n._(
            'In which of the activities that you wrote in the "Activities" section did this competence play a prominent role? (Writing the title of the activity is enough)',
          )}
        </FormHelperText>
      </Grid>
    </Grid>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    textField: {},
    multiline: {
      paddingBottom: theme.spacing(3),
    },
    counter: {
      position: 'absolute',
      right: theme.spacing(),
      bottom: 0,
    },
  });

const useStyles = makeStyles(styles, { name: 'CompetenciesForm' });
