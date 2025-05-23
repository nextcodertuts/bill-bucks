/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";
import { register } from "./action";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  UserRound,
  Phone,
  Gift,
} from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const requiredString = z.string().trim().min(1, "Required");

const schema = z
  .object({
    name: requiredString.min(2, "Name must be at least 2 characters"),
    identifier: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .regex(/^[0-9]{10}$/, "Invalid phone number format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    referralCode: z.string().optional().nullable(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      acceptTerms: false,
    },
  });

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      form.setValue("referralCode", refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams, form]);

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      setReferrerName(null);
      return;
    }

    try {
      const response = await fetch(`/api/referral/check?code=${code}`);
      const data = await response.json();

      if (data.valid) {
        setReferralValid(true);
        setReferrerName(data.referrer.name);
      } else {
        setReferralValid(false);
        setReferrerName(null);
      }
    } catch (error) {
      console.error("Error validating referral code:", error);
      setReferralValid(false);
      setReferrerName(null);
    }
  };

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phoneNumber", values.identifier);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);

      if (values.referralCode) {
        formData.append("referralCode", values.referralCode);
      }

      const result = await register(formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Registration successful! Redirecting...");
        router.push("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className=" mt-8 flex flex-col items-center">
        <Image
          src="/cashbucks-icon.png"
          height={100}
          width={100}
          alt="img"
          className="rounded-xl"
        />
        <h2 className="font-bold text-2xl tracking-wide text-primary ">
          <span className="text-secondary">Bill</span>
          <span>BuckZ</span>
        </h2>
      </div>
      <div>
        <p className="font-bold text-2xl my-6">Register</p>
      </div>

      <Card className="w-full max-w-md overflow-hidden bg-transparent rounded-md">
        <CardHeader className="py-0">
          <CardTitle hidden>Register</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your Name"
                          className="rounded-full pl-10"
                        />
                        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter your Phone"
                          className="rounded-full pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="rounded-full pl-10 pr-10"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="rounded-full pl-10 pr-10"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Referral Code (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter referral code"
                          className="rounded-full pl-10"
                          onChange={(e) => {
                            field.onChange(e.target.value || null);
                            validateReferralCode(e.target.value);
                          }}
                        />
                        <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      </div>
                    </FormControl>
                    {referralValid === true && (
                      <p className="text-sm text-green-600">
                        Valid referral code from {referrerName}
                      </p>
                    )}
                    {referralValid === false && (
                      <p className="text-sm text-red-600">
                        Invalid referral code
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          terms and conditions
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-full text-lg font-semibold py-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Register <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="h-[500px]"></div>
    </div>
  );
}
