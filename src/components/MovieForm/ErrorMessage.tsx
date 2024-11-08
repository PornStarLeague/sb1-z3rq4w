import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <p className="font-medium">Error</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;