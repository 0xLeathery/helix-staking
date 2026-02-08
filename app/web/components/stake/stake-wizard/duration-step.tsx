"use client";

import { useState, useEffect } from "react";
import { useStakeWizard } from "@/lib/store/ui-store";
import { parseHelix, formatDays } from "@/lib/utils/format";
import { BonusPreview } from "@/components/stake/bonus-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import BN from "bn.js";

const PRESET_DURATIONS = [
  { label: "1Y", days: 365 },
  { label: "3Y", days: 1095 },
  { label: "5Y", days: 1825 },
  { label: "Max", days: 5555 },
];

export function DurationStep() {
  const { amount, days, setDays, setStep } = useStakeWizard();
  const [daysInput, setDaysInput] = useState(days.toString());

  // Sync input with store
  useEffect(() => {
    setDaysInput(days.toString());
  }, [days]);

  const handleSliderChange = (values: number[]) => {
    const newDays = values[0];
    setDays(newDays);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDaysInput(value);

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setDays(parsed);
    }
  };

  const handlePresetClick = (presetDays: number) => {
    setDays(presetDays);
  };

  // Parse amount to BN for BonusPreview
  const amountBn = amount ? parseHelix(amount) : new BN(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Choose Duration</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Select how long you want to stake. Longer durations earn higher bonuses.
        </p>
      </div>

      <div className="space-y-6">
        {/* Slider */}
        <div>
          <label className="mb-4 block text-sm font-medium text-zinc-300">
            Duration: {formatDays(days)}
          </label>
          <Slider
            value={[days]}
            onValueChange={handleSliderChange}
            min={1}
            max={5555}
            step={1}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>1 day</span>
            <span>5,555 days</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {PRESET_DURATIONS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant={days === preset.days ? "default" : "outline"}
              onClick={() => handlePresetClick(preset.days)}
              className="w-full"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Exact Days Input */}
        <div>
          <label htmlFor="days" className="mb-2 block text-sm font-medium text-zinc-300">
            Exact Days (1-5555)
          </label>
          <Input
            id="days"
            type="number"
            min={1}
            max={5555}
            value={daysInput}
            onChange={handleInputChange}
            className="font-mono"
          />
        </div>

        {/* Live T-share Preview */}
        <BonusPreview amount={amountBn} days={days} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          size="lg"
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          size="lg"
          className="min-w-32"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
