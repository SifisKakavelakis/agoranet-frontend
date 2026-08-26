import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { loginApi } from "@/api/auth.api"
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"form">) {
  const [credential, setCredential] = useState('');
  const [password, setPassword]     = useState('');
  const { setAuth }                 = useAuthStore();
  const navigate                    = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginApi(credential, password);
      setAuth(result.user, result.token);
      toast.dismiss('session-expired');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(typeof message === 'string' ? message : 'Invalid credentials. Please try again.');
    }
  };

  return (
      <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to login in your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="credential">Email or Username</FieldLabel>
            <Input
                id="credential"
                type="text"
                required
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
  )
}