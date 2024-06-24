<script lang="ts">
  import type { TimeRaceProps } from "$lib/types";

  let {
    startTime,
    first = $bindable(),
    finish,
    letterPos = $bindable(),
    wordNodeArray,
    typeData = $bindable(),
  }: TimeRaceProps = $props();

  let time = $state();
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
      startTime.getMinutes() + 2,
      startTime.getSeconds() + 1
    );
    let now = new Date();
    let diff = (futureTime.getTime() - now.getTime()) / 1000;
    time = Math.floor(diff);
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

  $effect(() => {
    if (first) interval = setInterval(timer, 1000);
    if (finish) calculateResult();
  });

  timer();
</script>

<div class="flex flex-col items-center">
  <h1>{time}</h1>
  <div class="flex flex-row">
    Gross WPM: {results.gross.toFixed(0)}
    Net WPM: {results.net.toFixed(0)}
    accuracy: {Number.isInteger(results.accuracy)
      ? results.accuracy
      : results.accuracy.toFixed(2)}%
  </div>
</div>
