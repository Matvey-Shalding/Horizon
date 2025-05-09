import { TransactionStatus } from "types/Transaction.interface";

export function Status({ status }: { status: TransactionStatus }) {
  switch (status) {
    case "SUCCESS":
      return (
        <div className="bg-success rounded-big justify-self-start text-green flex items-center gap-x-1 pl-2.5 pr-2 py-[5px] text-xs font-medium">
          <div className="bg-green h-1.5 w-1.5 mt-0.5 rounded-full"></div>
          <span>Success</span>
        </div>
      );
    case "PROCESSING":
      return (
        <div className="bg-processing rounded-big text-dark-gray flex items-center gap-x-1 justify-self-start py-[5px] pr-2 pl-2.5 text-xs font-medium">
          <div className="bg-dark-gray mt-0.5 h-1.5 w-1.5 rounded-full"></div>
          <span>Processing</span>
        </div>
      );
    case "DECLINED":
      return (
        <div className="bg-declined rounded-big text-red flex items-center gap-x-1 justify-self-start py-[5px] pr-2 pl-2.5 text-xs font-medium">
          <div className="bg-red mt-0.5 h-1.5 w-1.5 rounded-full"></div>
          <span>Declined</span>
        </div>
      );

    default:
      break;
  }
}
