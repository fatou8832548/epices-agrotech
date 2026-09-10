// Type declarations for static image imports
declare module '*.png' {
  const content: number;
  export default content;
}

declare module '*.jpg' {
  const content: number;
  export default content;
}

declare module '*.jpeg' {
  const content: number;
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Type declarations for bundled course documents
declare module '*.pptx' {
  const content: number;
  export default content;
}

declare module '*.docx' {
  const content: number;
  export default content;
}

declare module '*.pdf' {
  const content: number;
  export default content;
}

declare module '*.mp4' {
  const content: number;
  export default content;
}
