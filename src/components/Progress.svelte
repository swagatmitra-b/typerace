<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import type { EasingFunction } from "svelte/transition";
  import { twMerge, twJoin } from "tailwind-merge";

  export let progress: string | number = "45";
  export let precision: number = 0;
  export let tweenDuration: number = 400;
  export let animate: boolean = false;
  export let size: string = "h-2.5";
  export let labelInside: boolean = false;
  export let easing: EasingFunction = cubicOut;
  export let color:
    | "primary"
    | "blue"
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "purple"
    | "indigo" = "primary";
  export let labelInsideClass: string =
    "text-primary-100 text-xs font-medium text-center p-0.5 leading-none rounded-full";
  export let divClass: string = "w-full bg-white rounded-full ";

  const _progress = tweened(0, {
    duration: animate ? tweenDuration : 0,
    easing,
  });

  const barColors = {
    primary: "bg-primary-600",
    blue: "bg-blue-600",
    gray: "bg-gray-600 dark:bg-gray-300",
    red: "bg-red-600 dark:bg-red-500",
    green: "bg-green-600 dark:bg-green-500",
    yellow: "bg-yellow-400",
    purple: "bg-purple-600 dark:bg-purple-500",
    indigo: "bg-indigo-600 dark:bg-indigo-500",
  };

  $: _progress.set(Number(progress));
</script>

<div class={twMerge(divClass, size, $$props.class)}>
  {#if labelInside}
    <div
      class={twJoin(labelInsideClass, barColors[color])}
      style="width: {$_progress}%"
    >
      {$_progress.toFixed(precision)}%
    </div>
  {:else}
    <div
      class={twJoin(barColors[color], size, "rounded-full")}
      style="width: {$_progress}%"
    ></div>
  {/if}
</div>
