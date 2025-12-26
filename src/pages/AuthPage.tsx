import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from '@/lib/supabaseService';

const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthPageProps {
  mode: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const isLogin = mode === 'login';

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
        toast({
          title: 'Bienvenido',
          description: 'Sesión iniciada correctamente',
        });
        navigate('/');
      } else {
        const registerData = data as RegisterFormData;
        await signUp(registerData.email, registerData.password, registerData.name);
        toast({
          title: '¡Cuenta creada!',
          description: 'Por favor revisa tu email para confirmar tu cuenta y poder acceder.',
          duration: 6000,
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: 'Error',
        description: 'Ingresa tu email',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: 'Email enviado',
        description: 'Revisa tu correo para restablecer tu contraseña',
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar el email',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="/Logo Spendary.png" 
              alt="Spendary Logo" 
              className="w-20 h-20 object-contain"
            />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? 'Ingresa tus datos para continuar'
              : 'Completa el formulario para comenzar'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          {isLogin && showForgotPassword ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="text-sm font-medium">
                  Email para restablecer
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-12"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                  className="flex-1 h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="flex-1 h-12 gradient-accent"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar email'}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      className="pl-10 h-12"
                      {...register('name' as keyof (LoginFormData | RegisterFormData))}
                    />
                  </div>
                  {(errors as any).name && (
                    <p className="text-sm text-destructive">{(errors as any).name.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-12"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 h-12"
                      {...register('confirmPassword' as keyof (LoginFormData | RegisterFormData))}
                    />
                  </div>
                  {(errors as any).confirmPassword && (
                    <p className="text-sm text-destructive">{(errors as any).confirmPassword.message}</p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold gradient-accent hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                  />
                ) : isLogin ? (
                  'Iniciar sesión'
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <Link
                to={isLogin ? '/register' : '/login'}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
