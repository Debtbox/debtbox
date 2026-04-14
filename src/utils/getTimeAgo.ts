const DATE_TIME_WITHOUT_TIMEZONE_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;

type TimeAgoUnit = Intl.RelativeTimeFormatUnit;

const TIME_UNITS: Array<{ unit: TimeAgoUnit; seconds: number }> = [
  { unit: 'year', seconds: 60 * 60 * 24 * 365 },
  { unit: 'month', seconds: 60 * 60 * 24 * 30 },
  { unit: 'week', seconds: 60 * 60 * 24 * 7 },
  { unit: 'day', seconds: 60 * 60 * 24 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
];

const normalizeDateString = (dateString: string): string => {
  if (DATE_TIME_WITHOUT_TIMEZONE_REGEX.test(dateString)) {
    // Backend timestamps are treated as UTC when no timezone is provided.
    return `${dateString}Z`;
  }

  return dateString;
};

export const getTimeAgo = (dateString: string, locale = 'en'): string => {
  const parsedDate = new Date(normalizeDateString(dateString));

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.round((parsedDate.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const { unit, seconds } of TIME_UNITS) {
    if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
      const value = Math.round(diffInSeconds / seconds);
      return rtf.format(value, unit);
    }
  }

  return '';
};
