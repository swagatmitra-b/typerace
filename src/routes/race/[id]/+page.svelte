<script lang="ts">
  import TypeFaceRace from "../../../components/TypeFaceRace.svelte";
  import Paddock from "../../../components/Paddock.svelte";
  import { Socket, io } from "socket.io-client";
  import { username } from "../../../stores/store";
  import { browser } from "$app/environment";

  let name = $state("");
  username.subscribe((val) => (name = val));
  let { data } = $props();
  let details = $state(() => {
    return {
      user: name,
      roomId: data.roomId,
    };
  });
  let socket = $state<Socket>(io(data.url));

  if (browser) {
    window.addEventListener("beforeunload", () => {
      socket.emit("leave", name, data.roomId);
    });
  }

  $effect(() => {
    socket.connect();
    if (name) socket.emit("join", name, data.roomId);
    () => socket.disconnect();
  });
</script>

<div class="flex flex-col min-h-screen pt-20 items-center w-full">
  <Paddock {socket} />
  <TypeFaceRace {socket} data={details()} />
</div>
