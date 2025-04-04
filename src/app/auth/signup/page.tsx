// 9. Create signup page - /src/app/auth/signup/page.tsx
import SignUpForm from '@/components/auth/SignUpForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="container mx-auto py-8">
      <SignUpForm />
    </div>
  );
}