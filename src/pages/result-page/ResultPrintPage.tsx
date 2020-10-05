import graphql from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { CriteriaResult } from 'src/shared/criteria-result';
import { FCProps } from 'src/shared/types/FCProps';
import { PageBreak } from 'src/shared/page-break';
import { PrintingContext } from 'src/shared/layouts/dashboard-layouts/PrintingContext';
import { useAuthGuardUser } from 'src/core/auth';
import { useLazyLoadQuery } from 'react-relay/hooks';

import { ProjectResultExpansionPanel } from './project-result-page/ProjectResultExpansionPanel';
import { ResultPrintPageQuery } from './__generated__/ResultPrintPageQuery.graphql';
import { StrengthsWeaknessesResult } from './strengths-weaknesses-result-page/StrengthsWeaknessesResult';

interface OwnProps {}

export type Props = FCProps<OwnProps>;

const query = graphql`
  query ResultPrintPageQuery($id: ID!) {
    viewer {
      user(id: $id) {
        personReviews {
          ...CriteriaResult_reviews
          ...StrengthsWeaknessesResult_reviews
        }
        projectReviews {
          id
          ...ProjectResultExpansionPanel_projectReview
        }
      }
    }
  }
`;

export function ResultPrintPage(props: Props) {
  const { id } = useAuthGuardUser();

  const data = useLazyLoadQuery<ResultPrintPageQuery>(query, { id });
  const reviews = data.viewer.user?.personReviews ?? [];
  const projectReviews = data.viewer.user?.projectReviews ?? [];

  useEffect(() => {
    setTimeout(() => {
      window.parent.postMessage({ action: 'print-result' }, '*');
    }, 5000);
  }, []);

  return (
    <PrintingContext.Provider value={true}>
      <Box paddingY={2}>
        <CriteriaResult reviews={reviews} />
      </Box>
      <PageBreak />
      <Box paddingY={2}>
        <StrengthsWeaknessesResult reviews={reviews} />
      </Box>
      <PageBreak />
      <Box paddingY={2}>
        {projectReviews?.map((projectReview) => (
          <ProjectResultExpansionPanel projectReview={projectReview} key={projectReview.id} />
        ))}
      </Box>
    </PrintingContext.Provider>
  );
}
