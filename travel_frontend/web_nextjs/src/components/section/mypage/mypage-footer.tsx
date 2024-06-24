'use client';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteCookie } from '@/libs/cookie';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import InputField from '@/components/section/auth/input-field';
import { useForm, SubmitHandler } from 'react-hook-form';
import { deleteAccountApi, changePasswordApi } from '@/services/fetch-auth';
import { useToast } from '@/components/ui/use-toast';

interface IFormInput {
  password: string;
  confirmPassword: string;
}

interface IPasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function MypageFooter() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({ mode: 'onBlur' });
  const { register: registerPasswordChange, handleSubmit: handlePasswordChangeSubmit, formState: { errors: passwordChangeErrors }, watch: watchPasswordChange } = useForm<IPasswordChangeInput>({ mode: 'onBlur' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteUser: SubmitHandler<IFormInput> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await deleteAccountApi(data.password);

      if (result.response) {
        clearUser();
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('user');
        toast({
          title: "회원 탈퇴 완료",
          description: "회원 탈퇴가 성공적으로 처리되었습니다. 이용해 주셔서 감사합니다.",
        });
        router.push('/');
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

  const handlePasswordChange: SubmitHandler<IPasswordChangeInput> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setPasswordChangeError('비밀번호가 일치하지 않습니다.');
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    try {
      const result = await changePasswordApi(data.currentPassword, data.newPassword);

      if (result.response) {
        setPasswordChangeSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setDialogOpen(true);        
      } else {
        setPasswordChangeError(`Error: ${result.errorCode} - ${result.message}`);
        setDialogOpen(true); // Error 시 다이얼로그를 유지함
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPasswordChangeError(error.message);
      } else {
        setPasswordChangeError('An unexpected error occurred');
      }
      setDialogOpen(true); // Error 시 다이얼로그를 유지함
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      clearUser();
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      deleteCookie('user');
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (

    <div className='relative flex justify-between items-start max-w-4xl xl:max-w-5xl px-4 sm:px-6 xl:px-0 mx-auto mb-8'>
      <div className='flex flex-col space-y-2'>
        <AlertDialog>
          <AlertDialogTrigger asChild className='max-w-[70px]'>
            <Button variant="outline" size={'sm'}>회원 탈퇴</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말로 회원 탈퇴를 하겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                Travel-Point에서 회원 탈퇴 후에는 복구가 불가능하니 유의해 주세요.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit(handleDeleteUser)} className="space-y-6">
              <InputField
                label="비밀번호"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
              />
              {error && <p className="mt-2 text-center text-red-600">{error}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel>아니오</AlertDialogCancel>
                <Button type="submit" className='bg-red-600/80 hover:bg-red-600'>
                  {loading ? '처리 중...' : '예'}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
        <p className='absolute -bottom-6 text-xs'>탈퇴 후에는 복구가 불가능하니 유의해 주세요.</p>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild className='max-w-[96px]'>
          <Button variant="outline" size={'sm'}>비밀번호 변경</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>비밀번호 변경</AlertDialogTitle>
          </AlertDialogHeader>
          <form id="passwordChangeForm" onSubmit={handlePasswordChangeSubmit(handlePasswordChange)} className="space-y-6">
            <InputField
              label="현재 비밀번호"
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              register={registerPasswordChange}
              required
              error={passwordChangeErrors.currentPassword}
            />
            <InputField
              label="새 비밀번호"
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              register={registerPasswordChange}
              required
              error={passwordChangeErrors.newPassword}
            />
            <InputField
              label="새 비밀번호 확인"
              id="confirm-password-new"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              register={registerPasswordChange}
              required
              error={passwordChangeErrors.confirmPassword}
            />
            {passwordChangeError && <p className="mt-2 text-center text-red-600">{passwordChangeError}</p>}
            {passwordChangeSuccess && <p className="mt-2 text-center text-green-600">{passwordChangeSuccess}</p>}
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>아니오</AlertDialogCancel>
            <Button onClick={() => document.getElementById('passwordChangeForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} className='bg-red-600/80 hover:bg-red-600'>
              {loading ? '처리 중...' : '예'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild className='max-w-[70px]'>
          <Button variant="outline" size={'sm'}>로그 아웃</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 로그아웃을 하겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>아니오</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className='bg-red-600/80 hover:bg-red-600'>예</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>

  );
}
