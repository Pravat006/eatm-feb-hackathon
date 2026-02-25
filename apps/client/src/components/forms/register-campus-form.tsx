"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { CampusType } from "@repo/shared";
import { registerCampus } from "@/app/actions/campus-actions";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Organization name must be at least 2 characters.",
    }),
    type: z.nativeEnum(CampusType, {
        errorMap: () => ({ message: "Please select a valid organization type." })
    }),
    contactEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export function RegisterCampusForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { initialize } = useAuthStore();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            contactEmail: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response = await registerCampus(values);

            if (response.success) {
                toast.success("Registration Submitted", {
                    description: "Your organization is now pending Super Admin approval.",
                });
                form.reset();
                await initialize(); // Resyncs local state and triggers route jump
                router.push("/dashboard");
            } else {
                toast.error("Registration Failed", {
                    description: response.error,
                });
            }
        } catch {
            toast.error("Error", {
                description: "Something went wrong while submitting the request.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px]">Organization Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ACME_UNIVERSITY_NODE_1"
                                    className="border-2 border-black rounded-none h-12 font-bold focus-visible:ring-0 focus-visible:border-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="font-bold text-[10px] uppercase" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px]">Organization Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-2 border-black rounded-none h-12 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <SelectValue placeholder="SELECT_TYPE" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-2 border-black rounded-none">
                                    {Object.values(CampusType).map((type) => (
                                        <SelectItem key={type} value={type} className="font-bold uppercase text-[10px] tracking-widest">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="font-bold text-[10px] uppercase" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px]">Manager Contact Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="ADMIN@ACME.EDU"
                                    className="border-2 border-black rounded-none h-12 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-[10px] font-bold uppercase tracking-tight opacity-60">
                                Notification vector for approval status.
                            </FormDescription>
                            <FormMessage className="font-bold text-[10px] uppercase" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-14 bg-black text-white hover:bg-yellow-400 hover:text-black rounded-none border-2 border-black font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(255,255,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    disabled={isLoading}
                >
                    {isLoading ? "INITIALIZING_REQUEST..." : "Submit Registration Request"}
                </Button>
            </form>
        </Form>
    );
}
