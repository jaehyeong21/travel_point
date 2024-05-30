// auth-form.tsx
'use client';
import { UseFormRegister } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Separator } from '@/components/ui/separator';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  register: UseFormRegister<any>;
  required: boolean;
}

const AuthForm = () => {
  const { isRegister, toggleForm } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const url = isRegister ?
      process.env.NEXT_PUBLIC_REGISTER_URL
      : process.env.NEXT_PUBLIC_LOGIN_URL;
    if (!url) { throw new Error('URL is not defined'); }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {isRegister ? (
        <>
          <h2 className="text-center text-3xl font-bold">새 계정 생성</h2>
          <p className="mt-2 text-center text-sm">
            계정이 있으신가요?
            <button className="font-medium text-blue-600 hover:text-blue-500 pl-2" onClick={toggleForm}>
              로그인하기
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-center text-3xl font-bold">계정에 로그인</h2>
          <p className="mt-2 text-center text-sm">
            또는
            <button className="font-medium text-blue-600 hover:text-blue-500 pl-2" onClick={toggleForm}>
              새로운 계정 등록
            </button>
          </p>
        </>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isRegister ? (
          <>
            <InputField label="이메일 주소" id="email" name="email" type="email" autoComplete="email" register={register} required />
            <InputField label="이메일 인증 번호" id="phone" name="phone" type="tel" autoComplete="tel" register={register} required />
            <InputField label="비밀번호" id="password" name="password" type="password" autoComplete="new-password" register={register} required />
            <InputField label="비밀번호 확인" id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" register={register} required />
            <Separator />
            <SubmitButton text="등록하고 로그인하기" />
          </>
        ) : (
          <>
            <InputField label="이메일 주소" id="email" name="email" type="email" autoComplete="email" register={register} required />
            <InputField label="비밀번호" id="password" name="password" type="password" autoComplete="current-password" register={register} required />
            <div className="flex items-center justify-between">
              <RememberMeCheckbox />
              <ForgotPasswordLink />
            </div>
            <SubmitButton text="로그인하기" />
          </>
        )}
        <OauthOptions />
      </form>
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({ label, id, name, type, autoComplete, register, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
    </label>
    <div className="mt-1">
      <input
        autoComplete={autoComplete}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        id={id}
        type={type}
        {...register(name, { required })}
      />
    </div>
  </div>
);

const RememberMeCheckbox = () => (
  <div className="flex items-center">
    <input
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      id="remember-me"
      name="remember-me"
      type="checkbox"
    />
    <label className="ml-2 block text-sm text-gray-900" htmlFor="remember-me">
      기억하기
    </label>
  </div>
);

const ForgotPasswordLink = () => (
  <div className="text-sm">
    <a className="font-medium text-blue-600 hover:text-blue-500" href="#">
      비밀번호를 잊으셨나요?
    </a>
  </div>
);

const SubmitButton = ({ text }: { text: string }) => (
  <div>
    <button
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      type="submit"
    >
      {text}
    </button>
  </div>
);

const OauthOptions = () => (
  <>
    <div className="flex items-center">
      <div className="flex-grow border-t border-gray-300" />
      <span className="flex-shrink mx-4 text-gray-500">또는 다음으로 계속</span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <SocialLoginButton provider="Naver" />
      <SocialLoginButton provider="Google" />
    </div>
  </>
);

const SocialLoginButton = ({ provider }: { provider: 'Naver' | 'Google' }) => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(encodeURIComponent(window.location.href));
    }
  }, []);

  const oauthUrl =
    provider === 'Naver'
      ? `${process.env.NEXT_PUBLIC_OAUTH_NAVER_URL}?redirect_uri=${currentUrl}`
      : `${process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL}?redirect_uri=${currentUrl}`;

  return (
    <a href={oauthUrl} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none">
      <div className={`${provider === 'Naver' ? 'size-[22px]' : 'size-5'} mr-2`}>
        {provider === 'Naver' ? (
          <svg viewBox="-32 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#3aa678">
            <path fill="#03CB5C" d="M16 32C11.8333 32 8.125 33.5833 4.875 36.75C1.625 39.9167 0 43.6667 0 48V464C0 468.333 1.625 472.083 4.875 475.25C8.125 478.417 11.8333 480 16 480H432C436.167 480 439.875 478.417 443.125 475.25C446.375 472.083 448 468.333 448 464V48C448 43.6667 446.375 39.9167 443.125 36.75C439.875 33.5833 436.167 32 432 32H16ZM100.25 144H186.5L261.5 256V144H347.75V368H261.5L186.5 256V368H100.25V144Z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" id="google">
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
          </svg>
        )}
      </div>
      <span className="pb-0.5">{provider}</span>
    </a>
  );
};

export default AuthForm;
