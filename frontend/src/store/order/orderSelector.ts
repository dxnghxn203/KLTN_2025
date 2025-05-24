export const selectAllOrder = (state: any) => state.order.orders;
export const selectAllOrderAdmin = (state: any) => state.order.ordersAdmin;
export const selectLoading = (state: any) => state.order.loading;
export const selectOrdersByUser = (state: any) => state.order.ordersByUser;
export const selectStatistics365Days = (state: any) => state.order.statistics365Days;
export const selectAllRequestOrder = (state: any) => state.order.allRequestOrder;
export const selectAllRequestOrderApprove = (state: any) => state.order.allRequestOrderApprove;
export const selectOverviewStatisticOrder = (state: any) => state.order.overviewStatisticOrder;