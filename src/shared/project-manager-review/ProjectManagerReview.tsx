import { i18n } from '@lingui/core';
import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import graphql from 'babel-plugin-relay/macro';
import React from 'react';
import { useFragment } from 'react-relay/hooks';
import { Evaluation } from 'src/global-types';
import { EvaluationOutput } from 'src/shared/evaluationt-output';
import { MultilineOutput } from 'src/shared/multiline-output';
import { FCProps } from 'src/shared/types/FCProps';
import { Styles } from 'src/shared/types/Styles';
import { ProjectManagerReview_review$key } from './__generated__/ProjectManagerReview_review.graphql';

interface OwnProps {
  review: ProjectManagerReview_review$key;
}

type Props = FCProps<OwnProps> & StyleProps;

export function ProjectManagerReview(props: Props) {
  const review = useFragment(fragment, props.review);
  const classes = useStyles(props);

  return (
    <ExpansionPanel
      classes={{ root: classes.expansionPanelRoot, expanded: classes.expansionPanelExpanded }}
      defaultExpanded={true}
      elevation={0}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{review.project.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className={classes.wrapper}>
          <div>
            <Typography gutterBottom>{i18n._('Performance to initial expectation')}: </Typography>
            <Box className={classes.wrapperBox}>
              {review.rating ? <EvaluationOutput value={review.rating as Evaluation} /> : <p></p>}
            </Box>
          </div>
          <div>
            <Typography gutterBottom>{i18n._('Accomplishments')}:</Typography>
            <Box className={classes.wrapperBox}>
              <MultilineOutput value={review.text || ''} />
            </Box>
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

const styles = (theme: Theme) => ({
  expansionPanelRoot: {
    '&:first-child:before': {
      display: 'none',
    },
    '&:not(:first-child):before': {
      display: 'block !important',
      opacity: '100% !important',
    },
    '&$expansionPanelExpanded': {
      margin: 0,
    },
  } as CSSProperties,
  expansionPanelExpanded: {} as CSSProperties,
  wrapper: {
    width: '100%',
    '& > *': {
      margin: theme.spacing(0, 0, 2),
    },
  } as CSSProperties,
  wrapperBox: {
    border: '1px solid ' + theme.palette.grey[400],
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
  } as CSSProperties,
});

const useStyles = makeStyles(styles, { name: 'ProjectManagerReview' });
type StyleProps = Styles<typeof styles>;

const fragment = graphql`
  fragment ProjectManagerReview_review on ProjectReviewNode {
    project {
      name
    }
    text
    rating
  }
`;

export type ProjectManagerReviewProps = Props;
