export interface VoucherForCartListRsp {
  title: string;
  code: string;
  startDate: string;
  endDate: string;
  minimumSpend?: number;
  exceedMinimumSpend?: number;
}
