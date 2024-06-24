<script lang="ts">
  import TypeFaceRace from "../../../components/TypeFaceRace.svelte";
  import Paddock from "../../../components/Paddock.svelte";
  import { Socket, io } from "socket.io-client";

  let { data } = $props();
  let socket = $state<Socket>(io("http://localhost:3000"));

  $effect(() => {
    socket.connect();
    if (data.user) socket.emit("join", data.roomId, data.user);
    () => socket.disconnect();
  });
</script>

<div class="flex flex-col min-h-screen justify-center items-center w-full">
  <Paddock {socket} />
  <TypeFaceRace {socket} {data} />
</div>
