import HelpIcon from '@material-ui/icons/HelpOutline';
import React from 'react';
import { Box, Grid, Theme, createStyles, makeStyles } from '@material-ui/core';
import { FCProps } from 'src/shared/types/FCProps';
import { Styles } from 'src/shared/types/Styles';

interface OwnProps {}

type Props = FCProps<OwnProps> & StyleProps;

export function SectionGuide(props: Props) {
  const { children } = props;
  const classes = useStyles(props);

  return (
    <Box className={classes.root} displayPrint="none">
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <HelpIcon color="primary" fontSize="large" />
        </Grid>
        <Grid item xs>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#EDEDED',
      borderRadius: theme.spacing(1.5),

      padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
      position: 'sticky',
      top: '60px',
      '@media print': {
        pageBreakInside: 'avoid',
      },
    },
  });

const useStyles = makeStyles(styles, { name: 'SectionGuide' });
type StyleProps = Styles<typeof styles>;