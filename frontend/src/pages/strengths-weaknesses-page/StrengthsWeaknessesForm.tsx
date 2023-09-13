import graphql from 'babel-plugin-relay/macro';
import React, { useContext, useState } from 'react';
import { ActionBar } from 'src/shared/action-bar';
import { DictInput, DictInputItem, Forminator, SubmitButton } from 'src/shared/forminator';
import { FCProps } from 'src/shared/types/FCProps';
import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import { MDXContext } from '@mdx-js/react';
import { MDXPropsProvider } from 'src/shared/mdx-provider/MDXPropsProvider';
import { SectionGuide } from 'src/shared/section-guide';
import { StickyBottomPaper } from 'src/shared/sticky-bottom-paper';
import { StrengthsOrWeaknesses } from 'src/shared/strengths-weaknesses';
import { UserType } from 'src/shared/utils/getUserLabel';
import { i18n } from '@lingui/core';
import { importMDX } from 'mdx.macro';
import { useFormDirty } from 'src/shared/form-change-detector';
import { useFragment } from 'react-relay/hooks';

import { ArrayValuePrompt } from './ArrayValuePrompt';
import { StrengthsWeaknessesFormData } from './StrengthsWeaknessesPage';
import { StrengthsWeaknessesForm_user$key } from './__generated__/StrengthsWeaknessesForm_user.graphql';
import { arrayEqual } from './utils';

const DescriptionContentSelfReview = importMDX.sync('./DescriptionContentSelfReview.mdx');
const DescriptionContentPeerReview = importMDX.sync('./DescriptionContentPeerReview.mdx');

const fragmentUserNode = graphql`
  fragment StrengthsWeaknessesForm_user on UserNode {
    id
    ...getUserLabel_user
  }
`;

interface OwnProps {
  initialValue?: StrengthsWeaknessesFormData;
  onSubmit: (data: StrengthsWeaknessesFormData) => void;
  isSelfReview: boolean;
  user: StrengthsWeaknessesForm_user$key | null;
}

type Props = FCProps<OwnProps>;

export function StrengthsWeaknessesForm(props: Props) {
  const { onSubmit, isSelfReview } = props;
  const components = useContext(MDXContext);
  const user = useFragment(fragmentUserNode, props.user);
  const dirty = useFormDirty();
  const [showGuide, setShowGuide] = useState(true);

  return (
    <Forminator onSubmit={onSubmit} initialValue={props.initialValue}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormControlLabel
            style={{ float: 'left' }}
            control={<Switch color="primary" checked={showGuide} onChange={() => setShowGuide((prv) => !prv)} />}
            label="راهنما"
          />
        </Grid>
        <DictInput>
          <DictInputItem field="weaknesses">
            <Grid item xs={showGuide ? 8 : 12}>
              <Typography variant="h3" style={{ marginBottom: 32 }}>
                {i18n._('Dominant Characteristics')}
              </Typography>

              <StrengthsOrWeaknesses
                maxLength={3}
                title={
                  isSelfReview
                    ? i18n._('The most important characteristics or behaviors I should improve in myself')
                    : i18n._('The most important characteristics or behaviors he/she should improve')
                }
                label={isSelfReview ? i18n._('What to improve') : i18n._('What should he/she improve')}
              />
              <ArrayValuePrompt value={props.initialValue?.weaknesses} equal={arrayEqual} />
            </Grid>
          </DictInputItem>
          {showGuide && (
            <Grid item xs={4}>
              <SectionGuide>
                {isSelfReview ? (
                  <DescriptionContentSelfReview components={components} />
                ) : (
                  <MDXPropsProvider<UserType | null> value={user}>
                    <DescriptionContentPeerReview components={components} />
                  </MDXPropsProvider>
                )}
              </SectionGuide>
            </Grid>
          )}
        </DictInput>
        <StickyBottomPaper>
          <ActionBar>
            <SubmitButton variant="contained" color="primary" disabled={!dirty}>
              {i18n._('Save')}
            </SubmitButton>
          </ActionBar>
        </StickyBottomPaper>
      </Grid>
    </Forminator>
  );
}
