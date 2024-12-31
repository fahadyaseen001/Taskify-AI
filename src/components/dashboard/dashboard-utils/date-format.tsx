// date-format.ts
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // Mon, Tue, etc.
      year: 'numeric', // 2024
      month: 'short', // Jan, Feb, etc.
      day: 'numeric' // 1, 2, etc.
    });
  } catch {
    return 'Invalid Date';
  }
};