"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export function AlertDialogComponent({
  title,
  text,
  action,
  onCancel,
  canCancel,
}: {
  title: string;
  text: string;
  action: number | (() => void);
  onCancel: () => void;
  canCancel: boolean;
}) {
  const handleActionClick = () => {
    if (typeof action !== "number") {
      action();
    }
    onCancel();
  };

  return (
    <AlertDialog open={title !== "" || text !== ""}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {canCancel && (
            <AlertDialogCancel onClick={onCancel}>ยกเลิก</AlertDialogCancel>
          )}
          {typeof action !== "number" && (
            <AlertDialogAction onClick={handleActionClick}>
              ยืนยัน
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const AlertContext = createContext(
  (
    title: string,
    text: string,
    action: number | (() => void),
    canCancel: boolean
  ) => {
    return [title, text, action, canCancel];
  }
);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [action, setAction] = useState<number | (() => void)>(0);
  const [canCancel, setCanCancel] = useState<boolean>(false);

  const onChangeAlert = useCallback(
    (
      title: string,
      text: string,
      action: number | (() => void),
      canCancel: boolean
    ) => {
      setTitle(title);
      setText(text);
      setAction(() => action);
      setCanCancel(canCancel);
      return [title, text, action, canCancel];
    },
    []
  );

  const onCancel = () => {
    setTitle("");
    setText("");
    setAction(0);
  };

  return (
    <AlertContext.Provider value={onChangeAlert}>
      {(title != "" || text != "") && (
        <AlertDialogComponent
          title={title}
          text={text}
          action={action}
          onCancel={onCancel}
          canCancel={canCancel}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
}

export const useAlertContext = () => useContext(AlertContext);
