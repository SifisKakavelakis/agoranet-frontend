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
import { registerApi } from "@/api/auth.api"
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function SignupForm({
                             className,
                             ...props
                           }: React.ComponentProps<"form">) {
  const [username,         setUsername]         = useState('');
  const [firstname,        setFirstname]        = useState('');
  const [lastname,         setLastname]         = useState('');
  const [email,            setEmail]            = useState('');
  const [password,         setPassword]         = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const { setAuth }                             = useAuthStore();
  const navigate                                = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await registerApi({ username, firstname, lastname, email, password });
      setAuth(result.user, result.token);
      toast.dismiss('session-expired');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(typeof message === 'string' ? message : 'Registration failed. Please try again.');
    }
  };

  return (
      <form className={cn("flex flex-col gap-3", className)} {...props} onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to create your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
                id="username"
                type="text"
                required
                className="bg-background"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
            <Input
                id="firstname"
                type="text"
                required
                className="bg-background"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
            <Input
                id="lastname"
                type="text"
                required
                className="bg-background"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
                id="email"
                type="email"
                required
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
                id="password"
                type="password"
                required
                className="bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
                id="confirm-password"
                type="password"
                required
                className="bg-background"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
  )
}