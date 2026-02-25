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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { CampusDto } from "@repo/shared";
import { joinCampus } from "@/app/actions/campus-actions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";

const formSchema = z.object({
    campusId: z.string().min(1, {
        message: "Please select an organization to join.",
    }),
});

interface SelectCampusFormProps {
    campuses: CampusDto[];
}

export function SelectCampusForm({ campuses }: SelectCampusFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { initialize } = useAuthStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            campusId: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response = await joinCampus(values.campusId);

            if (response.success) {
                toast.success("Success", {
                    description: "You have successfully joined the organization.",
                });
                await initialize();
                router.push("/dashboard");
            } else {
                toast.error("Join Failed", {
                    description: response.error || "Could not join organization.",
                });
            }
        } catch {
            toast.error("Error", {
                description: "Something went wrong while attempting to join.",
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
                    name="campusId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px]">Active Organizations</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-2 border-black rounded-none h-12 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <SelectValue placeholder="SELECT_ORGANIZATION" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-2 border-black rounded-none">
                                    {campuses && campuses.length > 0 ? (
                                        campuses.map((campus) => (
                                            <SelectItem key={campus.id} value={campus.id} className="font-bold uppercase text-[10px] tracking-widest">
                                                {campus.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled className="font-bold uppercase text-[10px] tracking-widest">
                                            NO_ACTIVE_NODES_FOUND
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-[10px] font-bold uppercase tracking-tight opacity-60">
                                Verification by Super-Admin required for activation.
                            </FormDescription>
                            <FormMessage className="font-bold text-[10px] uppercase" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-14 bg-black text-white hover:bg-green-400 hover:text-black rounded-none border-2 border-black font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    disabled={isLoading || campuses.length === 0}
                >
                    {isLoading ? "ESTABLISHING_CONNECTION..." : "Establish Connection"}
                </Button>
            </form>
        </Form>
    );
}
