import { ClerkProvider, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// ClerkProvider wrapper component
export function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  );
}

// Sign In component
export function SignInComponent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </button>
          </p>
        </div>
        <div className="mt-8">
          <SignIn 
            routing="hash"
            signUpUrl="/signup"
            afterSignInUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-normal',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Sign Up component
export function SignUpComponent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/signin')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </button>
          </p>
        </div>
        <div className="mt-8">
          <SignUp 
            routing="hash"
            signInUrl="/signin"
            afterSignUpUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-normal',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// User Button component for navigation
export function UserButtonComponent() {
  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: 'w-8 h-8',
        }
      }}
    />
  );
}

// Hook to get current user
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id,
    userEmail: user?.emailAddresses?.[0]?.emailAddress,
    userName: user?.fullName || user?.firstName,
  };
}
