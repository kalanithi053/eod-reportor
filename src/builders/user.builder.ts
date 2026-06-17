import { User } from "@/store/useAuthStore";

export const buildPayload = (
  form: Record<string, any>,
  user: Partial<User> = {},
) => {
  const { updatedAt, ...restUser } = user;
  const payload: Record<string, any> = { ...restUser };
  const configuration: Record<string, any> = { ...restUser.configuration };

  if (form.name) {
    payload.name = form.name;
  }

  if (form.eodMailRecipient) {
    configuration.eodMailRecipient = form.eodMailRecipient;
  }

  if (form.jobFailureTriggerRecipient) {
    configuration.jobFailureTriggerRecipient = form.jobFailureTriggerRecipient;
  }

  if (form.cronOption) {
    configuration.cronOption = form.cronOption;
  }

  if (Object.keys(configuration).length) {
    payload.configuration = configuration;
  }
  return payload;
};

export const buildSheetPayload = (
  form: Record<string, any>,
  user: Partial<User> = {},
) => {
  const {
    id,
    sheetTabName,
    taskNameIndex,
    durationIndex,
    statusIndex,
    dateIndex,
  } = form;
  const { updatedAt, ...restUser } = user;
  const payload: Record<string, any> = { ...restUser };

  const configuration: Record<string, any> = { ...restUser.configuration };

  return {
    ...payload,
    configuration: {
      ...configuration,
      sheet: {
        ...configuration?.sheet,
        id: id || null,
        sheetTabName: sheetTabName || null,
        taskNameIndex: !Number.isNaN(taskNameIndex)
          ? Number(taskNameIndex)
          : null,
        durationIndex: Number.isFinite(durationIndex) ? durationIndex : null,
        statusIndex: Number.isFinite(statusIndex) ? statusIndex : null,
        dateIndex: Number.isFinite(dateIndex) ? dateIndex : null,
      },
    },
  };
};
