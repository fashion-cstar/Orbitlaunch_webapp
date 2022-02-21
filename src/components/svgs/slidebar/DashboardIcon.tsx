import createSvg from "../createSvg";

export default createSvg((props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.64" fillRule="evenodd" clipRule="evenodd" d="M5.5 4C4.67157 4 4 4.67157 4 5.5V6.5C4 7.32843 4.67157 8 5.5 8H9.5C10.3284 8 11 7.32843 11 6.5V5.5C11 4.67157 10.3284 4 9.5 4H5.5ZM14.5 16C13.6716 16 13 16.6716 13 17.5V18.5C13 19.3284 13.6716 20 14.5 20H18.5C19.3284 20 20 19.3284 20 18.5V17.5C20 16.6716 19.3284 16 18.5 16H14.5Z" fill={props.fill || "#BAB8CC"} />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5 4C13.6716 4 13 4.67157 13 5.5V12.5C13 13.3284 13.6716 14 14.5 14H18.5C19.3284 14 20 13.3284 20 12.5V5.5C20 4.67157 19.3284 4 18.5 4H14.5ZM5.5 10C4.67157 10 4 10.6716 4 11.5V18.5C4 19.3284 4.67157 20 5.5 20H9.5C10.3284 20 11 19.3284 11 18.5V11.5C11 10.6716 10.3284 10 9.5 10H5.5Z" fill={props.fill || "#BAB8CC"} />
  </svg>
));
