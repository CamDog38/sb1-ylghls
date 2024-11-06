import toast from 'react-hot-toast';

export const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);

  // Extract error message
  const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';

  // Show toast notification
  toast.error(message);

  // Return error for further handling if needed
  return error;
};