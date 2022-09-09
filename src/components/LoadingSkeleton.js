import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { AnimeCard } from "./primedComps";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";

<SkeletonTheme
  baseColor="#39A2DB"
  color="#F5F5F5"
  highlightColor="#ffffff"
></SkeletonTheme>;

const MobileSkeletonTile = () => {
  <span className="category-span">
    <AnimeCard />
    {/* replacing <Link></Link> for <div></div> */}
    <div>
      {/* replacing <img /> for <Skeleton /> */}
      <Skeleton width={20} height={30} />
    </div>
  </span>;
};

export { MobileSkeletonTile };
