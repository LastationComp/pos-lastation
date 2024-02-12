export const formatDate = (value: Date) => {
  return new Date(value).toLocaleString('us-US', {
    hour12: true,
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  });
};

export const formatDateOnly = (value: Date) => {
  return new Date(value).toLocaleDateString('us-US', {
    hour12: true,
    dateStyle: 'short',
    timeZone: 'Asia/Jakarta',
  });
};

export const formatTimeOnly = (value: string) => {
  return new Date(value).toLocaleTimeString(['us-US'], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Jakarta',
  });
};

export const formatDateNowWithRegion = (region: string) => {
  return new Date(
    new Date().toLocaleString([], {
      timeZone: region,
    })
  );
};
