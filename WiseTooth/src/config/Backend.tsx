import config from ".";

// DEV //export const BaseURL = "https://implantserver-dev-env.uc.r.appspot.com";
export const BaseURL = "http://192.168.0.25:3000";
// export const BaseURL = config.useDev
//   ? "https://dev-wisetooth-dot-implantaiserver.ew.r.appspot.com"
//    : "https://www.jarrahinov.com";
   
   
   
console.log({BaseURL});
export const api = `${BaseURL}`;