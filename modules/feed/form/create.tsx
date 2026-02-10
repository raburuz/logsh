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
import { workspaceValidator } from "../lib/zod";
import { useWorkspace } from "@/modules/shared/store/workspace";

const schema = z.object({
  name: workspaceValidator.name,
});

type ISchema = z.infer<typeof schema>;

export const CreateWorkspaceForm = ( props: { trigger: React.ReactNode } ) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const [isOpen, setIsOpen] = useState(false);

  const workspaces = useWorkspace();

  const onSubmit = async (data: ISchema) => {
    await workspaces.createWorkspace(data.name);
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {props.trigger}
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25 bg-black/50 backdrop-blur-lg border border-zinc-900/20">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>
                  Create a new workspace to organize your projects.
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
          </DialogContent>
      </Dialog>
    </>
  )
}
