import NextArrow from "components/icons/main/transactions/nextArrow";

export function Arrow({ type }: { type: "prev" | "next" }) {
  if (type === "prev") {
    return (
      <div className="flex grow-1 gap-x-1">
        <div className="flex h-10 px-5 items-center justify-center gap-x-1 rounded-lg">
          <NextArrow className="size-4" />
          <span className="text-gray text-sm font-semibold">Previous</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex grow-1 justify-end gap-x-1">
        <div className="flex h-10 px-5 items-center justify-center gap-x-1 rounded-lg">
          <span className="text-gray text-sm font-semibold">Next</span>
          <NextArrow className="size-4 rotate-180" />
        </div>
      </div>
    );
  }
}
