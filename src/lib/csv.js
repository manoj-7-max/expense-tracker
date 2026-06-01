export function exportTransactionsCsv(transactions) {
  const headers = ['type', 'amount', 'category', 'note', 'date'];
  const rows = transactions.map((item) =>
    headers.map((header) => `"${String(item[header] ?? '').replaceAll('"', '""')}"`).join(','),
  );
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
