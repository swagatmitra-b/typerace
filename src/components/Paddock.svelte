<script lang="ts">
  import type { Socket } from "socket.io-client";
  import Progress from "./Progress.svelte";
  import type { TypeData } from "$lib/types";

  let { socket }: { socket: Socket } = $props();
  let racers = $state<string[]>([]);
  let start = $state(false);
  let progress = $state<{ [K: string]: number }>({});
  let rankings = $state<{ [K: string]: [string, number] }>({});

  $effect(() => {
    socket.on("join", (user, members) => {
      racers = members;
      progress[user] = 0;
    });
    socket.on("typing", (user: string, typeData: TypeData) => {
      progress[user] = (typeData.chars / typeData.totalChars) * 100;
    });
    socket.on("start", () => {
      start = true;
    });
    socket.on("result", (user, pos, wpm) => {
      let position = getPosition(pos);
      rankings[user] = [position, wpm]
    });
  });

  const getPosition = (pos: number) => {
    switch (pos) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return `${pos}th`;
    }
  };
</script>

{#snippet lightsout(start)}
    <div
      class={`lightsout border border-black w-8 h-8 ${start ? "bg-green-500" : "bg-red-500"}`}
    ></div>
{/snippet}
<div class="flex flex-col gap-2 p-3 w-1/2">
  <div class="flex justify-center">
    {@render lightsout(start)}
    {@render lightsout(start)}
    {@render lightsout(start)}
  </div>
  <h1 class={`text-center my-4 ${start ? "text-white": "text-black"} select-none`}>Wait for the lights to go green</h1> 
  <div class="flex flex-col">
    {#each racers as racer}
      <div class="flex gap-2 items-center ">
        <span class="w-1/5">{racer}</span>
        <Progress
          animate
          progress={progress[racer] ? progress[racer] : 0}
          color="blue"
          class="border border-black"
        />
        {#if rankings[racer]}
          <div class="flex items-center text-sm gap-2 w-1/6">
            <span class="font-semibold">
              {rankings[racer][0]}
            </span>
            <span>
              {rankings[racer][1]} wpm
            </span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .lightsout {
    border-radius: 50%;
  }
</style>
