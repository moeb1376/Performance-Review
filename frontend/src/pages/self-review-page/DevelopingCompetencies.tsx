import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { Grid, Typography } from '@material-ui/core';
import { i18n } from '@lingui/core';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { CompetenciesMultipleChoice } from './CompetenciesMultipleChoice';
import { DevelopingCompetenciesQuery } from './__generated__/DevelopingCompetenciesQuery.graphql';

const query = graphql`
  query DevelopingCompetenciesQuery {
    viewer {
      competencies {
        name
        helpText
        id
      }
    }
  }
`;

interface Props {}

export const DevelopingCompetencies = (props: Props) => {
  const data = useLazyLoadQuery<DevelopingCompetenciesQuery>(query, {});

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">{i18n._('Growth goals')}</Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 8, marginBottom: 30 }}>
        <Typography variant="body1">
          {i18n._('از بین شایستگی‌ها برای سال آتی، فقط ۲ تا رو که میخای در اونها پیشرفت کنی انتخاب کن')}
        </Typography>
      </Grid>
      <CompetenciesMultipleChoice competencies={data.viewer.competencies} />
    </Grid>
  );
};
