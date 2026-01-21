import { BirthConfig } from '../types';

// User Config: 18-07-1994 05:27 Amsterdam (UTC+1 as requested)
// Note: Technically Amsterdam in July is UTC+2 (CEST), but user specified UTC+1. 
// We will construct the date strictly based on the ISO string with offset.
const BIRTH_ISO = "1994-07-18T17:27:00+01:00";
const BILLION = 1_000_000_000;

export const getBirthDate = (): Date => {
  return new Date(BIRTH_ISO);
};

export const getBillionthSecondDate = (): Date => {
  const birth = getBirthDate();
  return new Date(birth.getTime() + BILLION * 1000);
};

export const calculateSecondsAlive = (): number => {
  const now = new Date();
  const birth = getBirthDate();
  const diffInMs = now.getTime() - birth.getTime();
  return Math.floor(diffInMs / 1000);
};

export const formatFutureDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};
