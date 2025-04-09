/**
 * Generates a random ID that's safe to use in client-side code
 */
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) return "";

  // Format giờ (12h format)
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  // Format ngày/tháng/năm
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
};