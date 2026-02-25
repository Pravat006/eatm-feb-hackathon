"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera, MapPin, Send, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ticketService } from "@/services/ticket.service";

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(1, "Location is required"),
    imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SmartComplaintForm({ onSuccess }: { onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiFeedback, setAiFeedback] = useState<{ category: string; priority: string } | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { title: "", description: "", location: "", imageUrl: "" },
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            const data = await ticketService.create(values);

            setAiFeedback({ category: data.category || "General", priority: data.priority });
            toast.success("Complaint filed successfully! AI categorized your issue.");

            setTimeout(() => {
                onSuccess();
                form.reset();
                setAiFeedback(null);
                setImageUrl(null);
            }, 3000);
        } catch (error) {
            console.error("Submission failed", error);
            toast.error("Failed to submit complaint. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (aiFeedback) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500 flex items-center justify-center border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">AI Analysis Complete</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Complaint Authenticated & Categorized</p>
                </div>
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[8px] font-black uppercase tracking-widest mb-1">Category</p>
                        <p className="text-sm font-black uppercase">{aiFeedback.category}</p>
                    </div>
                    <div className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[8px] font-black uppercase tracking-widest mb-1">Priority</p>
                        <p className="text-sm font-black uppercase">{aiFeedback.priority}</p>
                    </div>
                </div>
                <p className="text-[10px] font-medium text-center italic opacity-60">Redirecting to terminal...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">Subject / Issue</FormLabel>
                            <FormControl>
                                <Input placeholder="Broken Desk, Water Leak, etc." {...field} className="premium-input" />
                            </FormControl>
                            <FormMessage className="text-[9px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">Detailed Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Provide more context for Gemini to analyze priority..."
                                    className="min-h-[120px] premium-input resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-[9px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">Location</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                                        <Input placeholder="Block A, L-203" {...field} className="premium-input pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[9px] uppercase font-bold text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em]">Documentation</FormLabel>
                                <FormControl>
                                    <CldUploadWidget
                                        uploadPreset="campus_ai_preset"
                                        onSuccess={(result: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                            const url = result.info.secure_url;
                                            setImageUrl(url);
                                            form.setValue("imageUrl", url);
                                        }}
                                    >
                                        {({ open }) => (
                                            <div
                                                onClick={() => open()}
                                                className="h-12 border-2 border-black border-dashed bg-muted/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                                            >
                                                {imageUrl ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                                                            <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="24px" />
                                                        </div>
                                                        <span className="text-[8px] font-black uppercase">Image Linked</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Camera className="w-4 h-4 opacity-40" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Upload</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CldUploadWidget>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-black text-white hover:bg-neutral-800 rounded-none font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Synthesizing Analysis...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Initialize Report
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
