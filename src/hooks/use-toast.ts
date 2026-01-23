/**
 * useToast Hook
 * 
 * Hook for managing toast notifications.
 */

import * as React from "react";
import { useState } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  onClose?: () => void;
}

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;
const TOAST_DEBOUNCE_MS = 500; // Prevent duplicate toasts within 500ms

type ToasterToast = Toast & {
  id: string;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;
let lastToastTime = 0;
let lastToastKey: string | null = null;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function getToastKey(toast: Toast): string {
  // Create a unique key based on title and description to detect duplicates
  return `${toast.title || ""}-${toast.description || ""}-${toast.variant || "default"}`;
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                onClose: undefined,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ ...props }: Toast) {
  const now = Date.now();
  const toastKey = getToastKey(props);
  
  // Debounce: prevent duplicate toasts within TOAST_DEBOUNCE_MS
  if (now - lastToastTime < TOAST_DEBOUNCE_MS && lastToastKey === toastKey) {
    // Return existing toast if it's a duplicate
    const existingToast = memoryState.toasts.find((t) => 
      getToastKey(t) === toastKey
    );
    if (existingToast) {
      return {
        id: existingToast.id,
        dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: existingToast.id }),
        update: (newProps: ToasterToast) => dispatch({
          type: "UPDATE_TOAST",
          toast: { ...newProps, id: existingToast.id },
        }),
      };
    }
  }
  
  lastToastTime = now;
  lastToastKey = toastKey;
  
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onClose: dismiss,
    },
  });

  // Auto dismiss after duration (default 5 seconds)
  const duration = props.duration ?? 5000;
  if (duration !== Infinity) {
    setTimeout(() => {
      dismiss();
    }, duration);
  }

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []); // Empty dependency array - listener registration should happen only once

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
