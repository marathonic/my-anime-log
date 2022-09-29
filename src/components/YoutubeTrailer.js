import PropTypes from "prop-types";
import { TrailerContainer, VideoFrame } from "./primedComps";

const YoutubeEmbed = ({ embedId, isMobile, isModalOpen }) => (
  <>
    <span className={isModalOpen ? "darken-span" : "centered-span"}>
      <h1>Trailer</h1>
    </span>

    <TrailerContainer isMobile={isMobile} isModalOpen={isModalOpen}>
      <VideoFrame
        src={embedId}
        allow="encrypted-media;"
        allowFullScreen
        title="Embedded Youtube Trailer"
        isMobile={isMobile}
      />
    </TrailerContainer>
  </>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
