import { CircularProgress, makeStyles, Theme, Typography } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';
import { NumberOutput } from 'src/shared/number-output';
import { FCProps } from 'src/shared/types/FCProps';
import { Styles } from 'src/shared/types/Styles';

interface OwnProps {
  count: number;
  max: number;
}

type Props = FCProps<OwnProps> & StyleProps;

export function Counter({ count, max, ...props }: Props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.circularProgress} variant="static" size={16} value={(count * 100) / max} />
      <Typography variant="caption" className={classes.typography}>
        <NumberOutput value={count} /> / <NumberOutput value={max} />
      </Typography>
    </div>
  );
}

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  } as CSSProperties,
  circularProgress: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(0.5),
  } as CSSProperties,
  typography: {
    flip: false,
    direction: 'ltr',
  } as CSSProperties,
});

const useStyles = makeStyles(styles, { name: 'Counter' });
type StyleProps = Styles<typeof styles>;
