export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};
