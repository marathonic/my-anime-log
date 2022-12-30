import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { AnimeCard } from "./primedComps";
import "react-loading-skeleton/dist/skeleton.css";

<SkeletonTheme
  baseColor="#39A2DB"
  color="#F5F5F5"
  highlightColor="#ffffff"
></SkeletonTheme>;

const MobileSkeletonTile = () => {
  <span className="category-span">
    <AnimeCard />
    <div>
      <Skeleton width={20} height={30} />
    </div>
  </span>;
};

export { MobileSkeletonTile };
