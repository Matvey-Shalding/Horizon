export function Category({ category }: { category: any }) {
  switch (category) {
    case "ENTERTAINMENT":
      return (
        <button className="border-light-blue rounded-big text-light-blue inline-flex items-center gap-x-[3px] border-[1.5px] px-2.5 py-[5px] text-xs">
          <div className="bg-light-blue h-1.5 w-1.5 rounded-full"></div>
          <span>Entertainment</span>
        </button>
      );
    case "FOOD":
      return (
        <button className="border-pink rounded-big text-pink inline-flex items-center gap-x-[3px] border-[1.5px] px-2.5 py-[3px] text-xs">
          <div className="bg-pink h-1.5 w-1.5 rounded-full"></div>
          <span>Food</span>
        </button>
      );
    case "BUDGET":
      return (
        <button className="border-green rounded-big text-green inline-flex items-center gap-x-[3px] border-[1.5px] px-2.5 py-[3px] text-xs">
          <div className="bg-green h-1.5 w-1.5 rounded-full"></div>
          <span>Budget</span>
        </button>
      );
  }
}
