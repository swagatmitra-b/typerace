import type { Socket } from "socket.io-client";

export type timeProps = {
  startTime: Date;
  start: boolean;
  finish: boolean;
  wordNodeArray: HTMLCollectionOf<Element> | [];
  letterPos: number;
  typeData: {
    chars: number;
    errors: number;
  };
};

export type TimeRaceProps = {
  startTime: Date;
  socket: Socket;
  typeData: {
    chars: number;
    errors: number;
  };
  start: boolean;
  finish: boolean;
  data: {
    user: string
    roomId: string
  }
};

export type TypeData = {
  chars: number;
  errors: number;
  totalChars: number;
};
