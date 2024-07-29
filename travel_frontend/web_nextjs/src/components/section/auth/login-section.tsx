'use client';
// components/section/auth/login-section.tsx
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import InputField from '@/components/section/auth/input-field';
import RememberMeCheckbox from '@/components/section/auth/remember-check';
import SubmitButton from '@/components/section/auth/submit-button';
import OauthOptions from '@/components/section/auth/oauth-options';
import { loginApi, findPasswordVeriApi, findPasswordApi } from '@/services/fetch-auth';
import { useUserStore } from '@/store/userStore';
import { setCookie, getCookie, deleteCookie } from '@/libs/cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from '@/libs/utils';

interface LoginSectionProps {
  toggleForm: () => void;
  isModal?: boolean;
}

interface IFormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface IForgotPasswordInput {
  email: string;
}

interface IResetPasswordInput {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

export default function LoginSection({ toggleForm, isModal }: LoginSectionProps) {
  const { register, handleSubmit, setValue, formState: { errors: loginErrors } } = useForm<IFormInput>({ mode: 'onBlur', defaultValues: { rememberMe: true } });
  const { register: registerForgot, handleSubmit: handleSubmitForgot, formState: { errors: forgotPasswordErrors } } = useForm<IForgotPasswordInput>({ mode: 'onBlur' });
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: resetPasswordErrors } } = useForm<IResetPasswordInput>({ mode: 'onBlur' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState<string>('');

  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = getCookie('rememberEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setError(null);

    if (data.rememberMe) {
      setCookie({ name: 'rememberEmail', value: data.email, days: 7 });
    } else {
      deleteCookie('rememberEmail');
    }

    try {
      const response = await loginApi({
        email: data.email,
        password: data.password,
      });
      console.log(response);
      if (response.response) {
        const accessToken = response.result.accessToken;
        const user = jwtDecode(accessToken);
        if (user) {
          setCookie({ name: 'accessToken', value: accessToken, hours: 2, secure: true });
          setUser(user);
        }

        isModal ? router.back() : router.push('/');
      } else {
        if (response.message === '유효하지 않은 자격 증명입니다.') {
          setError(`아이디 혹은 비밀번호가 틀렸습니다.`);
        } else {
          setError(`Error: ${response.message}`);
        }
        console.error('Login failed:', response.message);
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

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleSendVerificationCode: SubmitHandler<IForgotPasswordInput> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await findPasswordVeriApi({ email: data.email });

      if (result.response) {
        setEmailForReset(data.email);
        setIsResetPassword(true);
        setIsForgotPassword(false);
      } else {
        setError(`Error: ${result.errorCode} - ${result.message}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword: SubmitHandler<IResetPasswordInput> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await findPasswordApi({
        email: data.email,
        newPassword: data.newPassword,
        verificationCode: data.verificationCode,
      });

      if (result.response) {
        setIsResetPassword(false);
        setIsForgotPassword(false);
      } else {
        setError(`Error: ${result.errorCode} - ${result.message}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <>
        <h2 className="text-center text-3xl font-bold">비밀번호 찾기</h2>
        <form onSubmit={handleSubmitForgot(handleSendVerificationCode)} className="space-y-6">
          <InputField
            label="이메일 주소"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            register={registerForgot}
            required
            error={forgotPasswordErrors.email}
          />
          <SubmitButton text="인증번호 보내기" loading={loading} />
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2"
          >
            로그인페이지로 이동
          </button>
          {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        </form>
      </>
    );
  }

  if (isResetPassword) {
    return (
      <>
        <h2 className="text-center text-3xl font-bold">비밀번호 재설정</h2>
        <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-6">
          <InputField
            label="이메일 주소"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            register={registerReset}
            required
            defaultValue={emailForReset}
            error={resetPasswordErrors.email}
          />
          <InputField
            label="인증번호"
            id="verificationCode"
            name="verificationCode"
            type="text"
            autoComplete="off"
            register={registerReset}
            required
            error={resetPasswordErrors.verificationCode}
          />
          <InputField
            label="새 비밀번호"
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            register={registerReset}
            required
            error={resetPasswordErrors.newPassword}
          />
          <InputField
            label="새 비밀번호 확인"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            register={registerReset}
            required
            error={resetPasswordErrors.confirmPassword}
          />
          <SubmitButton text="비밀번호 재설정" loading={loading} />
          <button
            type="button"
            onClick={() => setIsResetPassword(false)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2"
          >
            로그인페이지로 이동
          </button>
          {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        </form>
      </>
    );
  }

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
          data-test="loginpage-email-input"
          label="이메일 주소"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          register={register}
          required
          error={loginErrors.email}
        />
        <InputField
          data-test="loginpage-password-input"
          label="비밀번호"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          register={register}
          required
          error={loginErrors.password}
        />
        <div className="flex items-center justify-between">
          <RememberMeCheckbox register={register} />
          <button type="button" onClick={handleForgotPassword} className="font-medium text-xs sm:text-sm text-blue-600 hover:text-blue-500">
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <SubmitButton data-test="loginpage-login-btn" text="로그인하기" loading={loading} />
        {error && <p data-test="loginpage-error" className="mt-2 text-center text-red-600">{error}</p>}
        {/* <OauthOptions /> */}
      </form>
    </>
  );
}
