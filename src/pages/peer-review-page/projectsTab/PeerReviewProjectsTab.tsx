import graphql from 'babel-plugin-relay/macro';
import React, { Fragment, useContext } from 'react';
import { Box, Grid } from '@material-ui/core';
import { FCProps } from 'src/shared/types/FCProps';
import { MDXContext } from '@mdx-js/react';
import { MDXPropsProvider } from 'src/shared/mdx-provider/MDXPropsProvider';
import { PromptProvider } from 'src/shared/prompt';
import { SectionGuide } from 'src/shared/section-guide';
import { UserType } from 'src/shared/utils/getUserLabel';
import { i18n } from '@lingui/core';
import { importMDX } from 'mdx.macro';
import { useFragment, useLazyLoadQuery } from 'react-relay/hooks';

import { PeerReviewProjectExpansionPanel } from './project-expansion-panel/PeerReviewProjectExpansionPanel';
import { PeerReviewProjectsResult } from './PeerReviewProjectsResult';
import { PeerReviewProjectsTabQuery } from './__generated__/PeerReviewProjectsTabQuery.graphql';
import { PeerReviewProjectsTab_user$key } from './__generated__/PeerReviewProjectsTab_user.graphql';

const Content = importMDX.sync('./Guide.mdx');

const query = graphql`
  query PeerReviewProjectsTabQuery($revieweeId: ID!) {
    viewer {
      user(id: $revieweeId) {
        ...PeerReviewProjectsTab_user
      }
    }
  }
`;

const fragment = graphql`
  fragment PeerReviewProjectsTab_user on UserNode {
    id
    ...getUserLabel_user
    projectReviews {
      id
      comments {
        ...PeerReviewProjectsForm_projectComment
      }
      ...PeerReviewProjectsResult_projectReview
      ...PeerReviewProjectExpansionPanel_projectReview
    }
    personReview {
      state
    }
  }
`;

interface OwnProps {
  revieweeId: string;
}

type Props = FCProps<OwnProps>;

export function PeerReviewProjectsTab(props: Props) {
  const { revieweeId } = props;
  const components = useContext(MDXContext);
  const data = useLazyLoadQuery<PeerReviewProjectsTabQuery>(query, { revieweeId });
  const user = useFragment<PeerReviewProjectsTab_user$key>(fragment, data.viewer.user);
  const state = user?.personReview?.state;
  const projectReviews = user?.projectReviews;

  return (
    <Fragment>
      {state === 'DONE' ? (
        <Box paddingY={2}>
          {projectReviews?.map(projectReview => (
            <PeerReviewProjectsResult projectReview={projectReview} key={projectReview.id} />
          ))}
        </Box>
      ) : (
        <Fragment>
          <Box padding={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionGuide>
                  <MDXPropsProvider<UserType | null> value={user}>
                    <Content components={components} />
                  </MDXPropsProvider>
                </SectionGuide>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <PromptProvider message={i18n._('Changes you made may not be saved.')}>
              {projectReviews?.map(projectReview => (
                <PeerReviewProjectExpansionPanel projectReview={projectReview} key={projectReview.id} />
              ))}
            </PromptProvider>
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
}
