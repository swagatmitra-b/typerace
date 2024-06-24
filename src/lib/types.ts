export type timeProps = {
  startTime: Date;
  first: boolean | undefined;
  wordNodeArray: HTMLCollectionOf<Element> | [];
  letterPos: number;
  typeData: {
    chars: number;
    errors: number;
  };
};

export type TimeRaceProps = timeProps & { finish: boolean };

export type TypeData = {
  chars: number;
  errors: number;
  totalChars: number;
};
