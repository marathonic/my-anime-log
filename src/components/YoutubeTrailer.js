import PropTypes from "prop-types";
import { TrailerContainer, VideoFrame } from "./primedComps";

const YoutubeEmbed = ({ embedId, isMobile }) => (
  <TrailerContainer isMobile={isMobile}>
    <VideoFrame
      src={embedId}
      allow="encrypted-media;"
      allowFullScreen
      title="Embedded Youtube Trailer"
      isMobile={isMobile}
    />
  </TrailerContainer>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
