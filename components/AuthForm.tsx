"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpUser, signInUser } from "@/app/actions/auth";
import Image from "next/image";

type SignMode = "sign-in" | "sign-up";

interface AuthFormProps {
  type: SignMode;
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const result = await signUpUser({
          email,
          password,
          firstName,
          lastName,
        });
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/sign-in");
        }
      } else {
        const result = await signInUser({ email, password });
        if (result.error) {
          setError(result.error);
        } else {
          alert("Welcome back!");
          router.push("/");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-2xl mx-auto mt-10 p-2")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 w-full">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {type === "sign-in" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {type === "sign-in"
                    ? "Login to your account"
                    : "Sign up to get started"}
                </p>
              </div>

              {type === "sign-up" && (
                <>
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Field>
                </>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? type === "sign-in"
                      ? "Signing in..."
                      : "Creating account..."
                    : type === "sign-in"
                    ? "Login"
                    : "Sign Up"}
                </Button>
              </Field>

              <FieldSeparator>
                {type === "sign-in" ? "Or continue with" : "Or sign up with"}
              </FieldSeparator>

              <FieldDescription className="text-center">
                {type === "sign-in" ? (
                  <>
                    Don’t have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => router.push("/sign-up")}
                      className="p-0 text-blue-600"
                    >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => router.push("/sign-in")}
                      className="p-0 text-blue-600"
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
                src="/images/bird.png"
                alt="auth image"
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                priority
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
