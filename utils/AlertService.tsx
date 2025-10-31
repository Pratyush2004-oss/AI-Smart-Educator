// ...new file...
type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};
type AlertPayload = {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
};

let _subscriber: ((p: AlertPayload) => void) | null = null;

export const subscribeAlert = (fn: (p: AlertPayload) => void) => {
  _subscriber = fn;
  return () => {
    if (_subscriber === fn) _subscriber = null;
  };
};

export const showAlert = (
  title?: string,
  message?: string,
  buttons?: AlertButton[],
  options?: { cancelable?: boolean }
) => {
  _subscriber?.({
    title,
    message,
    buttons: buttons ?? [{ text: "OK" }],
    cancelable: options?.cancelable ?? true,
  });
};

export const hideAlert = () => {
  // send empty payload to close
  _subscriber?.({ title: undefined, message: undefined, buttons: [] });
};
