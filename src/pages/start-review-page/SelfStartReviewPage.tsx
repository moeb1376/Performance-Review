import { Box, Container } from '@material-ui/core';
import { importMDX } from 'mdx.macro';
import React from 'react';
import { StartReviewCard } from 'src/pages/start-review-page/StartReviewCard';
import { FCProps } from 'src/shared/types/FCProps';

const Content = importMDX.sync('./SelfStartReviewContent.mdx');

interface OwnProps {}

type Props = FCProps<OwnProps>;

export default function SelfStartReviewPage(props: Props) {
  return (
    <Container maxWidth="md">
      <Box marginTop={15}>
        <StartReviewCard Content={Content} />
      </Box>
    </Container>
  );
}
