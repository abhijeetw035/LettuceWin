import SignInForm from '@/components/auth/SignInForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto py-8">
      <SignInForm />
    </div>
  );
}

