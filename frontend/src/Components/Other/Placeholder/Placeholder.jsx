import { NavLink } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import "./Placeholder.css";
const Placeholder = ({ img, text, buttonText, buttonRoute, thankyou }) => {
  return (
    <>
      <div className={"page PlaceholderDiv nomargin"}>
        <img
          src={img}
          className={"PlaceholderImageSmall"}
          alt="Placeholder"
          loading="lazy"
        />
        <div className="TextContainer">
          <h3>{text}</h3>
        </div>
        {buttonText && buttonRoute && (
          <NavLink to={buttonRoute}>
            <Button className="light-blue-btn placeholder-btn">
              {buttonText}
            </Button>
          </NavLink>
        )}
      </div>
    </>
  );
};

export default Placeholder;
