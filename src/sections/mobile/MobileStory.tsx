import { MobileHero } from "./MobileHero";
import { MobileProblem } from "./MobileProblem";
import { MobileCalculator } from "./MobileCalculator";
import { MobileSolution } from "./MobileSolution";
import { MobilePlans } from "./MobilePlans";
import { MobileConvert } from "./MobileConvert";

/** Compact guided story for mobile / LinkedIn traffic. Desktop uses full sections. */
export function MobileStory() {
  return (
    <>
      <MobileHero />
      <MobileProblem />
      <MobileCalculator />
      <MobileSolution />
      <MobilePlans />
      <MobileConvert />
    </>
  );
}
