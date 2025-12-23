import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input";
import { memo, useState } from "react";
import { isValid } from "zod";

// utils/alertStyles.ts
export const alertVariants:any = {
  error: {
    title: "text-red-600 dark:text-red-700",
    titleThin: "text-red-500 dark:text-red-400",
    label: "text-red-500 dark:text-red-400",
    input: "border-red-500 focus-visible:ring-red-500",
    message: "text-red-500 bg-red-100 border border-red-300",
  },
  success: {
    title: "text-green-600 dark:text-green-400",
    label: "text-green-500 dark:text-green-400",
    input: "border-green-500 focus:ring-green-500",
    message: "text-green-500 bg-green-100 border border-green-300",
  },
  warning: {
    title: "text-yellow-600 dark:text-yellow-400",
    label: "text-yellow-500 dark:text-yellow-400",
    input: "border-yellow-500 focus:ring-yellow-500",
    message: "text-yellow-500 bg-yellow-100 border border-yellow-300",
  },
  info: {
    title: "text-blue-600 dark:text-blue-400",
    label: "text-blue-500 dark:text-blue-400",
    input: "border-blue-500 focus:ring-blue-500",
    message: "text-blue-500 bg-blue-100 border border-blue-300",
  },
  default: {
    title: "text-gray-800 dark:text-slate-200",
    label: "text-slate-600 dark:text-slate-300",
    input: "border-slate-300 focus:ring-slate-500",
    message: "text-slate-600 bg-slate-100 border border-slate-300",
  },
};

interface AlertProps {
  CloseButton?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  btnTitle?: React.ReactNode;
  cnslBtnTitle?: React.ReactNode;
  onAllow?: () => void;
  onCancel?: () => void;
}


  export const Alert=memo(({
  CloseButton,
  title,
  subtitle,
  btnTitle,
  cnslBtnTitle,
  onAllow,
  onCancel,
  confirmName = "",
  showConfirmInput = false,
  status="error",
  defaultOpen,
  triggerClass
}: {
  CloseButton?: React.ReactNode;
  title?: string;
  subtitle?: string;
  btnTitle?: string;
  cnslBtnTitle?: string;
  onAllow?: (e:any) => void;
  onCancel?: () => void;
  confirmName?: string;
  showConfirmInput?: boolean;
  status?:string;
  [key:string]:any
}) =>{
  const [inputValue, setInputValue] = useState("");
  const style = alertVariants[status];
  const isConfirmValid = !showConfirmInput || inputValue === confirmName;
console.log(inputValue,confirmName,inputValue.toString()==confirmName.toString());

  return (
    <AlertDialog open={defaultOpen}>
      <AlertDialogTrigger asChild className={triggerClass}>
        {CloseButton || <Button variant="outline">Show Dialog</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent className="transition-all duration-700 ease light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
        <AlertDialogHeader>
          <AlertDialogTitle className={style.title}>{title || "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription className={style.titleThin}>
            {subtitle ||
              "This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
          </AlertDialogDescription>

          {showConfirmInput && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                To confirm, please type <span className="font-semibold">"{confirmName}"</span> below:
              </p>
              <Input
                placeholder="Enter name to confirm"
                value={inputValue}
                className={`${style?.input}  ${isConfirmValid && "border-slate-200 focus-visible:ring-slate-200 "}`}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onCancel && typeof onCancel === "function" && onCancel()}
          >
            {cnslBtnTitle || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!isConfirmValid}
            onClick={(e) => onAllow && typeof onAllow === "function" && onAllow(e)}
          >
            {btnTitle || "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

)