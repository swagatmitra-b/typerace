<script lang="ts">
  import type { timeProps } from "$lib/types";

  let {
    start,
    first = $bindable(),
    letterPos = $bindable(),
    wordNodeArray,
    typeData = $bindable(),
  }: timeProps = $props();

  let time = $state();
  let results = $state({
    gross: 0,
    net: 0,
    accuracy: 0,
  });
  let interval: number;

  const timer = () => {
    const futureTime = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds() + 31
    );
    let now = new Date();
    let diff = (futureTime.getTime() - now.getTime()) / 1000;
    time = Math.floor(diff) % 60;
    if (time == 0) {
      first = false;
      calculateResult();
      clearInterval(interval);
    }
  };

  const calculateResult = () => {
    results.gross = typeData.chars / (5 * 0.5);
    results.net = results.gross - typeData.errors / 0.5;
    results.accuracy =
      ((typeData.chars - typeData.errors) / typeData.chars) * 100;
  };

  const reset = (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    button.blur();
    clearInterval(interval);
    first = undefined;
    results.net = 0;
    results.gross = 0;
    results.accuracy = 0;
    time = 30;
    letterPos = 0;
    for (let i = 0; i < wordNodeArray.length; i++) {
      const element = wordNodeArray[i] as HTMLElement;
      if (element.innerText != "$") element.style.color = "black";
      else {
        element.style.color = "white";
        element.style.backgroundColor = "white";
      }
    }
  };

  $effect(() => {
    if (first) interval = setInterval(timer, 1000);
  });

  timer();
</script>

<div class="flex flex-col items-center">
  <h1>{time}</h1>
  <div class="flex flex-row">
    Gross WPM: {results.gross}
    Net WPM: {results.net}
    accuracy: {Number.isInteger(results.accuracy)
      ? results.accuracy
      : results.accuracy.toFixed(2)}%
  </div>
  <button class="p-1 rounded-md border border-black" onclick={(e) => reset(e)}
    >Reset</button
  >
</div>
