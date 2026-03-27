export function formatDate(value: string): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatMeterValue(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(4);
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.');
    const numericValue = Number(normalized);

    if (normalized.trim() !== '' && Number.isFinite(numericValue)) {
      return numericValue.toFixed(4);
    }

    return value;
  }

  return String(value);
}

export function formatInitialValues(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatMeterValue(item)).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return formatMeterValue(value);
}
