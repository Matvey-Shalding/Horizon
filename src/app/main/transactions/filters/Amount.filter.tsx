import clsx from "clsx";
import Arrow from "components/icons/main/transactions/arrow";
import { AnimatePresence, motion } from "framer-motion";
import { Range, getTrackBackground } from "react-range";
import "rc-slider/assets/index.css";
import { Input } from "ui/Input";

interface AmountFilterProps {
  isOpen: boolean;
  setIsOpen: () => void;
  amountRange: [number, number];
  setAmountRange: (range: [number, number]) => void;
}

export function AmountFilter({
  isOpen,
  setIsOpen,
  amountRange,
  setAmountRange,
}: AmountFilterProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <label
        className={clsx(
          "flex cursor-pointer items-center justify-between select-none",
          "border-border border-t pt-2.5",
          "border-b pb-1",
        )}
        onClick={setIsOpen}
      >
        <span className="text-blue font-semibold">Amount</span>
        <Arrow
          className={clsx(
            "transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </label>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col-reverse items-center">
                <div className="flex w-[calc(100%-25px)] flex-col items-center justify-center">
                  <Range
                    values={amountRange}
                    step={50}
                    min={0}
                    max={100000}
                    onChange={(vals) =>
                      setAmountRange(vals as [number, number])
                    }
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: "36px",
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: "6px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                              values: amountRange,
                              colors: ["#ccc", "#0179fe", "#ccc"],
                              min: 0,
                              max: 100000,
                            }),
                            alignSelf: "center",
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        className="bg-dark-blue flex h-5 w-5 items-center justify-center rounded-full shadow-md"
                        {...props}
                        style={{ ...props.style }}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    label="Min"
                    placeholder="0"
                    type="number"
                    value={amountRange[0]}
                    onChange={(e) =>
                      setAmountRange([
                        Math.min(Number(e.target.value), amountRange[1]),
                        amountRange[1],
                      ])
                    }
                  />
                  <Input
                    label="Max"
                    placeholder="100000"
                    type="number"
                    value={amountRange[1]}
                    onChange={(e) =>
                      setAmountRange([
                        amountRange[0],
                        Math.max(Number(e.target.value), amountRange[0]),
                      ])
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
