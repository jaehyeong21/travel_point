// components/section/auth/remember-check.tsx
import { UseFormRegister } from 'react-hook-form';

interface RememberMeCheckboxProps {
  register: UseFormRegister<any>;
}

export default function RememberMeCheckbox({ register }: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        id="remember-me"
        type="checkbox"
        {...register("rememberMe")}
      />
      <label className="ml-2 block text-sm text-gray-900" htmlFor="remember-me">
        기억하기
      </label>
    </div>
  );
}
