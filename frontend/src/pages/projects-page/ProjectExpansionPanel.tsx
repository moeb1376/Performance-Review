import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { Box, ExpansionPanelProps, IconButton, Typography } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from 'src/shared/expansion-panel';
import { FCProps } from 'src/shared/types/FCProps';
import { FormChangeDetector, useFormDirty } from 'src/shared/form-change-detector';
import { ReviewersInputProps } from 'src/shared/reviewers-input/ReviewersInput';
import { i18n } from '@lingui/core';
import { useDialog } from 'src/shared/hooks';
import { useFragment } from 'react-relay/hooks';

import { DeleteProjectReviewMutationInput } from './__generated__/deleteProjectReviewMutation.graphql';
import { ProjectExpansionPanel_projectReview$key } from './__generated__/ProjectExpansionPanel_projectReview.graphql';
import { ProjectForm, ProjectFormData } from './ProjectForm';
import { ProjectReviewTitleModal } from './project-review-title-editor';

interface OwnProps {
  projectReview: ProjectExpansionPanel_projectReview$key;
  initialProjectIds: Set<string>;
  saveProject: (data: ProjectFormData) => void;
  deleteProject: (input: DeleteProjectReviewMutationInput) => void;
  users: ReviewersInputProps['users'];
  maximumProjectReviewers: number;
}

type Props = FCProps<OwnProps>;

export function ProjectExpansionPanel(props: Props) {
  const { initialProjectIds, saveProject, deleteProject, users, maximumProjectReviewers } = props;
  const projectReview = useFragment(fragment, props.projectReview);
  const [isExpanded, setIsExpanded] = React.useState(() => !initialProjectIds.has(projectReview.id));
  const {
    dialog: { onClose, open },
    button: { onClick },
  } = useDialog(false);

  const handleShowModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();
  };

  const handleExpanded: ExpansionPanelProps['onChange'] = (e, expanded) => {
    setIsExpanded(expanded);
  };

  const dirty = useFormDirty();
  console.log(dirty, 'dirty');
  return (
    <FormChangeDetector>
      <ExpansionPanel
        expanded={isExpanded}
        onChange={handleExpanded}
        style={{ border: '1px dashed #C9CBD1', borderRadius: '8px', margin: 0 }}
      >
        <ExpansionPanelSummary>
          {!isExpanded && (
            <Box display="flex" alignItems="center" style={{ gap: 8 }}>
              <Typography variant="h6">{projectReview.projectName}</Typography>
              {isExpanded && (
                <IconButton onClick={handleShowModal}>
                  <EditIcon />
                </IconButton>
              )}
              {dirty && (
                <Typography variant="caption" color="textSecondary">
                  ({i18n._('Your changes have not been saved')})
                </Typography>
              )}
            </Box>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ProjectForm
            maximumProjectReviewers={maximumProjectReviewers}
            onSubmit={saveProject}
            onDelete={deleteProject}
            projectReview={projectReview}
            users={users}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ProjectReviewTitleModal open={open} onClose={onClose} projectReview={projectReview} />
    </FormChangeDetector>
  );
}

const fragment = graphql`
  fragment ProjectExpansionPanel_projectReview on ProjectReviewNode {
    id
    projectName
    consultedWithManager
    ...ProjectForm_projectReview
    ...ProjectReviewEditForm_projectReview
  }
`;