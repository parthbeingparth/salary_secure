import { Nav } from "@/components/Nav";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  return (
    <>
      <div id="top" />
      <Nav />
      <HomeExperience />
      <MobileStickyCta />
    </>
  );
}
