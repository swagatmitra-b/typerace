<script lang="ts">
  import Time from "../components/Time.svelte";
  import { browser } from "$app/environment";

  let first = $state<boolean | undefined>(undefined);
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

  const check = (key: string) => {
    if (!first) return;
    let letterDiv = wordNodeArray[letterPos] as HTMLElement;
    let letterDivBack = wordNodeArray[letterPos - 1] as HTMLElement;
    if (key == "Backspace" && letterPos != 0) {
      typeData.chars -= 1;
      if (letterDivBack.style.color == "red") typeData.errors -= 1
      if (words[letterPos - 1] != " ") letterDivBack.style.color = "black";
      else {
        if (letterDivBack.style.backgroundColor == "red") {
          letterDivBack.style.color = "white";
          letterDivBack.style.backgroundColor = "white";
        }
      }
      letterPos -= 1;
    } else if (key.length == 1) {
      typeData.chars += 1;
      if (words[letterPos] == key) {
        if (words[letterPos] != " ") letterDiv.style.color = "pink";
      } else {
        typeData.errors += 1
        if (words[letterPos] == " ") {
          letterDiv.style.color = "red";
          letterDiv.style.backgroundColor = "red";
        } else {
          letterDiv.style.color = "red";
        }
      }
      letterPos += 1;
    } else return;
  };
  $inspect(first, typeData);
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

<div class="flex flex-col min-h-screen justify-center items-center w-full">
  <!-- <div class="">
    <button onclick={fetchWords} class="border p-1 border-black">fetch</button>
  </div> -->
  <Time {start} bind:first {wordNodeArray} bind:letterPos bind:typeData />
  <div class="w-1/2 flex flex-wrap text-center justify-center select-none">
    {#each words as word}
      <span
        class={`text-2xl letter ${word.trim() ? "text-black" : "text-white"}`}
        >{word.trim() ? word : "$"}</span
      >
    {/each}
  </div>
</div>
