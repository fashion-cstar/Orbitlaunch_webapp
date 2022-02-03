import createSvg from "./createSvg";

export default createSvg((props) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.2266 15V19C22.2266 20.1046 21.3311 21 20.2266 21H4.22656C3.12199 21 2.22656 20.1046 2.22656 19L2.22656 15H6.5058L7.04995 16.6325C7.32218 17.4491 8.08646 18 8.94732 18H15.6085C16.3661 18 17.0586 17.572 17.3974 16.8944L18.3446 15L22.2266 15Z"
        fill={props.fill || "#BAB8CC"}
        fillOpacity="0.64"
      />
      <path
        opacity="0.3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.78906 13L6.15311 7.01948C6.50734 6.38972 7.17371 6 7.89626 6L16.5569 6C17.2794 6 17.9458 6.38972 18.3 7.01948L21.6641 13H18.3446C17.5871 13 16.8945 13.428 16.5557 14.1056L15.6085 16H8.94732L8.40317 14.3675C8.13094 13.5509 7.36666 13 6.5058 13H2.78906Z"
        fill={props.fill || "#BAB8CC"}
        fillOpacity="0.64"
      />
    </svg>
  );
});
