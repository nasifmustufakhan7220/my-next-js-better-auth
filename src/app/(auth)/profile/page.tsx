"use client";
// import { Toast } from "@/components/toast";
import { changeEmail, updateUser, useSession } from "@/lib/auth-client";
import { FloppyDisk } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
// import { useState } from "react";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  if (isPending) return <p>Loading...</p>;
  if (!session) return <p>Please sign in.</p>;
  const user = session.user;
  //   const [showToast, setShowToast] = useState<boolean>(false);
  const handelUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fromData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(fromData.entries()) as Record<
      string,
      string
    >;

    const nameRes = await updateUser({
      name: userData.name,
    });
    if (nameRes.error) {
      toast.danger("Failed to update name", {
        description: nameRes.error.message,
      });
      return;
    }

    if (userData.email !== user.email) {
      const newMail = await changeEmail({
        newEmail: userData.email,
        callbackURL: "/dashboard",
      });
      if (newMail.error) {
        toast.danger("Failed to change email", {
          description: newMail.error.message,
        });
        return;
      }

      if (user.emailVerified) {
        toast.success("Verification link sent", {
          description: "Check your new email to confirm the change.",
        });
        return;
      }
    }

    toast.success("Profile update successfully!");
  };

  return (
    <Form className="w-full max-w-96" onSubmit={handelUpdateProfile}>
      {/* {showToast && <Toast showToast={showToast} setShowToast={setShowToast} />} */}
      <Fieldset>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>
        <Description>Update your profile information.</Description>
        <FieldGroup>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }
              return null;
            }}
          >
            <Label>Name</Label>
            <Input placeholder="John Doe" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>
          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
};

export default ProfilePage;
