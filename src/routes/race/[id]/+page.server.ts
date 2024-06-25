import { SERVER_URL } from "$env/static/private";

export const load = ({ params }) => {
  return {
    roomId: params.id,
    url: SERVER_URL,
  };
};
