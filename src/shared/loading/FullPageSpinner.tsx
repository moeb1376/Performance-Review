import { CircularProgress, makeStyles, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import React from 'react';
import { FCProps } from 'src/shared/types/FCProps';
import { Styles } from 'src/shared/types/Styles';

interface OwnProps {
  fullHeight?: boolean;
}

type Props = FCProps<OwnProps> & StyleProps;

export function FullPageSpinner(props: Props) {
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.root, { [classes.fullHeight]: props.fullHeight })}>
      <CircularProgress />
    </div>
  );
}

const styles = (theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSProperties,
  fullHeight: {
    height: '100vh',
  },
});

const useStyles = makeStyles(styles, { name: 'FullPageSpinner' });
type StyleProps = Styles<typeof styles>;
