import createSvg from "./createSvg";

export default createSvg((props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      opacity="0.4"
      d="M2 12H12V22H7.81C4.17 22 2 19.83 2 16.19V12ZM22 7.81V12H12V2H16.19C19.83 2 22 4.17 22 7.81Z"
      fill={props.fill}
    />
    <path
      d="M12 2V12H2V7.81C2 4.17 4.17 2 7.81 2H12ZM22 12V16.19C22 19.83 19.83 22 16.19 22H12V12H22Z"
      fill={props.fill}
    />
  </svg>
));
