// components/section/auth/input-field.tsx
import { UseFormRegister, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  register: UseFormRegister<any>;
  required: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  watch?: (name: string) => string; // watch 함수 추가
}

export default function InputField({ label, id, name, type, autoComplete, register, required, error, watch }: InputFieldProps) {
  let validationRules: Record<string, any> = { required: `${name} 값을 입력해주세요.` };

  if (name === 'email') {
    validationRules = { ...validationRules, maxLength: { value: 35, message: '이메일은 최대 35글자까지 가능합니다.' } };
  } else if (name === 'password') {
    validationRules = {
      ...validationRules,
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()-+=]).{8,}$/,
        message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.',
      },
    };
  } else if (name === 'confirmPassword' && watch) {
    validationRules = { ...validationRules, validate: (value: string) => value === watch('password') || '비밀번호가 일치하지 않습니다.' };
  }

  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <div className="mt-1">
        <input
          autoComplete={autoComplete}
          className={`appearance-none block z-10 w-full px-3 py-2 border ${error ? 'border-red-400' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500/90 focus:border-blue-500/90 sm:text-sm`}
          id={id}
          type={type}
          required={required}
          {...register(name, validationRules)}
        />
        {error && <p className="text-red-600 text-xs pt-2">{String(error.message)}</p>}
      </div>
    </div>
  );
}
