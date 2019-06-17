declare module '*.module.css' {
  let styles: any;
  export default styles;
}

declare module '*.svg' {
  let content: string;
  export default content;
}

declare module NodeJS {
  export interface Process {
    browser: boolean;
  }
}
