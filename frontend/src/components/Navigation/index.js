import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          <img src="/airbnb_logo.svg" alt="Home Logo" className="home-logo" />
        </NavLink>
      </li>
      <ul>
        {sessionUser && (
          <li>
            <NavLink to="/create-new-spot" className="create-spot-button">
              Create a New Spot
            </NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </ul>
  );
}

export default Navigation;
