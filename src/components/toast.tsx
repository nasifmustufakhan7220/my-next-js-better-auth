"use client";

import { toast } from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export function Toast({ showToast, setShowToast }: { showToast: boolean; setShowToast:Dispatch<SetStateAction<boolean>> }) {
  const hasShown = useRef(false);
  useEffect(() => {
    if (showToast && !hasShown.current) {
      toast.success("Profile updated successfully!", {
        description: "Your profile information has been updated.",
      });

      hasShown.current = true;
      setShowToast(false);
    }

    if(!showToast){
        hasShown.current = false;
    }
  }, [showToast, setShowToast]);

  return null;
}
