'use client';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { register as registerUser } from '../../../redux/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { register: formRegister, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-red-800">
            Create an Account
          </h2>
          <p className="mt-2 text-md text-red-700">
            Get started for free
          </p>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border-2 border-red-500 text-lg font-medium rounded-full text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
          >
            Sign up with Google
          </button>
          <div className="flex items-center justify-center space-x-2 text-white opacity-70">
            <hr className="flex-grow border-t border-gray-400 opacity-50" />
            <span className="text-sm text-red-500">OR SIGN UP WITH</span>
            <hr className="flex-grow border-t border-gray-400 opacity-50" />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...formRegister('name')}
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 ease-in-out"
                placeholder="Full Name *"
              />
            </div>
            <div>
              <input
                {...formRegister('email')}
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 ease-in-out"
                placeholder="Email address *"
              />
            </div>
            <div>
              <input
                {...formRegister('password')}
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-1 rounded-xl  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 ease-in-out"
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
              className="group cursor-pointer relative w-full flex justify-center py-3 px-4 text-lg font-bold rounded-xl text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-black">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}