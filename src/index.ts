import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const moduleName = "@ugandaemr/esm-stock-management-app";

const options = {
  featureName: "stock-management",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const stockManagementAdminCardLink = getAsyncLifecycle(
  () => import("./stock-management-admin-card-link.component"),
  options
);

export const stockManagement = getAsyncLifecycle(
  () => import("./stock-management.component"),
  options
);

export const stockManagementDashboard = getAsyncLifecycle(
  () => import("./dashboard/stock-management-dashboard.component"),
  options
);

export const stockOperationDialog = getAsyncLifecycle(
  () =>
    import(
      "./stock-operations/stock-operations-dialog/stock-operations-dialog.component"
    ),
  options
);
export const deleteStockModal = getAsyncLifecycle(
  () => import("./stock-sources/delete-stock-modal.component"),
  {
    featureName: "delete-stock-modal",
    moduleName,
  }
);

export const deleteUserScopeModal = getAsyncLifecycle(
  () =>
    import("./stock-user-role-scopes/delete-stock-user-scope-modal.component"),
  {
    featureName: "delete-stock-user-scope-modal",
    moduleName,
  }
);

export const deleteStockRuleModal = getAsyncLifecycle(
  () =>
    import(
      "./stock-items/add-stock-item/stock-item-rules/delete-stock-rule-modal.component"
    ),
  {
    featureName: "delete-stock-rule-modal",
    moduleName,
  }
);

export const importBulkStockItemsDialog = getAsyncLifecycle(
  () =>
    import(
      "./stock-items/add-bulk-stock-item/stock-items-bulk-import.component"
    ),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
