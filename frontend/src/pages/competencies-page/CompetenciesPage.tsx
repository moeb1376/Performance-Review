import graphql from 'babel-plugin-relay/macro';
import React, { Fragment, Suspense, useState } from 'react';
import { Box, Button, Grid, Tab, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import { FormChangeDetector } from 'src/shared/form-change-detector';
import { FormChangePrompt } from 'src/shared/form-change-prompt';
import { FullPageSpinner } from 'src/shared/loading';
import { Tabs } from 'src/shared/tabs';
import { i18n } from '@lingui/core';
import { useLazyLoadQuery } from 'react-relay/hooks';

import CompetenciesForm from './CompetenciesForm';
import { CompetenciesPageQuery } from './__generated__/CompetenciesPageQuery.graphql';

const query = graphql`
  query CompetenciesPageQuery {
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

export default function CompetenciesPage(props: Props) {
  const data = useLazyLoadQuery<CompetenciesPageQuery>(query, {});

  const [tab, setTab] = useState(() => data.viewer.competencies[0].id);

  const classes = useStyles();

  const currentTabIndex = data.viewer.competencies.findIndex((item) => item.id === tab);
  const currentData = data.viewer.competencies[currentTabIndex];

  const handleNextTab = () => {
    if (data.viewer.competencies.length > currentTabIndex) {
      setTab(data.viewer.competencies[currentTabIndex + 1].id);
    }
  };

  const handlePreviousTab = () => {
    if (currentTabIndex > 0) {
      setTab(data.viewer.competencies[currentTabIndex - 1].id);
    }
  };

  const handleTabClick = (id: string) => (e: any) => {
    setTab(id);
  };

  return (
    <Fragment>
      <Box>
        <Grid container spacing={4} style={{ padding: 12 }}>
          <Grid item xs={12}>
            <Typography variant="h5" style={{ marginRight: 6 }}>
              {i18n._('Competencies')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Tabs value={tab} centered={false}>
              {data.viewer.competencies.map((item) => (
                <Tab
                  className={classes.tab}
                  key={item.id}
                  label={i18n._(item.name)}
                  value={item.id}
                  onClick={handleTabClick(item.id)}
                />
              ))}
            </Tabs>
          </Grid>

          <Grid item xs={12} style={{ padding: 32 }}>
            <Suspense
              fallback={
                <Box height={200}>
                  <FullPageSpinner />
                </Box>
              }
            >
              <FormChangeDetector>
                <FormChangePrompt message={i18n._('Changes you made may not be saved.')} />
                {currentData ? (
                  <CompetenciesForm
                    key={tab}
                    title={currentData.name}
                    helpText={currentData.helpText}
                    id={currentData.id}
                  />
                ) : null}
              </FormChangeDetector>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
      <Box padding={4} display={'flex'} justifyContent={'flex-end'} style={{ gap: '8px' }}>
        <Button variant="outlined" onClick={handlePreviousTab} disabled={currentTabIndex === 0}>
          قبلی
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextTab}
          disabled={currentTabIndex === data.viewer.competencies.length - 1}
        >
          بعدی
        </Button>
      </Box>
    </Fragment>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    tab: {
      padding: '7px 10px',
      minWidth: 'auto',
      marginInline: '8px',
    },
  });

const useStyles = makeStyles(styles, { name: 'CompetenciesPage' });
