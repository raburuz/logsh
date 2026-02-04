"use client"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import z from "zod"
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
import { useApi, useFetchApiKeys } from "../hooks/useApi";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

type ISchema = z.infer<typeof schema>;

export const CreateApiKeyForm = () => {

  const [apiKey, setApiKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const api = useApi();
  const fetchApiKeys = useFetchApiKeys();

  const onSubmit = async (data: ISchema) => {
    setApiKey((await api.createApiKey(data.name)).key);
    await fetchApiKeys.refetch();
    reset();
  };

  const onOpenChange = () => {
    setApiKey(null);
  }

  return (
    <>
      <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button size={"xs"} type="button">Create</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25 bg-black/50 backdrop-blur-lg border border-white/10">
          {
            apiKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Here is your newly created API key. Please store it securely as <span className="text-white/80">it will not be shown again</span>.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <span className="font-bold text-sm text-white/50">Key:</span>
                  <p className="text-sm font-bold p-2 border-2 border-white/10 rounded-sm break-all text-green-800 bg-black">{apiKey}</p>
                  <span className="-mt-2 text-white/50 text-xs">Your API key is encrypted and stored securely.</span>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost" type="button">Close</Button>
                  </DialogClose>
                    <Button type="button" className="flex items-center gap-2" asChild>
                      <Link href="docs/get-started" target="_blank" rel="noreferrer">
                        <span>Documentation</span>
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
                      className="border-white/10"
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
