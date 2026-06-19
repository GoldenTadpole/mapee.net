export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const day = date.getDate();

  return formatter.format(date).replace(String(day), `${day}${getOrdinalSuffix(day)}`);
}

export function formatSize(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 bytes';
  }

  const suffixes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
  const suffixIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), suffixes.length - 1);
  const formattedSize = Math.round((size / Math.pow(1024, suffixIndex)) * 10) / 10;

  return `${formattedSize} ${suffixes[suffixIndex]}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
