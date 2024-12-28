// Entry component
import { App } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";

let AdMessage: MessageInstance;
let AdNotification: NotificationInstance;
let AdModal: Omit<ModalStaticFunctions, "warn">;

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const staticFunction = App.useApp();
  AdMessage = staticFunction.message;
  AdNotification = staticFunction.notification;
  AdModal = staticFunction.modal;
  return null;
};

export { AdMessage, AdNotification, AdModal };
