'use client';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { login } from '../../../redux/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { register: formRegister, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      router.push('/');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#294B69] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#16273B] rounded-3xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-[#DBE9FA]">
            Welcome Back!
          </h2>
          <p className="mt-2 text-md text-[#DBE9FA]">
            Sign in to continue your journey
          </p>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border-2 border-[#5497D4] text-lg font-medium rounded-full text-[#5497D4] hover:bg-[#5497D4] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
          >
            Sign in with Google
          </button>
          <div className="flex items-center justify-center space-x-2 text-white opacity-70">
            <hr className="flex-grow border-t border-gray-400 opacity-50" />
            <span className="text-sm">OR CONTINUE WITH</span>
            <hr className="flex-grow border-t border-gray-400 opacity-50" />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...formRegister('email')}
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-transparent placeholder-[#B9C4D3] text-[#DBE9FA] rounded-xl bg-[#203750] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 ease-in-out"
                placeholder="Email address *"
              />
            </div>
            <div>
              <input
                {...formRegister('password')}
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-transparent placeholder-[#B9C4D3] text-[#DBE9FA] rounded-xl bg-[#203750] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 ease-in-out"
                placeholder="Password *"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 text-lg font-bold rounded-xl text-white bg-[#5497D4] hover:bg-[#3C73A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-[#B9C4D3] pt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#5497D4] hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}