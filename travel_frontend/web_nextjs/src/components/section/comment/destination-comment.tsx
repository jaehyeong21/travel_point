import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Camera, X } from 'lucide-react';
import Title from '@/components/common/title';
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { useUserStore } from '@/store/userStore';
import { LiaSpinnerSolid } from 'react-icons/lia';
import { createReview, getReviewsByDestination } from '@/services/fetch-review';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { uploadImageToCF } from '@/services/img-upload-to-cf';
import { Comment } from '@/types/comment-type';
import { CommentGuidelines, ImageUploadGuidelines } from '@/components/section/comment/comment-guide-lines';
import Comments from '@/components/section/comment/comments';

interface IFormInput {
  comment: string;
  image?: FileList;
}

export default function DestinationComment({ destinationId }: { destinationId: string }) {
  const { register, handleSubmit, setValue, formState: { errors }, trigger, clearErrors, reset } = useForm<IFormInput>();
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<Comment[]>([]);
  const user = useUserStore((state) => state.user);
  const { toast } = useToast();
  const router = useRouter();

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const fetchComments = useCallback(async () => {
    try {
      const response = await getReviewsByDestination(Number(destinationId));
      setComments(response.result);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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

    setLoading(true);
    const imageUrl = await uploadImageToCF(selectedImage, 'reviewPhoto');
    if (!imageUrl) {
      setSubmitError('이미지 업로드에 실패했습니다.');
      setLoading(false);
      return;
    }

    const reviewData = {
      content: data.comment,
      rate: rating,
      destinationId: Number(destinationId),
      imageUrl: imageUrl
    };

    try {
      const res = await createReview(reviewData);
      if (!res.response) return toast({
        title: '리뷰 등록 실패',
        description: '여행지 당 하나의 리뷰만 등록할 수 있습니다. 이미 등록된 리뷰가 있습니다.',
      });
      toast({
        title: '리뷰 등록 성공',
        description: '리뷰가 성공적으로 등록되었습니다.',
      });
      reset(); // 입력 필드 초기화
      setSelectedImage(null); // 이미지 첨부 초기화
      setCharCount(0); // 문자 수 초기화
      await fetchComments(); // 리뷰를 성공적으로 등록한 후 댓글 목록을 다시 가져옴
    } catch (error: any) {
      console.error('Review submission error:', error);
      setSubmitError(`리뷰 등록에 실패했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '이미지 첨부는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
        action: <ToastAction altText="Goto auth page" onClick={() => { router.push('/auth'); }}>로그인 페이지 이동</ToastAction>,
      });
      return;
    }
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('이미지는 10MB 이하로 첨부해주세요.');
        return;
      }
      setSelectedImage(file);
      setValue('image', e.target.files as FileList);
      clearErrors('image');
    }
  };

  const handleTextAreaClick = () => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '댓글 작성은 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
        action: <ToastAction altText="Goto auth page" onClick={() => { router.push('/auth'); }}>로그인 페이지 이동</ToastAction>,
      });
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setValue('image', undefined);
    clearErrors('image');
  };

  return (
    <>
      <Title className='pt-8 border-t'>여행 후기</Title>
      <div className="bg-slate-100/90 relative rounded p-4">
        <div className="flex justify-between items-center pb-2">
          <div className='flex items-center'>
            <span className='text-sm'>여행지 만족도</span>
            <div className='flex ml-2 items-center gap-x-0.5'>
              <span className='text-sm pr-0.5'>(</span>
              {[...Array(5)].map((_, index) => {
                const starIndex = index + 1;
                return (
                  <span key={index} onClick={() => handleStarClick(starIndex)} className='cursor-pointer'>
                    {starIndex <= rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-300" />}
                  </span>
                );
              })}
              <span className='text-sm pl-0.5'>)</span>
            </div>
          </div>
          <CommentGuidelines />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full'>
          <label className='size-20 float-left relative flex justify-center items-center flex-col border-slate-300 border-y border-l bg-white cursor-pointer' htmlFor='input-img'>
            <input
              id='input-img'
              type="file"
              className='hidden'
              accept="image/*"
              onChange={handleImageChange}
            />
            <Camera className='size-8' strokeWidth={1} />
            <p className='text-[10px] sm:text-xs'>이미지 첨부</p>
          </label>
          <div className='flex-grow'>
            <textarea
              {...register('comment', {
                required: '댓글은 필수 항목입니다.',
                minLength: { value: 25, message: '댓글은 최소 25글자 이상이어야 합니다.' },
                maxLength: { value: 1000, message: '댓글은 최대 1000글자까지 입력할 수 있습니다.' }
              })}
              name="comment"
              className='bg-white w-full h-full border border-slate-300 focus:border-slate-300 p-2 placeholder:text-[10px] sm:placeholder:text-sm text-sm caret-slate-500'
              placeholder='여행지의 후기를 작성해주세요.'
              onClick={handleTextAreaClick}
              onChange={(e) => {
                setCharCount(e.target.value.length);
              }}
            ></textarea>
          </div>
          <div className={`size-20 float-right flex justify-center items-center bg-[#333333]/90 ${loading? 'pointer-events-none' : 'cursor-pointer'}`}>
            {loading ? (
              <LiaSpinnerSolid className="animate-spin-slow size-5 mr-1.5 text-slate-500" />
            ) : (
              <input type="submit" value='등록' className='text-slate-50' onClick={() => trigger('comment')} />
            )}
          </div>
        </form>
        {submitError && <p className="text-red-500 text-xs mt-2 pl-1">{submitError}</p>}
        <div className='flex justify-between text-sm text-slate-600 pt-3 px-1'>
          <ImageUploadGuidelines />
          <p className='text-xs'>{charCount} / 1,000자</p>
        </div>
        {errors.comment && <p className="text-red-500 text-xs mt-2 pl-1">{errors.comment.message}</p>}
        {errors.image && <p className="text-red-500 text-xs mt-2 pl-1">{errors.image.message}</p>}
        {selectedImage && (
          <div className='flex items-center justify-between mt-2 p-2 bg-white border rounded'>
            <p className='text-sm'>{selectedImage.name}</p>
            <button type="button" onClick={removeSelectedImage} className='p-1 bg-red-500 rounded-full'>
              <X size={16} color="white" />
            </button>
          </div>
        )}
      </div>
      <Comments comments={comments} setComments={setComments} fetchComments={fetchComments} destinationId={destinationId}/>
    </>
  );
}
