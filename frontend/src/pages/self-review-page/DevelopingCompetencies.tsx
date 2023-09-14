import React, { useCallback, useState } from 'react';
import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import { i18n } from '@lingui/core';

interface Props {}

export const DevelopingCompetencies = (props: Props) => {
  const [state, setState] = useState<any[]>([]);

  const handleChangeState = useCallback((item: typeof items[0]) => {
    setState((prv) => {
      const copyPrv = [...prv];

      if (!!wIsMyValue(item.id, prv)) return copyPrv.filter((itm) => itm.id !== item.id);

      copyPrv.push(item);

      if (copyPrv.length > 2) copyPrv.shift();

      return copyPrv;
    });
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">{i18n._('Projects')}</Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 8, marginBottom: 30 }}>
        <Typography variant="body1">
          {i18n._('از بین شایستگی‌ها برای سال آتی، فقط ۲ تا رو که میخای در اونها پیشرفت کنی انتخاب کن')}
        </Typography>
      </Grid>
      {items.map((item) => (
        <Grid item xs={4}>
          <FormControlLabel
            value={!!wIsMyValue(item.id, state)}
            checked={!!wIsMyValue(item.id, state)}
            onChange={() => handleChangeState(item)}
            control={<Checkbox />}
            label={item.title}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export const items = [
  { id: '1', title: 'حل مساله', url: '/problem-solving' },
  { id: '2', title: 'تصمیم‌گیری و قضاوت', url: '/deciding-and-judgment' },
  { id: '3', title: 'رهبری', url: '/leadership' },
  { id: '4', title: 'برنامه‌ریزی و سازمان‌دهی', url: '/planing-and-organizing' },
  { id: '5', title: 'کار تیمی و مهارت‌های بین فردی', url: '/teamwork-and-individual-skill' },
  { id: '6', title: 'مدیریت خود', url: '/self-management' },
  { id: '7', title: 'دانش تخصصی و بهبود مستمر', url: '/expertise-and-continuous-improvement' },
  { id: '8', title: 'مالکیت و مسئولیت پذیری', url: '/ownership-and-responsibility' },
];

const wIsMyValue = (id: string, data: any[]) => data.filter((item) => item.id === id)[0];
