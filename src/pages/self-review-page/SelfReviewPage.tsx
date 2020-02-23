import { i18n } from '@lingui/core';
import { Box, Container, makeStyles, Paper, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useAuthGuardUser } from 'src/core/auth';
import CriteriaPage from 'src/pages/criteria-page/CriteriaPage';
import ProjectsPage from 'src/pages/projects-page/ProjectsPage';
import StrengthsWeaknessesPage from 'src/pages/strengths-weaknesses-page/StrengthsWeaknessesPage';
import { FullPageSpinner } from 'src/shared/loading';
import { TabLink } from 'src/shared/tab';
import { Tabs } from 'src/shared/tabs';
import { FCProps } from 'src/shared/types/FCProps';
import { Styles } from 'src/shared/types/Styles';

interface Params {
  tab?: string;
}
interface OwnProps {}

type Props = FCProps<OwnProps> & StyleProps;

export default function SelfReviewPage(props: Props) {
  const classes = useStyles(props);
  const { tab } = useParams<Params>();
  const { id: revieweeId } = useAuthGuardUser();

  const toPrefix = '/self-review';

  return (
    <Container maxWidth="md">
      <Box marginY={5}>
        <Paper classes={{ root: classes.tabsPaper }}>
          <Tabs value={tab ?? 'performance-competencies'}>
            <TabLink
              label={i18n._('Performance Competencies')}
              value="performance-competencies"
              to={toPrefix + '/performance-competencies'}
            />
            <TabLink
              label={i18n._('Dominant Characteristics')}
              value="dominant-characteristics"
              to={toPrefix + '/dominant-characteristics'}
            />
            <TabLink label={i18n._('Achievements')} value="achievements" to={toPrefix + '/achievements'} />
          </Tabs>
        </Paper>
        <Paper classes={{ root: classes.tabPanelPaper }}>
          <Suspense
            fallback={
              <Box height={200}>
                <FullPageSpinner />
              </Box>
            }
          >
            <Switch>
              <Route
                path={toPrefix + '/performance-competencies'}
                children={<CriteriaPage revieweeId={revieweeId} />}
              />
              <Route
                path={toPrefix + '/dominant-characteristics'}
                children={<StrengthsWeaknessesPage revieweeId={revieweeId} />}
              />
              <Route path={toPrefix + '/achievements'} children={<ProjectsPage />} />
              <Redirect to={toPrefix + '/performance-competencies'} />
            </Switch>
          </Suspense>
        </Paper>
      </Box>
    </Container>
  );
}
const styles = (theme: Theme) => ({
  tabsPaper: {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar - 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  } as CSSProperties,
  tabPanelPaper: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  } as CSSProperties,
});

const useStyles = makeStyles(styles, { name: 'SelfReviewPage' });
type StyleProps = Styles<typeof styles>;
