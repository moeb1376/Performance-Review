import React, { useContext } from 'react';
import { Forminator, LimitedTextAreaInput } from 'src/shared/forminator';
import { Grid, Typography } from '@material-ui/core';
import { MDXContext } from '@mdx-js/react';
import { Rating } from '@material-ui/lab';
import { SectionGuide } from 'src/shared/section-guide';
import { i18n } from '@lingui/core';
import { importMDX } from 'mdx.macro';

interface Props {
  title: string;
}

const DescriptionContent = importMDX.sync('./DescriptionContent.mdx');

export default function CompetenciesForm(props: Props) {
  const components = useContext(MDXContext);
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>{i18n._(props.title)}</Typography>
      </Grid>

      <Grid item xs={12}>
        <SectionGuide>
          <DescriptionContent components={components} />
        </SectionGuide>
      </Grid>

      <Forminator onSubmit={(value) => console.log(value)}>
        <Grid item xs={3}>
          <Typography variant={'body1'}>درجه ارزیابی</Typography>

          <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        </Grid>
        <Grid item xs={12}>
          <LimitedTextAreaInput label="text" variant="outlined" rows={4} maxChars={50} fullWidth />
        </Grid>
      </Forminator>
    </Grid>
  );
}
