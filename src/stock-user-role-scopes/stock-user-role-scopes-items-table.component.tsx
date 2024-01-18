import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  DataTableSkeleton,
  Link,
  TabPanel,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
  TableToolbarAction,
  TableToolbarMenu,
} from "@carbon/react";
import styles from "./stock-user-role-scopes.scss";
import { ArrowDownLeft, ArrowLeft } from "@carbon/react/icons";
import { isDesktop } from "@openmrs/esm-framework";
import { ResourceRepresentation } from "../core/api/api";
import useStockUserRoleScopesPage from "./stock-user-role-scopes-items-table.resource";
import { URL_USER_ROLE_SCOPE } from "../stock-items/stock-items-table.component";
import AddStockUserRoleScopeActionButton from "./add-stock-user-role-scope-button.component";
import { formatDisplayDate } from "../core/utils/datetimeUtils";
import EditStockUserRoleActionsMenu from "./edit-stock-user-scope/edit-stock-user-scope-action-menu.component";

function StockUserRoleScopesItems() {
  const { t } = useTranslation();

  // get user scopes
  const {
    items,
    totalItems,
    tableHeaders,
    currentPage,
    pageSizes,
    goTo,
    currentPageSize,
    setPageSize,
    isLoading,
  } = useStockUserRoleScopesPage({
    v: ResourceRepresentation.Default,
    totalCount: true,
  });

  const tableRows = useMemo(() => {
    return items?.map((userRoleScope, index) => {
      return {
        ...userRoleScope,
        id: userRoleScope?.uuid,
        key: `key-${userRoleScope?.uuid}`,
        uuid: `${userRoleScope?.uuid}`,
        user: (
          <Link
            to={URL_USER_ROLE_SCOPE(userRoleScope?.uuid)}
          >{`${userRoleScope?.userFamilyName} ${userRoleScope.userGivenName}`}</Link>
        ),
        roleName: userRoleScope?.role,
        locations: userRoleScope?.locations?.map((location) => {
          const key = `loc-${userRoleScope?.uuid}-${location.locationUuid}`;
          return (
            <span key={key}>
              {location?.locationName}
              {location?.enableDescendants ? (
                <ArrowDownLeft key={`${key}-${index}-0`} />
              ) : (
                <ArrowLeft key={`${key}-${index}-1`} />
              )}{" "}
            </span>
          ); //return
        }),
        stockOperations: userRoleScope?.operationTypes
          ?.map((operation) => {
            return operation?.operationTypeName;
          })
          ?.join(", "),
        permanent: userRoleScope?.permanent
          ? t("stockmanagement.yes", "Yes")
          : t("stockmanagement.no", "No"),
        activeFrom: formatDisplayDate(userRoleScope?.activeFrom) ?? "Not Set",
        activeTo: formatDisplayDate(userRoleScope?.activeTo) ?? "Not Set",
        enabled: userRoleScope?.enabled
          ? t("stockmanagement.yes", "Yes")
          : t("stockmanagement.no", "No"),
        actions: <EditStockUserRoleActionsMenu data={items[index]} />,
      };
    });
  }, [items, t]);

  if (isLoading || items?.length === 0) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <div className={styles.tableOverride}>
      <TabPanel>
        To access stock management features, users must have assigned roles
        specifying location and stock operation type scopes.
      </TabPanel>
      <div id="table-tool-bar">
        <div></div>
        <div className="right-filters"></div>
      </div>
      <DataTable
        rows={tableRows ?? []}
        headers={tableHeaders}
        isSortable={true}
        useZebraStyles={true}
        render={({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps,
          onInputChange,
        }) => (
          <TableContainer>
            <TableToolbar
              style={{
                position: "static",
                overflow: "visible",
                backgroundColor: "color",
              }}
            >
              <TableToolbarContent className={styles.toolbarContent}>
                <TableToolbarSearch persistent onChange={onInputChange} />

                <AddStockUserRoleScopeActionButton />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(
                    (header: any) =>
                      header.key !== "details" && (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable,
                          })}
                          className={
                            isDesktop
                              ? styles.desktopHeader
                              : styles.tabletHeader
                          }
                          key={`${header.key}`}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      )
                  )}
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={
                          isDesktop ? styles.desktopRow : styles.tabletRow
                        }
                        {...getRowProps({ row })}
                      >
                        {row.cells.map(
                          (cell: any) =>
                            cell?.info?.header !== "details" && (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            )
                        )}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.tile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>
                      {t(
                        "noOperationsToDisplay",
                        "No Stock User scopes to display"
                      )}
                    </p>
                    <p className={styles.helper}>
                      {t("checkFilters", "Check the filters above")}
                    </p>
                  </div>
                </Tile>
              </div>
            ) : null}
          </TableContainer>
        )}
      ></DataTable>
      <Pagination
        page={currentPage}
        pageSize={currentPageSize}
        pageSizes={pageSizes}
        totalItems={totalItems}
        onChange={({ pageSize, page }) => {
          if (pageSize !== currentPageSize) {
            setPageSize(pageSize);
          }
          if (page !== currentPage) {
            goTo(page);
          }
        }}
        className={styles.paginationOverride}
      />
    </div>
  );
}

export default StockUserRoleScopesItems;
