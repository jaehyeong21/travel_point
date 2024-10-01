// components/section/auth/login-section.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import InputField from '@/components/section/auth/input-field';
import RememberMeCheckbox from '@/components/section/auth/remember-check';
import SubmitButton from '@/components/section/auth/submit-button';
import ForgotPasswordLink from '@/components/section/auth/forget-password';
import OauthOptions from '@/components/section/auth/oauth-options';
import { loginApi } from '@/services/fetch-auth';

interface LoginSectionProps {
  toggleForm: () => void;
}

interface IFormInput {
  email: string;
  password: string;
}

export default function LoginSection({ toggleForm }: LoginSectionProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result = await loginApi({
        email: data.email,
        password: data.password,
      });
      
      console.log('Success:', result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <>
      <h2 className="text-center text-3xl font-bold">계정에 로그인</h2>
      <p className="mt-2 text-center text-sm">
        또는
        <button className="font-medium text-blue-600 hover:text-blue-500 pl-2" onClick={toggleForm}>
          새로운 계정 등록
        </button>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="이메일 주소"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          register={register}
          required
          error={errors.email as FieldError}
        />
        <InputField
          label="비밀번호"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          register={register}
          required
          error={errors.password as FieldError}
        />
        <div className="flex items-center justify-between">
          <RememberMeCheckbox register={register} />
          <ForgotPasswordLink />
        </div>
        <SubmitButton text="로그인하기" />
        <OauthOptions />
      </form>
    </>
  );
}
