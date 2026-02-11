"use client"
import Link from "next/link";
import { useForm } from "react-hook-form"
import { ChevronRight } from "lucide-react";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { config } from "@/modules/shared/config"
import { useApiKey } from "@/modules/shared/store/api-key";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

type ISchema = z.infer<typeof schema>;

export const CreateApiKeyForm = ( props: { trigger: React.ReactNode }) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const apiKeyHook = useApiKey();

  const onSubmit = async (data: ISchema) => {
    await apiKeyHook.createApiKey(data.name);
  };
  
  const onOpenChange = async ( isOpen: boolean ) => {
    if(isOpen) return;
    // If a new API key was created, refresh the list to show the new key
    if(apiKeyHook.newApiKey){
      await apiKeyHook.fetchApikeys();
    }
    // Reset the new API key state and form when the dialog is closed
    apiKeyHook.resetNewApiKey();
    reset();
  }

  return (
    <>
      <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            {props.trigger}
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25 bg-black/50 backdrop-blur-lg border border-zinc-900/20">
          {
            apiKeyHook.newApiKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Here is your newly created API key. Please store it securely as <span className="text-white/80">it will not be shown again</span>.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-2">
                  <span className="font-bold text-sm text-white/50">Api key:</span>
                  <p className="text-xs font-semibold p-2 border-2 border-zinc-900/20 rounded-sm break-all text-green-800 bg-black">{apiKeyHook.newApiKey}</p>
                  <span className="-mt-2 text-white/50 text-xs">Your API key is encrypted and stored securely.</span>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost" type="button">Close</Button>
                  </DialogClose>
                    <Button type="button" className="flex items-center gap-2" asChild>
                      <Link href="/docs/get-started" target="_blank" rel="noreferrer">
                        <span>Docs</span>
                        <ChevronRight/>
                      </Link>
                    </Button>
                </DialogFooter>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Give your API key a name to help you identify it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-5">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder={config.app.name} 
                      className="border-zinc-900/20"
                      {...register("name")}
                      />
                      <span className="text-xs text-red-800">{errors.name?.message}</span>
                  </div>
                </div>
                <DialogFooter className="mt-2">
                  <DialogClose asChild>
                    <Button variant="ghost" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            )
          }
          </DialogContent>
      </Dialog>
    </>
  )
}
