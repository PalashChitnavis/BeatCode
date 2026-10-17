import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { useLocation } from "react-router";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@beatcode/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, errorMessage } from "@/lib/api";
import { authApi } from "./api";
import { useAuthDialog } from "./dialogStore";
import { useAuthProviders, useLogin, useRegister } from "./hooks";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function Field<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  autoComplete,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  const error = form.formState.errors[name]?.message;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        {...form.register(name)}
      />
      {typeof error === "string" && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Copies server-side field errors (e.g. "email already exists") onto the form. */
function applyServerErrors<T extends FieldValues>(form: UseFormReturn<T>, error: unknown) {
  if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
    for (const [field, message] of Object.entries(error.fields)) form.setError(field as Path<T>, { message });
  } else {
    form.setError("root", { message: errorMessage(error) });
  }
}

function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, { onError: (e) => applyServerErrors(form, e) }),
  );
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field form={form} name="email" label="Email" type="email" autoComplete="email" />
      <Field form={form} name="password" label="Password" type="password" autoComplete="current-password" />
      {form.formState.errors.root && (
        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
      )}
      <Button type="submit" loading={login.isPending}>
        Sign in
      </Button>
    </form>
  );
}

function RegisterForm() {
  const register = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const onSubmit = form.handleSubmit((values) =>
    register.mutate(values, { onError: (e) => applyServerErrors(form, e) }),
  );
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field form={form} name="name" label="Name" autoComplete="name" />
      <Field form={form} name="email" label="Email" type="email" autoComplete="email" />
      <Field form={form} name="password" label="Password" type="password" autoComplete="new-password" />
      {form.formState.errors.root && (
        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
      )}
      <Button type="submit" loading={register.isPending}>
        Create account
      </Button>
    </form>
  );
}

export function AuthDialog() {
  const { open, mode, reason, close, setMode } = useAuthDialog();
  const providers = useAuthProviders();
  const location = useLocation();
  const isLogin = mode === "login";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {reason ?? (isLogin ? "Sign in to track your progress." : "It's free.")}
          </DialogDescription>
        </DialogHeader>

        {providers.data?.google && (
          <>
            <Button variant="outline" asChild>
              <a href={authApi.googleUrl(location.pathname + location.search)}>
                <GoogleIcon />
                Continue with Google
              </a>
            </Button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        {isLogin ? <LoginForm key="login" /> : <RegisterForm key="register" />}

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "New to BeatCode?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
