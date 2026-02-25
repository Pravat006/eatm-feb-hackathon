import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { RegisterCampusForm } from "@/components/forms/register-campus-form";
import { SelectCampusForm } from "@/components/forms/select-campus-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { http } from "@/lib/http";
import { CampusDto } from "@repo/shared";
import { SkipOnboardingButton } from "@/components/onboarding/skip-button";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/login");
    }

    // Attempt to fetch active campuses for the selection dropdown
    let activeCampuses: CampusDto[] = [];
    try {
        const response = await http.get("/api/campus/active");
        activeCampuses = response.data.data;
    } catch (error) {
        console.error("Failed to fetch active campuses:", error);
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#fafafa]">
            <Card className="w-full max-w-md mx-auto border-2 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
                <CardHeader className="border-b-2 border-black bg-yellow-400 p-8">
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Organization Setup</CardTitle>
                    <CardDescription className="font-bold text-black/70 uppercase text-[10px] tracking-widest mt-2">
                        Initialize your campus identity to proceed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <Tabs defaultValue="join" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 border-2 border-black rounded-none p-1 bg-black gap-1">
                            <TabsTrigger
                                value="join"
                                className="rounded-none font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-black text-white transition-all"
                            >
                                Join Campus
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="rounded-none font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-black text-white transition-all"
                            >
                                Register New
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="join">
                            <SelectCampusForm campuses={activeCampuses} />
                        </TabsContent>
                        <TabsContent value="register">
                            <RegisterCampusForm />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 pt-6 border-t border-black/10 text-center">
                        <SkipOnboardingButton />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
