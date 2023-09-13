import React, { Fragment, Suspense } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { FormChangeDetector } from 'src/shared/form-change-detector';
import { FormChangePrompt } from 'src/shared/form-change-prompt';
import { FullPageSpinner } from 'src/shared/loading';
import { Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { TabLink } from 'src/shared/tab';
import { Tabs } from 'src/shared/tabs';
import { i18n } from '@lingui/core';

import CompetenciesForm from '../problem-solving-page/ProblemSolvingPage';
import { items } from '../self-review-page/DevelopingCompetencies';

interface Props {}
interface Params {
  tab?: string;
}

export default function CompetenciesPage(props: Props) {
  const toPrefix = '/self-review/competencies';
  const { tab } = useParams<Params>();
  const navigate = useHistory();
  const isActive = items.findIndex((item) => item.url === `/${tab}`);

  const handleNextTab = () => {
    const url = toPrefix + items[isActive + 1].url;
    navigate.push(url);
  };

  const handlePreviousTab = () => {
    const url = toPrefix + items[isActive - 1].url;
    navigate.push(url);
  };

  return (
    <Fragment>
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Tabs value={tab ?? 'problem-solving'} centered={false}>
              {items.map((item) => (
                <TabLink label={i18n._(item.title)} value={item.url.replace('/', '')} to={toPrefix + item.url} />
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
                <Switch>
                  {items.map((item) => (
                    <Route path={toPrefix + item.url} children={<CompetenciesForm title={item.title} />} />
                  ))}
                  <Redirect to={toPrefix + '/problem-solving'} />
                </Switch>
              </FormChangeDetector>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
      <Box padding={2} display={'flex'} justifyContent={'flex-end'} style={{ gap: '8px' }}>
        <Button variant="outlined" onClick={handlePreviousTab} disabled={isActive === 0}>
          قبلی
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextTab} disabled={isActive === items.length - 1}>
          بعدی
        </Button>
      </Box>
    </Fragment>
  );
}
