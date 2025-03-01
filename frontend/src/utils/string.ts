/**
 * Generates a random ID that's safe to use in client-side code
 */
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
