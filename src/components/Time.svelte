<script lang="ts">
  import type { timeProps } from "$lib/types";

  let {
    startTime,
    start = $bindable(),
    finish = $bindable(),
    letterPos = $bindable(),
    wordNodeArray,
    typeData = $bindable(),
  }: timeProps = $props();

  let time = $state<number>();
  let elapsed = $state(0);
  let results = $state({
    gross: 0,
    net: 0,
    accuracy: 0,
  });
  let interval: number;

  const timer = () => {
    const futureTime = new Date(
      startTime.getFullYear(),
      startTime.getMonth(),
      startTime.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds() + 31
    );
    let now = new Date();
    let diff = (futureTime.getTime() - now.getTime()) / 1000;
    time = Math.floor(diff) % 60;
    if (time == 0 || finish) {
      start = false;
      finish = true;
      elapsed = (30 - time) / 60;
      calculateResult();
      clearInterval(interval);
    }
  };

  $inspect(start);

  const calculateResult = () => {
    results.gross = typeData.chars / (5 * elapsed);
    results.net = results.gross - typeData.errors / elapsed;
    results.accuracy =
      ((typeData.chars - typeData.errors) / typeData.chars) * 100;
  };

  const reset = (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    button.blur();
    clearInterval(interval);
    wordNodeArray[letterPos].classList.remove("active");
    start = false;
    finish = false;
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
    if (start) interval = setInterval(timer, 1000);
  });

  timer();
</script>

<div class="w-1/2 flex flex-col items-center m-3 gap-3 justify-between text-lg">
  <h1>{time}</h1>
  <div class="flex flex-row gap-5">
    <h1>Gross WPM: {results.gross.toFixed(0)}</h1>
    <h1>Net WPM: {results.net < 0 ? 0 : results.net.toFixed(0)}</h1>
    <h1>
      Accuracy: {Number.isInteger(results.accuracy)
        ? results.accuracy
        : results.accuracy.toFixed(2)}%
    </h1>
  </div>
  <button
    class="p-1 rounded-md border border-black hover:bg-gray-300"
    onclick={(e) => reset(e)}>Reset</button
  >
</div>
