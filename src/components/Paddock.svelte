<script lang="ts">
  import type { Socket } from "socket.io-client";
  import ProgressFlowbite from "./ProgressFlowbite.svelte";
  import type { TypeData } from "$lib/types";

  let { socket }: { socket: Socket } = $props();
  let racers = $state(["swagat", "esme", "amanda"]);
  let progress = $state<{ [K: string]: number }>({
    swagat: 50,
  });
  $inspect(racers);
  const calcProgress = (typeData: TypeData) => {
    

  };
  $effect(() => {
    socket.on("join", (user, _) => {
      racers.push(user);
      progress[user] = 0;
    });
    socket.on("typing", (user, typeData) => {
      console.log(user, typeData);
      const prog = calcProgress(typeData);
      // progress[user] =
    });
  });
</script>

<div class="flex flex-col gap-2 p-3 w-1/2 bg-red-500">
  {#each racers as racer}
    <div class="flex gap-2 justify-between items-center">
      <span class="w-1/5">{racer}</span>
      <ProgressFlowbite progress={progress[racer]} />
    </div>
  {/each}
</div>
