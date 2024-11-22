import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitleTwo from "../../components/section-title/SectionTitleTwo";
import teamMemberData from "../../data/team-members/team-member-one.json";
import TeamMemberOneSingle from "../../components/team-member/TeamMemberOneSingle";

const TeamMemberOne = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("team-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        {/* section title */}
        <SectionTitleTwo
          titleText="Our Popular Products"
          positionClass="text-center"
          // spaceClass="mb-60"
        />

        {/* <div className="row">
          {teamMemberData?.map((data, key) => (
            <div className="col-lg-3 col-md-6 col-sm-6" key={key}>
               <div className={clsx("team-wrapper", spaceBottomClass)}>
        <div className="team-img">
          <img
            src={process.env.PUBLIC_URL + data.image}
            alt=""
            className="img-fluid"
          />
          <div className="team-action">
            <a
              className="facebook"
              href={data.fbLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-facebook" />
            </a>
            <a
              className="twitter"
              href={data.twitterLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              className="instagram"
              href={data.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-instagram" />
            </a>
          </div>
        </div>
        <div className="team-content text-center">
          <h4>{data.name}</h4>
          <span>{data.position} </span>
        </div>
      </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

TeamMemberOne.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TeamMemberOne;
