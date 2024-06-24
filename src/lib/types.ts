export type timeProps = {
  start: Date;
  first: boolean | undefined;
  wordNodeArray: HTMLCollectionOf<Element> | [];
  letterPos: number;
  typeData: {
    chars: number;
    errors: number;
  };
};

export type TypeData = {
  chars: number;
  errors: number;
  totalChars: number;
};
