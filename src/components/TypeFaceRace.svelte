<script lang="ts">
  import TimeRace from "./TimeRace.svelte";
  import { browser } from "$app/environment";
  import type { Socket } from "socket.io-client";

  let {
    socket,
    data,
  }: { socket: Socket; data: { user: string; roomId: string } } = $props();

  let first = $state<boolean | undefined>(undefined);
  let fault = $state<boolean>(false);
  let start = $state<Date>(new Date());
  let words = $state<string[]>([""]);
  let typeData = $state({
    chars: 0,
    errors: 0,
  });
  let letterPos = $state(0);
  let wordNodeArray = $state<HTMLCollectionOf<Element> | []>([]);

  const fetchWords = async () => {
    const data = await fetch(
      `https://random-word-api.vercel.app/api?words=50&length=${4}`
    ).then((res) => res.json());
    words = data.flatMap((word: string) => {
      let b = word.split("");
      b.push(" ");
      return b;
    });
  };

  $inspect(fault, typeData);

  const check = (key: string) => {
    if (!first) return;
    let letterDiv = wordNodeArray[letterPos] as HTMLElement;
    let letterDivBack = wordNodeArray[letterPos - 1] as HTMLElement;
    if (key == "Backspace" && letterPos != 0) {
      wordNodeArray[letterPos - 1].classList.add("active");
      wordNodeArray[letterPos].classList.remove("active");
      typeData.chars -= 1;
      if (words[letterPos - 1] != " ") letterDivBack.style.color = "black";
      else {
        if (letterDivBack.style.backgroundColor == "red") {
          letterDivBack.style.color = "white";
          letterDivBack.style.backgroundColor = "white";
        }
      }
      letterPos -= 1;
      if (fault) fault = false;
    } else if (key.length == 1) {
      if (fault) return;
      wordNodeArray[letterPos + 1].classList.add("active");
      wordNodeArray[letterPos].classList.remove("active");
      typeData.chars += 1;
      if (words[letterPos] == key) {
        if (words[letterPos] != " ") letterDiv.style.color = "pink";
      } else {
        fault = true;
        typeData.errors += 1;
        if (words[letterPos] == " ") {
          letterDiv.style.color = "red";
          letterDiv.style.backgroundColor = "red";
        } else {
          letterDiv.style.color = "red";
        }
      }
      letterPos += 1;
    }
    socket.emit("type", data.user, data.roomId, {
      ...typeData,
      totalChars: words.length,
    });
  };

  if (browser) {
    fetchWords();
    document.addEventListener("keyup", (e) => {
      if (first == undefined) {
        first = true;
        start = new Date();
      }
      check(e.key);
    });
    wordNodeArray = document.getElementsByClassName("letter");
  }
</script>

<TimeRace {start} bind:first {wordNodeArray} bind:letterPos bind:typeData />
<div class="w-1/2 flex flex-wrap text-center justify-center select-none">
  {#each words as word}
    <span class={`text-2xl letter ${word.trim() ? "text-black" : "text-white"}`}
      >{word.trim() ? word : "$"}</span
    >
  {/each}
</div>

<style>
  .active::before {
    content: "";
    width: 1.5px;
    height: 2rem;
    background-color: black;
    position: absolute;
    animation: blink 1.2s infinite;
  }
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
