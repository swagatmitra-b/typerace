<script lang="ts">
  import type { TimeRaceProps } from "$lib/types";

  let {
    startTime,
    start = $bindable(),
    finish = $bindable(),
    data,
    socket,
    typeData = $bindable(),
  }: TimeRaceProps = $props();

  let time = $state<number>();
  let elapsed = $state(0);
  let results = $state({
    wpm: 0,
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

    if (time == 0 || finish) {
      start = false;
      finish = true;
      elapsed = (120 - time) / 60;
      calculateResult();
      socket.emit("finish", data.user, data.roomId, Math.floor(results.wpm));
      clearInterval(interval);
    }
  };

  const calculateResult = () => {
    results.wpm = typeData.chars / (5 * elapsed);
    results.accuracy =
      ((typeData.chars - typeData.errors) / typeData.chars) * 100;
  };

  $effect(() => {
    if (start) interval = setInterval(timer, 1000);
  });

  timer();
</script>

<div class="flex flex-col items-center">
  <h1>{time}</h1>
  <div class="flex flex-row">
    WPM: {Math.floor(results.wpm)}
    accuracy: {Number.isInteger(results.accuracy)
      ? results.accuracy
      : results.accuracy.toFixed(2)}%
  </div>
</div>
