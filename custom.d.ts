declare module '*.module.css' {
  let styles: any;
  export default styles;
}

declare module '*.svg' {
  export default 'image';
}

declare module NodeJS {
  interface Process {
    browser: boolean;
  }
}
