export interface GetUrlRequest {
  restaurantId: string;
  branchId: string;
  fileName: string;
}

export interface GetUrlResponse {
  itemPicUrl: string;
  itemPicKey: string;
}
