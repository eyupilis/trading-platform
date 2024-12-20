export const formatCurrency = (value, currency = 'USD', minimumFractionDigits = 2) => {
  if (typeof value !== 'number') {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 8,
  }).format(value);
};

export const formatPercentage = (value, minimumFractionDigits = 2) => {
  if (typeof value !== 'number') {
    return '-';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(minimumFractionDigits)}%`;
};

export const formatNumber = (value, minimumFractionDigits = 0) => {
  if (typeof value !== 'number') {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: 8,
  }).format(value);
};
