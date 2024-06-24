<script lang="ts">
  import type { Socket } from "socket.io-client";
  import Progress from "./Progress.svelte";
  import type { TypeData } from "$lib/types";

  let { socket }: { socket: Socket } = $props();
  let racers = $state<string[]>([]);
  let start = $state(false);
  let progress = $state<{ [K: string]: number }>({});

  // $inspect(racers, progress);

  $effect(() => {
    socket.on("join", (user, members) => {
      racers = members;
      progress[user] = 0;
    });
    socket.on("typing", (user: string, typeData: TypeData) => {
      // console.log(user, typeData);
      progress[user] = (typeData.chars / typeData.totalChars) * 100;
    });
    socket.on("start", () => {
      start = true;
    });
  });
</script>

<div class="flex flex-col gap-2 p-3 w-1/2">
  <div class="flex justify-center">
    <div
      class={`lightsout border border-black w-8 h-8 ${start ? "bg-green-500" : "bg-red-500"}`}
    ></div>
    <div
      class={`lightsout border border-black w-8 h-8 ${start ? "bg-green-500" : "bg-red-500"}`}
    ></div>
    <div
      class={`lightsout border border-black w-8 h-8 ${start ? "bg-green-500" : "bg-red-500"}`}
    ></div>
  </div>
  <div class="">
    {#each racers as racer}
      <div class="flex gap-2 justify-between items-center">
        <span class="w-1/5">{racer}</span>
        <Progress
          animate
          progress={progress[racer]}
          color="blue"
          class="border border-black"
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .lightsout {
    border-radius: 50%;
  }
</style>
