// components/section/auth/submit-button.tsx
import React from 'react';
import { LiaSpinnerSolid } from 'react-icons/lia';

interface SubmitButtonProps {
  text: string;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, loading }) => (
  <div>
    <button
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="submit"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center">
          <LiaSpinnerSolid className="animate-spin-slow size-5 mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        text
      )}
    </button>
  </div>
);

export default SubmitButton;
