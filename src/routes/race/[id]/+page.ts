import { username } from "../../../stores/store.js";

export const load = ({ params }) => {
  let user = "";
  username.subscribe((v) => (user = v));
  return {
    roomId: params.id,
    user,
  };
};
