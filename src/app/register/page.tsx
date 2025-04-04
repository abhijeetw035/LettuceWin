"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Github, Mail, Loader2, User } from "lucide-react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Form validation schema - now with username
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Generate stable particle data outside component
const createParticles = (count) => {
  return Array.from({ length: count }).map(() => ({
    size: Math.random() * 8 + 2,
    initialX: `${Math.random() * -10000}%`,
    initialY: `${Math.random() * -10000}%`,
    targetX: `${Math.random() * 10000}%`,
    targetY: `${Math.random() * 2000}%`,
    opacity: Math.random() * 0.5 + 0.2,
    duration: Math.random() * 60 + 10,
  }));
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    username: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const router = useRouter();

  // Generate particles just once when component mounts
  const [particles] = useState(() => createParticles(40));

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setAuthError("");
    
    try {
      // Here you would make an API call to register the user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // If registration is successful, automatically log in the user
      const loginRes = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });
      
      if (loginRes?.error) {
        // Registration worked but login failed
        setAuthError("Account created! Please login with your credentials.");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Both registration and login were successful
        router.push('/');
        router.refresh();
      }
    } catch (error : any) {
      console.error("Registration failed:", error);
      setAuthError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for social logins
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error: any) { // Add type annotation
      console.error(`${provider} sign in failed:`, error);
      setAuthError(`Failed to authenticate with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden mt-18 mb-60">
      
      {/* Fixed floating particles effect */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 blur-[1px] "
          style={{
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.initialY, particle.targetY],
            x: [particle.initialX, particle.targetX],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <Link href="/" className="block mb-8 text-center">
          <motion.div 
            className="inline-block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            
          </motion.div>
        </Link>

        {/* Sign in card */}
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow-xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.1,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="p-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-slate-300 mb-8">Sign up to start your interview preparation</p>

            {/* Display auth errors */}error' is of type 'unknown • .
            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-md mb-6">
                {authError}
              </div>
            )}

            {/* Social sign-in options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                type="button"
                onClick={() => handleSocialLogin('github')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 transition-colors rounded-lg border border-white/10 text-white"
                disabled={isLoading}
              >
                <Github size={18} />
                <span>GitHub</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleSocialLogin('google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 transition-colors rounded-lg border border-white/10 text-white"
                disabled={isLoading}
              >
                <Mail size={18} />
                <span>Google</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-grow"></div>
              <span className="text-slate-400 text-sm">or continue with</span>
              <div className="h-px bg-white/10 flex-grow"></div>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field - newly added */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <motion.div 
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    <User size={16} className="text-slate-400" />
                  </motion.div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourname"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <motion.div 
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    <Mail size={16} className="text-slate-400" />
                  </motion.div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="•••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="agree-terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeTerms", checked === true)}
                  className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  disabled={isLoading}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-slate-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-400 text-xs mt-1">{errors.agreeTerms}</p>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> 
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-8 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border-t border-white/5 flex justify-center"
          >
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}