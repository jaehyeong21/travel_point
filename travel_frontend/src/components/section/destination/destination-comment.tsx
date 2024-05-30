import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Camera, X } from 'lucide-react';
import Title from '@/components/common/title';
import StarSetting from '@/components/common/star-setting';
import Comments from '@/components/section/destination/comments';
import { CommentGuidelines, ImageUploadGuidelines } from '@/components/section/destination/comment-guide-lines';

interface IFormInput {
  comment: string;
  image?: FileList;
}

export default function DestinationComment() {
  const { register, handleSubmit, setValue, formState: { errors }, trigger, clearErrors } = useForm<IFormInput>();
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setSubmitError(null);

    if (!selectedImage) {
      setSubmitError('사진을 첨부해주세요.');
      return;
    }

    if (data.comment.length < 25) {
      setSubmitError('댓글은 최소 25글자 이상이어야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('comment', data.comment);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    // API 작성해야됨 나중에.
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Comment submitted successfully');
      // Handle success case
    } else {
      console.log('Failed to submit comment');
      // Handle failure case
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      setValue('image', e.target.files as FileList);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setValue('image', undefined);
    clearErrors('image');
  };

  return (
    <>
      <Title className='pt-8'>여행 후기</Title>
      <div className="bg-slate-100/90 relative rounded p-4 sm:mt-8">
        <div className="flex justify-between items-center pb-2">
          <StarSetting />
          <CommentGuidelines />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full'>
          <label className='size-20 float-left relative flex justify-center items-center flex-col border-slate-300 border-y border-l bg-white' htmlFor='input-img'>
            <input
              id='input-img'
              type="file"
              className='hidden'
              accept="image/*"
              {...register('image', {
                validate: {
                  size: value => !value || value[0].size < 10 * 1024 * 1024 || '이미지는 10MB 이하로 첨부해주세요.',
                },
              })}
              onChange={handleImageChange}
            />
            <Camera className='size-8' strokeWidth={1} />
            <p className='text-[10px] sm:text-xs'>이미지 첨부</p>
          </label>
          <div className='flex-grow'>
            <textarea
              {...register('comment', { 
                required: true, 
                minLength: { value: 25, message: '댓글은 최소 25글자 이상이어야 합니다.' }, 
                maxLength: 1000 
              })}
              name="comment"
              className='bg-white w-full h-full border border-slate-300 focus:border-slate-300 p-2 placeholder:text-[10px] sm:placeholder:text-sm text-sm caret-slate-500'
              placeholder='여행지의 후기를 작성해주세요.'
              onChange={(e) => {
                setCharCount(e.target.value.length);
              }}
            ></textarea>            
          </div>
          <div className='size-20 float-right flex justify-center items-center bg-[#333333]/90'>
            <input type="submit" value='등록' className='text-slate-50' onClick={() => trigger('comment')} />
          </div>
        </form>
        {submitError && <p className="text-red-500 text-xs mt-2">{submitError}</p>}
        <div className='flex justify-between text-sm text-slate-600 pt-3 px-1'>          
          <ImageUploadGuidelines />
          <p className='text-xs'>{charCount} / 1,000자</p>
        </div>
        {errors.comment && <p className="text-red-500 text-xs">{errors.comment.message}</p>}
        {selectedImage && (
          <div className='flex items-center justify-between mt-2 p-2 bg-white border rounded'>
            <p className='text-sm'>{selectedImage.name}</p>
            <button type="button" onClick={removeSelectedImage} className='p-1 bg-red-500 rounded-full'>
              <X size={16} color="white" />
            </button>
          </div>
        )}
      </div>      
      <Comments/>
    </>
  );
}
