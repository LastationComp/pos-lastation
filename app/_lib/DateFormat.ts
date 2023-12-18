export const formatDate = (value: Date) => {
  return new Date(value).toLocaleString('us-US', {
    hour12: true,
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const formatDateOnly = (value: Date) => {
  return new Date(value).toLocaleDateString('us-US', {
    hour12: true,
    dateStyle: 'short',
  });
};

export const formatTimeOnly = (value: string) => {
  return new Date(value).toLocaleTimeString(['us-US'], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
