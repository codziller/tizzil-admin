import { useParams } from "react-router-dom";
import { CENTRAL_WAREHOUSE_ID } from "utils/appConstant";

export default function useWarehouse() {
  const { warehouse_id } = useParams();
  const warehouseIsCentral = warehouse_id === CENTRAL_WAREHOUSE_ID;
  return { warehouseIsCentral };
}
