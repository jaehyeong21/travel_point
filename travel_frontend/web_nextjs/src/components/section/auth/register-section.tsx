'use client';
// components/section/auth/register-section.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import InputField from '@/components/section/auth/input-field';
import SubmitButton from '@/components/section/auth/submit-button';
import OauthOptions from '@/components/section/auth/oauth-options';
import { registerApi, registerVerificationApi } from '@/services/fetch-auth';
import { setCookie } from '@/libs/cookie';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

interface RegisterSectionProps {
  toggleForm: () => void;
  isModal?: boolean;
}

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode?: string;
}

export default function RegisterSection({ toggleForm, isModal }: RegisterSectionProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<IFormInput>({ mode: 'onBlur' });
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<string>('');
  const passwordRef = useRef<string>('');
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (isVerificationStep) {
      setValue('verificationCode', ''); // Clear the verificationCode field
    }
  }, [isVerificationStep, setValue]);

  const handleRegister: SubmitHandler<IFormInput> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      emailRef.current = data.email;
      passwordRef.current = data.password;

      const result = await registerApi({
        email: data.email,
        password: data.password,
      });

      if (result.response) {
        setIsVerificationStep(true);
      } else {
        setError(`Error: ${result.errorCode} - ${result.message}`);
        console.error('Register failed:', result.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('There was a problem with the fetch operation:', error.message);
        setError(error.message);
      } else {
        console.error('Unexpected error', error);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification: SubmitHandler<IFormInput> = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const result = await registerVerificationApi({
        email: emailRef.current,
        password: passwordRef.current,
        verificationCode: data.verificationCode!,
      });

      if (result.response) {
        const { accessToken, refreshToken } = result.result.token;
        const user = result.result.user;
        setCookie({ name: 'accessToken', value: accessToken, hours: 2, secure: true });
        setCookie({ name: 'refreshToken', value: refreshToken, days: 7, secure: true });
        setCookie({ name: 'user', value: JSON.stringify(user), hours: 2, secure: true });
        setUser(user); // Zustand 스토어에 사용자 정보 저장
        // console.log('Verification successful:', result);

        isModal ? router.back() : router.push('/');
      } else {
        setError(`Error: ${result.errorCode} - ${result.message}`);
        console.error('Verification failed:', result.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('There was a problem with the fetch operation:', error.message);
        setError(error.message);
      } else {
        console.error('Unexpected error', error);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-center text-3xl font-bold">{isVerificationStep ? '이메일 인증' : '새 계정 생성'}</h2>
      {!isVerificationStep ? (
        <>
          <p className="mt-2 text-center text-sm">
            계정이 있으신가요?
            <button className="font-medium text-blue-600 hover:text-blue-500 pl-2" onClick={toggleForm}>
              로그인하기
            </button>
          </p>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
            <InputField
              label="이메일 주소"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              register={register}
              required
              error={errors.email}
            />
            <InputField
              label="비밀번호"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              register={register}
              required
              error={errors.password}
            />
            <InputField
              label="비밀번호 확인"
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              register={register}
              required
              error={errors.confirmPassword}
              watch={watch}
            />
            <Separator />
            <SubmitButton text="회원가입" loading={loading} />
            {error && <p className="mt-2 text-center text-red-600">{error}</p>}
            <OauthOptions />
          </form>
        </>
      ) : (
        <>
          <div className='text-center text-sm'>
            <p className="mt-2">
              입력하신 이메일(<strong>{emailRef.current}</strong>)로
            </p>
            <p className=''>전송된 인증번호를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit(handleVerification)} className="space-y-6">
            <InputField
              label="이메일 인증번호"
              id="verification-code"
              name="verificationCode"
              type="text"
              autoComplete="off"
              register={register}
              required
              error={errors.verificationCode}
            />
            <Separator />
            <SubmitButton text="인증하기" loading={loading} />
            {error && <p className="mt-2 text-center text-red-600">{error}</p>}
          </form>
        </>
      )}
    </>
  );
}
