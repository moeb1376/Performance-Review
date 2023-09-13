import ProjectsPage from 'src/pages/projects-page/ProjectsPage';
import StrengthsWeaknessesPage from 'src/pages/strengths-weaknesses-page/StrengthsWeaknessesPage';
import React, { Suspense } from 'react';
import { Box, Container, Paper, Theme, createStyles, makeStyles } from '@material-ui/core';
import { FCProps } from 'src/shared/types/FCProps';
import { FormChangeDetector } from 'src/shared/form-change-detector';
import { FormChangePrompt } from 'src/shared/form-change-prompt';
import { FullPageSpinner } from 'src/shared/loading';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Styles } from 'src/shared/types/Styles';
import { i18n } from '@lingui/core';
import { useAuthGuardUser } from 'src/core/auth';

import CompetenciesPage from '../competencies-page/CompetenciesPage';
import { DevelopingCompetencies } from './DevelopingCompetencies';

interface Params {
  tab?: string;
}
interface OwnProps {}

type Props = FCProps<OwnProps> & StyleProps;

export default function SelfReviewPage(props: Props) {
  const classes = useStyles(props);
  const { id: revieweeId } = useAuthGuardUser();
  const toPrefix = '/self-review';
  const pathName = useLocation().pathname;
  const isCompetenciesRoute = pathName.includes('/competencies');

  return (
    <Container maxWidth="lg">
      <Box marginY={5}>
        <Paper classes={{ root: classes.tabPanelPaper }}>
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
                <Route
                  path={toPrefix + '/dominant-characteristics'}
                  children={<StrengthsWeaknessesPage revieweeId={revieweeId} />}
                />
                <Route path={toPrefix + '/competencies/:tab?'} children={<CompetenciesPage />} />
                <Route path={toPrefix + '/achievements'} children={<ProjectsPage />} />
                <Redirect to={toPrefix + '/achievements'} />
              </Switch>
            </FormChangeDetector>
          </Suspense>
        </Paper>
        {isCompetenciesRoute && (
          <Paper className={classes.paperDevelopment}>
            <DevelopingCompetencies />
          </Paper>
        )}
      </Box>
    </Container>
  );
}
const styles = (theme: Theme) =>
  createStyles({
    tabPanelPaper: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginTop: 40,
    },
    paperDevelopment: {
      marginTop: 24,
      padding: 30,
    },
  });

const useStyles = makeStyles(styles, { name: 'SelfReviewPage' });
type StyleProps = Styles<typeof styles>;
