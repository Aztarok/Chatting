"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addFriendFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "This field can't be empty" })
        .email("Please enter a valid email")
});

const AddFriendDialog = () => {
    const { mutate: createRequest, pending } = useMutationState(
        api.request.create
    );

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            email: ""
        }
    });

    const handleSubmit = async (
        values: z.infer<typeof addFriendFormSchema>
    ) => {
        await createRequest({
            email: values.email
        })
            .then(() => {
                form.reset();
                toast.success("Friend request sent!");
            })
            .catch((error) => {
                console.log(error);
                toast.error(
                    error instanceof ConvexError
                        ? error.data
                        : "Failed to send friend request"
                );
            });
    };
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger>
                    <Button size="icon" variant="outline">
                        <DialogTrigger>
                            <UserPlus />
                        </DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add friend</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>Send a friend request</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email..."
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendDialog;
